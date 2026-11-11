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
import { RouteViewport } from "./viewport.mjs";
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
  mode = "global",
  viewport = null,
  scheduled = false,
  pendingMissionChange = false;
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
    queueRender(range);
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
function queueRender(missionChanged = false) {
  pendingMissionChange ||= missionChanged;
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    render(pendingMissionChange);
    pendingMissionChange = false;
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
for (const view of ["local", "global"])
  $(`${view}View`).addEventListener("click", () => {
    mode = view;
    for (const v of ["local", "global"]) {
      $(`${v}View`).classList.toggle("active", v === mode);
      $(`${v}View`).setAttribute("aria-pressed", v === mode);
    }
    viewport?.setMode(mode);
    queueRender();
  });
$("resetView").addEventListener("click", () => viewport?.frameCamera());
function replace(s, d) {
  scenario = s;
  cursor = Math.min(d, totalDistance(s));
  syncControls();
  queueRender(true);
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
for (const [i, axis] of ["East", "North", "Up"].entries()) {
  const card = document.createElement("div");
  card.className = "plot";
  card.id = `plotCard${i}`;
  card.innerHTML = `<div class="plot-top"><span class="plot-name">${axis}</span><span class="plot-value" id="sigma${i}"></span></div><div class="plot-baseline" id="baseline${i}"></div><svg id="plot${i}" viewBox="0 0 320 162" role="img" aria-label="${axis} global uncertainty by distance walked"></svg>`;
  $("plots").append(card);
  const choose = (e) => {
    const r = $(`plot${i}`).getBoundingClientRect(),
      x = ((e.clientX - r.left) / r.width) * 320;
    selectDistance(((x - 34) / 274) * totalDistance(scenario));
  };
  $(`plot${i}`).addEventListener("pointerdown", (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    choose(e);
  });
  $(`plot${i}`).addEventListener("pointermove", (e) => {
    if (e.buttons === 1) choose(e);
  });
}
function legend(method) {
  return `<span><i class="line baseline"></i>Baseline</span>${method ? `<span><i class="line"></i>${method}</span>` : ""}`;
}
function plot(result, p, i, hasMethod) {
  const max =
      Math.max(1, ...result.points.map((p) => p.baselineSigma[i])) * 1.12,
    total = totalDistance(scenario),
    x = (d) => 34 + (274 * d) / total,
    y = (v) => 132 - (115 * v) / max;
  const path = (key) =>
    result.points
      .map(
        (p, j) =>
          `${j ? "L" : "M"}${x(p.distance).toFixed(2)},${y(p[key][i]).toFixed(2)}`,
      )
      .join(" ");
  let svg = "";
  for (let j = 0; j < 4; j++) {
    const v = (max * j) / 3,
      yy = y(v);
    svg += `<line class="gridline" x1="34" x2="308" y1="${yy}" y2="${yy}"/><text x="27" y="${yy + 3}" text-anchor="end">${v < 10 ? v.toFixed(1) : v.toFixed(0)}</text>`;
  }
  for (const d of [0, total / 2, total])
    svg += `<text x="${x(d)}" y="153" text-anchor="middle">${Math.round(d)}</text>`;
  for (const e of result.events)
    svg += `<line x1="${x(e.distance)}" x2="${x(e.distance)}" y1="132" y2="${e.applied ? 126 : 129}" stroke="${e.applied ? "#64d5c6" : "#d6b181"}" opacity=".65"/>`;
  svg += `<path class="baseline-line" d="${path("baselineSigma")}"/>${hasMethod ? `<path class="selected-line" d="${path("selectedSigma")}"/>` : ""}<line class="cursor-line" x1="${x(cursor)}" x2="${x(cursor)}" y1="10" y2="132"/><circle cx="${x(cursor)}" cy="${y(p.selectedSigma[i])}" r="3" fill="${hasMethod ? "#64d5c6" : "#d6b181"}"/>`;
  $(`plot${i}`).innerHTML = svg;
  $(`plotCard${i}`).classList.toggle("has-method", hasMethod);
  $(`sigma${i}`).innerHTML = `${fmt(p.selectedSigma[i])} <small>m</small>`;
  $(`sigma${i}`).dataset.value = p.selectedSigma[i];
  const reduction =
    p.baselineSigma[i] > 0
      ? Math.max(0, 100 * (1 - p.selectedSigma[i] / p.baselineSigma[i]))
      : 0;
  const percent = (
    p.selectedSigma[i] > 0 ? Math.min(99.9, reduction) : reduction
  )
    .toFixed(1)
    .replace(/\.0$/, "");
  const change =
    reduction < 1e-9
      ? "no change"
      : reduction < 0.1
        ? "<0.1% lower"
        : `${percent}% lower`;
  $(`baseline${i}`).textContent = hasMethod
    ? `${fmt(p.baselineSigma[i])} baseline · ${change}`
    : "";
}
function render(missionChanged = false) {
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
  $("positionReadout").textContent =
    `E ${fmt(p.position[0], 1)} · N ${fmt(p.position[1], 1)} · U ${fmt(p.position[2], 1)} m`;
  $("bendLabel").textContent = `Bend ${fmt(bendDistance(scenario), 0)} m`;
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
  $("viewLabel").textContent =
    mode === "global" ? "GLOBAL POSITION" : "LOCAL NAVIGATION";
  $("plotLegend").innerHTML = legend(method);
  $("sceneLegend").innerHTML =
    mode === "global"
      ? legend(method)
      : '<span><i class="line"></i>Rover start + motion</span>';
  for (let i = 0; i < 3; i++) plot(result, p, i, hasMethod);
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
  if (!viewport) {
    try {
      viewport = new RouteViewport($("viewport"), selectDistance);
    } catch (e) {
      $("viewportError").hidden = false;
      $("viewportError").textContent = `Cannot start the 3D view. ${e.message}`;
    }
  }
  viewport?.update(scenario, result, p, missionChanged);
}
syncControls();
render(true);
