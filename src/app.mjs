import {
  INPUTS,
  defaultScenario,
  validateScenario,
  totalDistance,
  bendDistance,
  serializeScenario,
  parseScenario,
  uwbAvailability,
} from "./scenario.mjs";
import { assess, selectedPoint } from "./localization.mjs";
import { blockedDemo, mapDemo } from "./demonstrations.mjs";
const $ = (id) => document.getElementById(id),
  fmt = (n, d = 2) => n.toFixed(d);
const INPUT_LABELS = {
  ravineLength_m: "Ravine distance",
  climb_m: "Climb",
  motionH_m: "Horizontal σ",
  motionU_m: "Up σ",
  initH_m: "Horizontal σ",
  initU_m: "Up σ",
  landerH_m: "Lander horizontal σ",
  landerU_m: "Lander up σ",
  heading_deg: "Initial heading σ",
  rangeSigma_m: "Range σ",
  maxRange_m: "Maximum range",
  uwbSpacing_m: "Observation spacing",
  matchSigma_m: "Match σ",
  mapControl_m: "Shared map error σ",
  mapSpacing_m: "Observation spacing",
};
const SOURCE_LABELS = {
  start: "Lander position",
  heading: "Initial heading",
  initialization: "Rover start",
  motion: "Motion",
  control: "Shared map error",
  range: "Range measurement",
  match: "Map match",
};
let scenario = defaultScenario(),
  cursor = 330,
  scheduled = false;
function setStatus(message, error = false) {
  $("saveStatus").hidden = !message;
  $("saveStatus").textContent = message;
  $("saveStatus").classList.toggle("error", error);
}
try {
  const saved = localStorage.getItem("ll-sprint-1");
  if (saved) scenario = parseScenario(saved);
} catch {
  setStatus("Saved scenario is invalid. Using default inputs.", true);
}
for (const [key, d] of Object.entries(INPUTS)) {
  const row = document.createElement("div"),
    range = d.group === "mission",
    unit = d.unit.replace(" / axis", "").replace(" walked", "");
  row.className = `input-row${range ? " range-row" : ""}`;
  row.innerHTML = `<label for="${key}">${INPUT_LABELS[key]}</label><input id="${key}" type="number" min="${d.min}" max="${d.max}" step="${d.step}" aria-label="${INPUT_LABELS[key]}: ${d.label}" aria-describedby="inputAssumptions ${key}Unit"><span id="${key}Unit" class="unit">${unit}</span>${range ? `<input id="${key}Range" type="range" min="${d.min}" max="${d.max}" step="${d.step}" aria-label="${d.label} slider">` : ""}`;
  $(
    key.startsWith("init") ? "initializationInputs" : `${d.group}Inputs`,
  ).append(row);
  const update = (value, fromRange = false) => {
    scenario[key] = value === "" ? null : Number(value);
    if (fromRange) $(key).value = value;
    else if (range) $(`${key}Range`).value = value;
    setStatus("");
    queueRender();
  };
  $(key).addEventListener("input", () => update($(key).value));
  if (range)
    $(`${key}Range`).addEventListener("input", () =>
      update($(`${key}Range`).value, true),
    );
}
function syncControls() {
  $("scenarioName").value = scenario.name;
  for (const k of Object.keys(INPUTS)) {
    $(k).value = scenario[k] ?? "";
    if ($(`${k}Range`)) $(`${k}Range`).value = scenario[k] ?? 0;
  }
  for (const k of [
    "uwbEnabled",
    "mapEnabled",
    "terrainOcclusion",
    "mapAvailable",
  ])
    $(k).checked = scenario[k];
  $("uwbDetails").open = scenario.uwbEnabled;
  $("mapDetails").open = scenario.mapEnabled;
}
function queueRender() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    render();
  });
}
function selectDistance(d) {
  cursor = Math.max(0, Math.min(totalDistance(scenario), Math.round(d)));
  $("routeCursor").value = cursor;
  queueRender();
}
$("scenarioName").addEventListener("input", () => {
  scenario.name = $("scenarioName").value;
  setStatus("");
  queueRender();
});
for (const k of [
  "uwbEnabled",
  "mapEnabled",
  "terrainOcclusion",
  "mapAvailable",
])
  $(k).addEventListener("change", () => {
    scenario[k] = $(k).checked;
    if (k === "uwbEnabled") $("uwbDetails").open = scenario[k];
    if (k === "mapEnabled") $("mapDetails").open = scenario[k];
    setStatus("");
    queueRender();
  });
