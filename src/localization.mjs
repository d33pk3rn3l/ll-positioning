/** Causal first-order covariance filter. State: rover ENU, yaw, lander ENU, map EN.
 * Each independent prior/noise source keeps a full 9x9 covariance contribution.
 * Conditioning never discards rover/heading/lander/map cross-covariances.
 */
import {
  zeros,
  identity,
  add,
  sum,
  sandwich,
  outer,
  scale,
  symmetrize,
} from "./covariance.mjs";
import {
  validateScenario,
  totalDistance,
  routePoint,
  uwbAvailability,
  bendDistance,
} from "./scenario.mjs";
const N = 9;
export const SOURCE_NAMES = {
  start: "Starting position",
  heading: "Initial heading",
  initialization: "Rover initialization",
  motion: "Accumulated motion",
  control: "Shared map control",
  range: "Range noise",
  match: "Map match noise",
};
export function initialParts(s) {
  const parts = Object.fromEntries(
    Object.keys(SOURCE_NAMES).map((k) => [k, zeros(N)]),
  );
  for (let i = 0; i < 3; i++) {
    const v = (i === 2 ? s.landerU_m : s.landerH_m) ** 2;
    parts.start[i][i] =
      parts.start[i + 4][i + 4] =
      parts.start[i][i + 4] =
      parts.start[i + 4][i] =
        v;
    parts.initialization[i][i] = (i === 2 ? s.initU_m : s.initH_m) ** 2;
  }
  parts.heading[3][3] = ((s.heading_deg * Math.PI) / 180) ** 2;
  parts.control[7][7] = parts.control[8][8] = s.mapControl_m ** 2;
  return parts;
}
function propagate(parts, s, previous, d) {
  const a = routePoint(s, previous),
    b = routePoint(s, d),
    f = identity(N);
  f[0][3] = -(b[1] - a[1]);
  f[1][3] = b[0] - a[0];
  for (const k of Object.keys(parts)) parts[k] = sandwich(f, parts[k]);
  for (let i = 0; i < 3; i++)
    parts.motion[i][i] +=
      ((i === 2 ? s.motionU_m : s.motionH_m) ** 2 * (d - previous)) / 100;
}
/** Joseph form, including attribution of measurement noise. Zero information is a no-op. */
export function scalarUpdate(parts, h, variance, source) {
  const p = sum(Object.values(parts)),
    ph = p.map((r) => r.reduce((v, x, j) => v + x * h[j], 0));
  const innovation = h.reduce((v, x, i) => v + x * ph[i], variance);
  if (
    !Number.isFinite(variance) ||
    !(innovation > 0) ||
    h.every((x) => x === 0)
  )
    return;
  const gain = ph.map((v) => v / innovation),
    a = identity(N).map((r, i) => r.map((v, j) => v - gain[i] * h[j]));
  for (const k of Object.keys(parts))
    parts[k] = symmetrize(sandwich(a, parts[k]));
  parts[source] = add(parts[source], scale(outer(gain), variance));
}
export function rangeJacobian(position) {
  const r = Math.hypot(...position),
    h = Array(N).fill(0);
  if (r > 0)
    for (let i = 0; i < 3; i++) {
      h[i] = position[i] / r;
      h[i + 4] = -h[i];
    }
  return h;
}
export function observationSchedule(s) {
  const events = [];
  for (const [kind, enabled, spacing] of [
    ["uwb", s.uwbEnabled, s.uwbSpacing_m],
    ["map", s.mapEnabled, s.mapSpacing_m],
  ]) {
    if (enabled)
      for (let i = 1; i * spacing <= totalDistance(s) + 1e-8; i++) {
        const d = i * spacing,
          status =
            kind === "uwb"
              ? uwbAvailability(s, d)
              : s.mapAvailable
                ? "Available"
                : "Map unavailable";
        events.push({
          kind,
          distance: d,
          position: routePoint(s, d),
          status,
          applied: status === "Available",
        });
      }
  }
  return events.sort(
    (a, b) => a.distance - b.distance || a.kind.localeCompare(b.kind),
  );
}
const positionCovariance = (p) => p.slice(0, 3).map((r) => r.slice(0, 3));
export const sigmas = (p) => p.map((r, i) => Math.sqrt(Math.max(0, r[i])));
export function baselineAt(s, d) {
  const parts = initialParts(s);
  propagate(parts, s, 0, d);
  return parts;
}
function snapshot(s, d, parts, phase) {
  const full = sum(Object.values(parts)),
    baselineParts = baselineAt(s, d),
    baseline = positionCovariance(sum(Object.values(baselineParts)));
  const selected = positionCovariance(full),
    contributions = Object.fromEntries(
      Object.entries(parts).map(([k, p]) => [k, positionCovariance(p)]),
    );
  const local = [
    s.initH_m ** 2 + (s.motionH_m ** 2 * d) / 100,
    s.initH_m ** 2 + (s.motionH_m ** 2 * d) / 100,
    s.initU_m ** 2 + (s.motionU_m ** 2 * d) / 100,
  ].map(Math.sqrt);
  return {
    distance: d,
    phase,
    position: routePoint(s, d),
    baseline,
    selected,
    baselineSigma: sigmas(baseline),
    selectedSigma: sigmas(selected),
    localSigma: local,
    contributions,
    baselineContributions: Object.fromEntries(
      Object.entries(baselineParts).map(([k, p]) => [k, positionCovariance(p)]),
    ),
    stateCovariance: full,
  };
}
export function assess(s, { step = 5, distances = [] } = {}) {
  const errors = validateScenario(s);
  if (errors.length) throw new Error(errors.join("\n"));
  if (!Number.isFinite(step) || step <= 0)
    throw new Error("Display step must be positive.");
  if (
    distances.some((d) => !Number.isFinite(d) || d < 0 || d > totalDistance(s))
  )
    throw new Error("Requested distance is outside the route.");
  const events = observationSchedule(s),
    grid = new Set([
      0,
      150,
      bendDistance(s),
      totalDistance(s),
      ...distances,
      ...events.map((e) => e.distance),
    ]);
  for (let i = 1; i * step < totalDistance(s); i++) grid.add(i * step);
  const parts = initialParts(s),
    points = [];
  let previous = 0;
  for (const d of [...grid]
    .sort((a, b) => a - b)
    .filter((d, i, a) => i === 0 || d - a[i - 1] > 1e-8)) {
    propagate(parts, s, previous, d);
    previous = d;
    const here = events.filter((e) => Math.abs(e.distance - d) < 1e-8);
    if (here.some((e) => e.applied))
      points.push(snapshot(s, d, parts, "before"));
    for (const e of here)
      if (e.applied) {
        if (e.kind === "uwb")
          scalarUpdate(
            parts,
            rangeJacobian(e.position),
            s.rangeSigma_m ** 2,
            "range",
          );
        else
          for (let i = 0; i < 2; i++) {
            const h = Array(N).fill(0);
            h[i] = 1;
            h[i + 7] = -1;
            scalarUpdate(parts, h, s.matchSigma_m ** 2, "match");
          }
      }
    points.push(snapshot(s, d, parts, "after"));
  }
  return { points, events };
}
export function selectedPoint(result, d) {
  return (
    result.points.findLast(
      (p) => p.distance <= d + 1e-8 && p.phase === "after",
    ) || result.points[0]
  );
}
