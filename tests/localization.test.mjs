import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultScenario,
  validateScenario,
  routePoint,
  totalDistance,
  bendDistance,
  serializeScenario,
  parseScenario,
} from "../src/scenario.mjs";
import {
  assess,
  selectedPoint,
  baselineAt,
  initialParts,
  rangeJacobian,
  scalarUpdate,
} from "../src/localization.mjs";
import {
  sum,
  zeros,
  eigenSymmetric,
  multiply,
  transpose,
} from "../src/covariance.mjs";
const close = (a, b, tol = 1e-8) =>
  assert.ok(
    Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)),
    `${a} != ${b}`,
  );
const matrixClose = (a, b, tol) =>
  a.forEach((r, i) => r.forEach((v, j) => close(v, b[i][j], tol)));
const end = (s) => assess(s).points.at(-1);
function zero() {
  const s = defaultScenario();
  for (const k of [
    "motionH_m",
    "motionU_m",
    "initH_m",
    "initU_m",
    "landerH_m",
    "landerU_m",
    "heading_deg",
    "mapControl_m",
  ])
    s[k] = 0;
  return s;
}

test("route has a 150 m flat approach and a true-distance ascending bent leg", () => {
  const s = defaultScenario();
  assert.deepEqual(routePoint(s, 150), [150, 0, 0]);
  close(routePoint(s, 550)[2], 80);
  for (const [a, b] of [
    [150, 200],
    [350, 400],
    [400, 550],
  ]) {
    const p = routePoint(s, a),
      q = routePoint(s, b);
    close(Math.hypot(...p.map((v, i) => v - q[i])), b - a);
  }
  s.ravineLength_m = 0;
  s.climb_m = 0;
  assert.equal(totalDistance(s), 150);
  assert.deepEqual(routePoint(s, 500), [150, 0, 0]);
});
test("zero prior and motion uncertainty gives zero uncertainty even with observations", () => {
  const s = zero();
  s.uwbEnabled = s.mapEnabled = true;
  assert.deepEqual(end(s).selected, zeros(3));
});
test("starting-position covariance translates the complete trajectory together", () => {
  const s = zero();
  s.landerH_m = 8;
  s.landerU_m = 3;
  for (const p of assess(s).points) {
    assert.deepEqual(p.selectedSigma, [8, 8, 3]);
    close(p.stateCovariance[0][4], 64);
    close(p.stateCovariance[2][6], 9);
  }
});
test("heading displacement is proportional to horizontal distance from origin with EN correlation", () => {
  const s = zero();
  s.heading_deg = 1;
  const p = end(s),
    [e, n] = p.position,
    v = (Math.PI / 180) ** 2;
  close(p.selected[0][0], n * n * v);
  close(p.selected[1][1], e * e * v);
  close(p.selected[0][1], -e * n * v);
  close(p.selected[2][2], 0);
});
test("motion variance is sigma100 squared times distance walked / 100", () => {
  const s = zero();
  s.motionH_m = 2;
  s.motionU_m = 1;
  for (const p of assess(s, { step: 31 }).points) {
    close(p.selected[0][0], (4 * p.distance) / 100);
    close(p.selected[2][2], p.distance / 100);
  }
});
test("route subdivision does not change the baseline or either observation method", () => {
  const s = defaultScenario();
  s.uwbEnabled = s.mapEnabled = true;
  const distances = [0, 75, 150, 220, 330, 477, totalDistance(s)];
  const a = assess(s, { step: 2, distances }),
    b = assess(s, { step: 37, distances });
  for (const d of distances)
    matrixClose(
      selectedPoint(a, d).stateCovariance,
      selectedPoint(b, d).stateCovariance,
    );
});
test("one range reduces line-of-sight uncertainty, not cross-track, up or heading", () => {
  const s = zero();
  s.initH_m = s.initU_m = 2;
  s.uwbEnabled = true;
  s.uwbSpacing_m = 1000;
  const parts = initialParts(s);
  scalarUpdate(parts, rangeJacobian([100, 0, 0]), 0.04, "range");
  const p = sum(Object.values(parts));
  close(p[0][0], (4 * 0.04) / 4.04);
  close(p[1][1], 4);
  close(p[2][2], 4);
  assert.equal(
    rangeJacobian([0, 0, 0]).reduce((v, x) => v + Math.abs(x), 0),
    0,
  );
  const tilted = initialParts(s);
  scalarUpdate(tilted, rangeJacobian([100, 0, 100]), 0.04, "range");
  const q = sum(Object.values(tilted));
  assert.ok(q[0][2] < 0);
  close(q[1][1], 4);
});
test("lander-relative ranges cannot remove shared global translation", () => {
  const s = zero();
  s.landerH_m = 8;
  s.landerU_m = 3;
  s.uwbEnabled = true;
  s.terrainOcclusion = false;
  s.uwbSpacing_m = 5;
  assert.deepEqual(end(s).selectedSigma, [8, 8, 3]);
});
test("repeated map matches retain shared map control error", () => {
  const s = zero();
  s.landerH_m = 1000;
  s.mapControl_m = 5;
  s.matchSigma_m = 0.5;
  s.mapSpacing_m = 5;
  s.mapEnabled = true;
  const p = end(s);
  assert.ok(p.selectedSigma[0] > 4.999 && p.selectedSigma[0] < 5.001);
  close(p.selectedSigma[2], 0);
  assert.ok(p.stateCovariance[0][7] > 24.99);
  s.mapControl_m = 0;
  assert.ok(end(s).selectedSigma[0] < 0.05);
});
test("map measurements have no direct height or heading component", () => {
  const s = defaultScenario();
  s.mapEnabled = true;
  s.heading_deg = 0;
  const p = end(s);
  close(p.selectedSigma[2], p.baselineSigma[2]);
});
test("blocked, out-of-range and unavailable observations have no effect", () => {
  const s = defaultScenario();
  s.uwbEnabled = true;
  s.maxRange_m = 0;
  const r = assess(s);
  for (const p of r.points) matrixClose(p.selected, p.baseline);
  s.uwbEnabled = false;
  s.mapEnabled = true;
  s.mapAvailable = false;
  for (const p of assess(s).points) matrixClose(p.selected, p.baseline);
  s.uwbEnabled = true;
  s.mapEnabled = false;
  s.maxRange_m = 1500;
  s.terrainOcclusion = true;
  assert.ok(
    assess(s)
      .events.filter((e) => e.distance > bendDistance(s))
      .every((e) => !e.applied && /Blocked/.test(e.status)),
  );
});
test("zero information and infinite measurement noise do not improve covariance (issue #10)", () => {
  const s = defaultScenario(),
    parts = baselineAt(s, 200),
    before = sum(Object.values(parts));
  scalarUpdate(parts, Array(9).fill(0), 1, "match");
  matrixClose(sum(Object.values(parts)), before);
  scalarUpdate(parts, rangeJacobian([200, 0, 0]), Infinity, "range");
  matrixClose(sum(Object.values(parts)), before);
});
test("future observations cannot alter past estimates", () => {
  const s = defaultScenario(),
    distances = [25, 75, 149];
  const a = assess(s, { distances });
  s.mapEnabled = s.uwbEnabled = true;
  s.mapSpacing_m = s.uwbSpacing_m = 150;
  const b = assess(s, { distances });
  for (const d of distances)
    matrixClose(selectedPoint(a, d).selected, selectedPoint(b, d).selected);
});
test("local navigation excludes global origin and initial heading knowledge", () => {
  const s = defaultScenario(),
    a = end(s);
  s.landerH_m = 100;
  s.landerU_m = 50;
  s.heading_deg = 8;
  assert.deepEqual(end(s).localSigma, a.localSigma);
});
test("joint and source covariance remain symmetric and positive semidefinite; sources sum", () => {
  const s = defaultScenario();
  s.mapEnabled = s.uwbEnabled = true;
  s.terrainOcclusion = false;
  for (const p of assess(s, { step: 29 }).points) {
    for (const m of [p.stateCovariance, ...Object.values(p.contributions)]) {
      matrixClose(m, transpose(m));
      assert.ok(Math.min(...eigenSymmetric(m).values) > -1e-8);
    }
    matrixClose(sum(Object.values(p.contributions)), p.selected);
    const improvement = p.baseline.map((r, i) =>
      r.map((v, j) => v - p.selected[i][j]),
    );
    assert.ok(Math.min(...eigenSymmetric(improvement).values) > -1e-7);
  }
});
test("Jacobi eigensystem reconstructs correlated position covariance", () => {
  const p = end(defaultScenario()).selected,
    { values, vectors } = eigenSymmetric(p);
  const d = values.map((v, i) => values.map((_, j) => (i === j ? v : 0)));
  matrixClose(multiply(multiply(vectors, d), transpose(vectors)), p);
});
test("independent seeded Monte Carlo agrees with analytic baseline", () => {
  let seed = 1234567;
  const uniform = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return (seed + 1) / 4294967297;
  };
  const normal = () =>
    Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
  const s = defaultScenario(),
    d = totalDistance(s),
    [e, n] = routePoint(s, d),
    count = 60000,
    mean = [0, 0, 0],
    second = zeros(3);
  for (let k = 0; k < count; k++) {
    const translation = [
        normal() * s.landerH_m,
        normal() * s.landerH_m,
        normal() * s.landerU_m,
      ],
      yaw = (normal() * s.heading_deg * Math.PI) / 180;
    const error = translation.map(
      (v, i) =>
        v +
        normal() * (i === 2 ? s.initU_m : s.initH_m) +
        normal() * (i === 2 ? s.motionU_m : s.motionH_m) * Math.sqrt(d / 100) +
        [-n * yaw, e * yaw, 0][i],
    );
    error.forEach((v, i) => {
      mean[i] += v / count;
      error.forEach((w, j) => (second[i][j] += (v * w) / count));
    });
  }
  const empirical = second.map((r, i) =>
      r.map((v, j) => v - mean[i] * mean[j]),
    ),
    expected = end(s).baseline;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      assert.ok(
        Math.abs(empirical[i][j] - expected[i][j]) <
          0.025 * Math.sqrt(expected[i][i] * expected[j][j]),
      );
});
test("saved scenarios reproduce outputs and reject invalid, missing and unsupported inputs", () => {
  const s = defaultScenario();
  s.uwbEnabled = s.mapEnabled = true;
  assert.deepEqual(assess(parseScenario(serializeScenario(s))), assess(s));
  for (const value of [null, undefined, "", NaN, Infinity, -1, "1"]) {
    const bad = { ...s, motionH_m: value };
    assert.ok(validateScenario(bad).length);
    assert.throws(() => assess(bad));
  }
  for (const bad of [
    { ...s, climb_m: 500 },
    { ...s, version: 2 },
    { ...s, frame: "unknown" },
    { ...s, mapEnabled: "yes" },
    { ...s, assumptions: {} },
  ])
    assert.throws(() => serializeScenario(bad));
  assert.throws(() => parseScenario("{broken"));
  assert.throws(() => assess(s, { step: 0 }));
});

test("near-identical floating point grid locations apply each observation once", () => {
  const s = defaultScenario();
  s.mapEnabled = true;
  s.mapSpacing_m = 10.1;
  const a = assess(s, { step: 10.1, distances: [60.6] });
  const b = assess(s, { step: 2.02, distances: [60.6] });
  assert.equal(
    a.points.filter((p) => Math.abs(p.distance - 60.6) < 1e-8).length,
    2,
  );
  matrixClose(
    selectedPoint(a, 60.6).stateCovariance,
    selectedPoint(b, 60.6).stateCovariance,
  );
});