$("toggleInputs").addEventListener("click", () => {
  const open = $("workspace").classList.toggle("inputs-open");
  $("toggleInputs").setAttribute("aria-expanded", open);
  if (!open) window.scrollTo({ top: 0 });
});
$("routeCursor").addEventListener("input", () =>
  selectDistance(Number($("routeCursor").value)),
);
$("yScale").addEventListener("change", queueRender);
function replace(s, d) {
  scenario = s;
  cursor = Math.min(d, totalDistance(s));
  syncControls();
  queueRender();
}
$("reset").addEventListener("click", () => {
  replace(defaultScenario(), 330);
  setStatus("");
});
$("blockedDemo").addEventListener("click", () => {
  replace(blockedDemo(), 400);
  setStatus("Loaded: blocked UWB.");
});
$("mapDemo").addEventListener("click", () => {
  replace(mapDemo(), 550);
  setStatus("Loaded: shared map error.");
});
$("save").addEventListener("click", () => {
  try {
    const json = serializeScenario(scenario);
    localStorage.setItem("ll-sprint-1", json);
    const url = URL.createObjectURL(
        new Blob([json], { type: "application/json" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download =
      scenario.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Saved in this browser. File download started.");
  } catch (e) {
    setStatus(`Cannot save. ${e.message}`, true);
  }
});
$("load").addEventListener("click", () => $("loadFile").click());
$("loadFile").addEventListener("change", async () => {
  const file = $("loadFile").files[0];
  if (!file) return;
  try {
    if (file.size > 100000)
      throw new Error("File must be smaller than 100 kB.");
    replace(parseScenario(await file.text()), cursor);
    setStatus(`Loaded: ${file.name}`);
  } catch (e) {
    setStatus(`Cannot load. ${e.message}`, true);
  }
  $("loadFile").value = "";
});
const BLUE = "#2364ad";
const BASELINE = "#66717c";
const chartHeight = 144;
const left = 46,
  right = 16,
  top = 24,
  bottom = 20;
function choosePoint(event) {
  const box = event.currentTarget.getBoundingClientRect();
  selectDistance(
    ((event.clientX - box.left - left) / (box.width - left - right)) *
      totalDistance(scenario),
  );
}
function linkPlot(element) {
  element.addEventListener("pointerdown", (event) => {
    element.setPointerCapture(event.pointerId);
    choosePoint(event);
  });
  element.addEventListener("pointermove", (event) => {
    if (event.buttons === 1) choosePoint(event);
  });
}
for (const [i, axis] of ["East", "North", "Up"].entries()) {
  const figure = document.createElement("figure");
  figure.className = "plot";
  figure.id = `plotCard${i}`;
  figure.innerHTML = `<figcaption><h3>${axis}</h3><output id="sigma${i}" class="plot-value"></output><span id="baseline${i}" class="plot-baseline"></span></figcaption><svg id="plot${i}" role="img" aria-label="${axis} position uncertainty versus distance walked"></svg>`;
  $("plots").append(figure);
  linkPlot($(`plot${i}`));
}
new ResizeObserver(queueRender).observe($("plots"));
function legend(method) {
  return `<span><i class="line baseline"></i>Baseline</span>${method ? `<span><i class="line"></i>${method}</span>` : ""}`;
}
function tickLabel(value) {
  if (value === 0) return "0";
  return Math.abs(value) < 0.01
    ? value.toExponential(1)
    : String(Number(value.toPrecision(3)));
}
function yDomain(peak) {
  if (peak === 0) return { max: 1, step: 0.25 };
  const raw = peak * 1.08,
    target = raw / 4;
  const power = 10 ** Math.floor(Math.log10(target));
  const step = [1, 2, 2.5, 5, 10]
    .map((n) => n * power)
    .find((n) => n >= target);
  return { max: Math.ceil(raw / step) * step, step };
}
function xTicks(total, width) {
  const count = Math.max(3, Math.min(7, Math.floor(width / 80)));
  const raw = total / (count - 1),
    power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10]
    .map((n) => n * power)
    .reduce((best, n) => (Math.abs(n - raw) < Math.abs(best - raw) ? n : best));
  const ticks = [];
  for (let d = 0; d <= total; d += step) ticks.push(d);
  return ticks;
}
function plot(result, point, axis, hasMethod, domain) {
  const max = domain.max;
  const element = $(`plot${axis}`),
    width = element.getBoundingClientRect().width;
  if (width <= left + right) return;
  const total = totalDistance(scenario),
    height = chartHeight;
  const x = (d) => left + ((width - left - right) * d) / total;
  const y = (v) => height - bottom - ((height - top - bottom) * v) / max;
  element.setAttribute("viewBox", `0 0 ${width} ${height}`);
  element.dataset.yMax = max;
  let svg = "";
  for (let i = 0; i <= Math.round(max / domain.step); i++) {
    const value = i * domain.step,
      yy = y(value);
    svg += `<line class="gridline" x1="${left}" x2="${width - right}" y1="${yy}" y2="${yy}"/><text x="${left - 9}" y="${yy + 4}" text-anchor="end">${tickLabel(value)}</text>`;
  }
  for (const d of xTicks(total, width - left - right)) {
    svg += `<line class="x-grid" x1="${x(d)}" x2="${x(d)}" y1="${top}" y2="${height - bottom}"/>`;
    if (axis === 2)
      svg += `<text x="${x(d)}" y="${height - 3}" text-anchor="middle">${tickLabel(d)}</text>`;
  }
  let previousLabel = -Infinity;
  for (const [d, label] of scenario.ravineLength_m > 0
    ? [
        [150, "Ravine"],
        [bendDistance(scenario), "Bend"],
      ]
    : []) {
    svg += `<line class="route-marker" x1="${x(d)}" x2="${x(d)}" y1="${top}" y2="${height - bottom}"/>`;
    if (axis === 0 && x(d) - previousLabel > 65) {
      svg += `<text class="route-label" x="${Math.min(width - right - 36, x(d) + 4)}" y="13">${label}</text>`;
      previousLabel = x(d);
    }
  }
  const path = (key) =>
    result.points
      .map(
        (p, j) =>
          `${j ? "L" : "M"}${x(p.distance).toFixed(2)},${y(p[key][axis]).toFixed(2)}`,
      )
      .join(" ");
  svg += `<path class="baseline-line" d="${path("baselineSigma")}"/>`;
  if (hasMethod)
    svg += `<path class="selected-line" d="${path("selectedSigma")}"/>`;
  svg += `<line class="cursor-line" x1="${x(cursor)}" x2="${x(cursor)}" y1="${top}" y2="${height - bottom}"/><circle cx="${x(cursor)}" cy="${y(point.selectedSigma[axis])}" r="3" fill="${hasMethod ? BLUE : BASELINE}"/>`;
  element.innerHTML = svg;
  $(`plotCard${axis}`).classList.toggle("has-method", hasMethod);
  $(`sigma${axis}`).innerHTML =
    `${fmt(point.selectedSigma[axis])}<small> m</small>`;
  $(`sigma${axis}`).dataset.value = point.selectedSigma[axis];
  const reduction =
    point.baselineSigma[axis] > 0
      ? Math.max(
          0,
          100 * (1 - point.selectedSigma[axis] / point.baselineSigma[axis]),
        )
      : 0;
  const percent = (
    point.selectedSigma[axis] > 0 ? Math.min(99.9, reduction) : reduction
  )
    .toFixed(1)
    .replace(/\.0$/, "");
  const change =
    reduction < 1e-9
      ? "no change"
      : reduction < 0.1
        ? "<0.1% lower"
        : `${percent}% lower`;
  $(`baseline${axis}`).textContent = hasMethod
    ? `${fmt(point.baselineSigma[axis])} baseline
${change}`
    : "";
}
function drawObservations(result) {
  const tracks = $("observationTracks");
  tracks.hidden = !scenario.uwbEnabled && !scenario.mapEnabled;
  const kinds = [
    ["uwb", scenario.uwbEnabled, "UWB"],
    ["map", scenario.mapEnabled, "Map"],
  ].filter(([, enabled]) => enabled);
  tracks.innerHTML = kinds
    .map(
      ([kind, , label]) =>
        `<div class="observation-track"><span>${label}</span><svg id="${kind}Track" role="img" aria-label="${label} observation locations"></svg></div>`,
    )
    .join("");
  for (const [kind] of kinds) {
    const svg = $(`${kind}Track`),
      width = svg.getBoundingClientRect().width;
    const x = (d) =>
      left + ((width - left - right) * d) / totalDistance(scenario);
    svg.setAttribute("viewBox", `0 0 ${width} 26`);
    svg.innerHTML =
      `<line class="track-line" x1="${left}" x2="${width - right}" y1="13" y2="13"/>` +
      result.events
        .filter((e) => e.kind === kind)
        .map((e) =>
          e.applied
            ? `<circle cx="${x(e.distance)}" cy="13" r="3" class="observation-applied" opacity="${e.distance <= cursor ? 1 : 0.35}"/>`
            : `<path d="M${x(e.distance) - 3},10 l6,6 M${x(e.distance) - 3},16 l6,-6" class="observation-unavailable" opacity="${e.distance <= cursor ? 1 : 0.4}"/>`,
        )
        .join("") +
      `<line class="cursor-line" x1="${x(cursor)}" x2="${x(cursor)}" y1="2" y2="24"/>`;
    linkPlot(svg);
  }
  if (kinds.length)
    tracks.insertAdjacentHTML(
      "beforeend",
      '<p class="track-key"><span>● Available</span><span>× Unavailable</span><span>Faint: future</span></p>',
    );
}
function render() {
  const errors = validateScenario(scenario);
  $("validation").hidden = !errors.length;
  $("validation").textContent = errors.join(" ");
  $("assessment").hidden = !!errors.length;
  $("save").disabled = !!errors.length;
  for (const [key, d] of Object.entries(INPUTS)) {
    const invalid = errors.some(
      (e) =>
        e.startsWith(d.label) || (key === "climb_m" && e.startsWith("Climb")),
    );
    $(key).setAttribute("aria-invalid", invalid);
    if (invalid && $(key).closest("details"))
      $(key).closest("details").open = true;
  }
  $("scenarioName").setAttribute(
    "aria-invalid",
    errors.some((e) => e.startsWith("Scenario name")),
  );
  if (errors.length) return;
  cursor = Math.min(cursor, totalDistance(scenario));
  $("routeCursor").max = totalDistance(scenario);
  $("routeCursor").value = cursor;
  const result = assess(scenario, { distances: [cursor] }),
    p = selectedPoint(result, cursor),
    hasMethod = scenario.uwbEnabled || scenario.mapEnabled,
    method =
      scenario.uwbEnabled && scenario.mapEnabled
        ? "UWB + map"
        : scenario.uwbEnabled
          ? "UWB range"
          : scenario.mapEnabled
            ? "Orbital map"
            : "";
  $("routeSummary").innerHTML =
    `<span>Approach <strong>150 m</strong></span><span>Total <strong>${totalDistance(scenario)} m</strong></span>`;
  $("distanceReadout").textContent = `${cursor} m`;
  $("endLabel").textContent = `${totalDistance(scenario)} m`;
  const status = uwbAvailability(scenario, cursor),
    link = [];
  if (scenario.uwbEnabled)
    link.push({
      name: "UWB",
      message:
        status === "Available"
          ? "available"
          : status.startsWith("Blocked")
            ? "blocked"
            : status.startsWith("Outside")
              ? "out of range"
              : "no range direction",
      blocked: status !== "Available",
      title: status,
    });
  if (scenario.mapEnabled)
    link.push({
      name: "Map",
      message: scenario.mapAvailable ? "available" : "unavailable",
      blocked: !scenario.mapAvailable,
      title: "Assumed map availability",
    });
  $("linkStatus").hidden = !hasMethod;
  $("linkStatus").innerHTML = link
    .map(
      ({ name, message, blocked, title }) =>
        `<span class="${blocked ? "blocked" : ""}" title="${title}">${name}: ${message}</span>`,
    )
    .join("");
  $("plotLegend").innerHTML = legend(method);
  const peaks = [0, 1, 2].map((i) =>
    Math.max(...result.points.map((p) => p.baselineSigma[i])),
  );
  const sharedDomain = yDomain(Math.max(...peaks));
  for (let i = 0; i < 3; i++)
    plot(
      result,
      p,
      i,
      hasMethod,
      $("yScale").value === "shared" ? sharedDomain : yDomain(peaks[i]),
    );
  drawObservations(result);
  const traces = Object.entries(p.contributions)
      .map(([k, c]) => ({ key: k, value: c.reduce((v, r, i) => v + r[i], 0) }))
      .sort((a, b) => b.value - a.value),
    trace = traces.reduce((v, t) => v + t.value, 0);
  $("contributions").innerHTML =
    trace > 1e-12
      ? traces
          .filter((t) => t.value > 1e-10)
          .map((t) => {
            const share = (100 * t.value) / trace;
            return `<div class="contribution"><span>${SOURCE_LABELS[t.key]}</span><div class="bar-track"><div class="bar-fill" style="width:${share}%"></div></div><span>${share < 1 ? "&lt;1" : Math.round(share)}%</span></div>`;
          })
          .join("")
      : '<p class="empty-state">No uncertainty.</p>';
  $("contributionContext").textContent = `${cursor} m`;
  const rows = [
    ["Local", p.localSigma, "local-row"],
    ["Baseline", p.baselineSigma, "baseline-row"],
  ];
  if (scenario.uwbEnabled && scenario.mapEnabled) {
    rows.push([
      "UWB only",
      selectedPoint(
        assess({ ...scenario, mapEnabled: false }, { distances: [cursor] }),
        cursor,
      ).selectedSigma,
      "",
    ]);
    rows.push([
      "Map only",
      selectedPoint(
        assess({ ...scenario, uwbEnabled: false }, { distances: [cursor] }),
        cursor,
      ).selectedSigma,
      "",
    ]);
  }
  if (hasMethod) rows.push([method, p.selectedSigma, "selected-row"]);
  $("comparisonRows").innerHTML = rows
    .map(
      ([label, v, className]) =>
        `<tr class="${className}"><td>${label}</td>${v.map((n) => `<td>${fmt(n)}</td>`).join("")}</tr>`,
    )
    .join("");
  const past = result.events.filter((e) => e.distance <= cursor),
    applied = past.filter((e) => e.applied);
  $("observationPanel").hidden = !hasMethod;
  $("observationCount").textContent =
    `${applied.length} applied · ${past.length - applied.length} unavailable`;
  $("observationLog").innerHTML = result.events.length
    ? result.events
        .map(
          (e) =>
            `<button class="event ${e.applied ? "" : "blocked"} ${e.distance > cursor ? "future" : ""} ${e.distance === cursor ? "current" : ""}" data-distance="${e.distance}">${e.kind === "uwb" ? "UWB" : "MAP"} · ${e.distance} m<small>${e.distance > cursor ? "Future · " : ""}${e.status}</small></button>`,
        )
        .join("")
    : '<p class="empty-state">No observations on this route.</p>';
  for (const b of $("observationLog").querySelectorAll("button"))
    b.addEventListener("click", () =>
      selectDistance(Number(b.dataset.distance)),
    );
}
syncControls();
render(true);
