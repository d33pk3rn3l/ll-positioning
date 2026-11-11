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
import { assess, selectedPoint, SOURCE_NAMES } from "./localization.mjs";
import { RouteViewport } from "./viewport.mjs";
import { blockedDemo, mapDemo } from "./demonstrations.mjs";
const $ = (id) => document.getElementById(id),
  fmt = (n, d = 2) => n.toFixed(d);
let scenario = defaultScenario(),
  cursor = 330,
  mode = "global",
  viewport = null,
  scheduled = false,
  pendingMissionChange = false;
try {
  const saved = localStorage.getItem("ll-sprint-1");
  if (saved) scenario = parseScenario(saved);
} catch {
  $("saveStatus").textContent =
    "Stored scenario was invalid. Loaded the example.";
}
for (const [key, d] of Object.entries(INPUTS)) {
  const row = document.createElement("div");
  row.className = "input-row";
  const range = d.group === "mission";
  row.innerHTML = `<label class="input-label" for="${key}"><span>${d.label}</span><span class="unit">${d.unit}</span></label><div class="input-with-unit ${range ? "range-row" : ""}"><input id="${key}" type="${range ? "range" : "number"}" min="${d.min}" max="${d.max}" step="${d.step}" aria-describedby="${key}Assumption">${range ? `<output id="${key}Value" for="${key}"></output>` : ""}</div><span id="${key}Assumption" class="subtle">Assumed${["robot", "reference", "uwb", "map"].includes(d.group) ? " · 1σ" + (key.includes("Spacing") || key === "maxRange_m" ? " schedule / geometry" : "") : ""}</span>`;
  // Spacing and maximum range are geometry assumptions, not uncertainty statistics.
  if (key.includes("Spacing") || key === "maxRange_m")
    row.querySelector(".subtle").textContent = "Assumed · observation geometry";
  $(`${d.group}Inputs`).append(row);
  $(key).addEventListener("input", () => {
    scenario[key] = $(key).value === "" ? null : Number($(key).value);
    if (range) $(`${key}Value`).textContent = `${scenario[key]} m`;
    queueRender(d.group === "mission");
  });
}
function syncControls() {
  $("scenarioName").value = scenario.name;
  for (const k of Object.keys(INPUTS)) {
    $(k).value = scenario[k] ?? "";
    if ($(`${k}Value`)) $(`${k}Value`).textContent = `${scenario[k]} m`;
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
    queueRender();
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
function replace(s, d) {
  scenario = s;
  cursor = Math.min(d, totalDistance(s));
  syncControls();
  queueRender(true);
}
$("reset").addEventListener("click", () => replace(defaultScenario(), 330));
$("blockedDemo").addEventListener("click", () => {
  replace(blockedDemo(), 400);
  $("saveStatus").textContent =
    "Blocked-link example loaded. Save it to repeat.";
});
$("mapDemo").addEventListener("click", () => {
  replace(mapDemo(), 550);
  $("saveStatus").textContent = "Shared-map example loaded. Save it to repeat.";
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
    $("saveStatus").textContent =
      "Saved in this browser and downloaded as JSON.";
  } catch (e) {
    $("saveStatus").textContent = `Could not save: ${e.message}`;
  }
});
$("load").addEventListener("click", () => $("loadFile").click());
$("loadFile").addEventListener("change", async () => {
  const file = $("loadFile").files[0];
  if (!file) return;
  try {
    if (file.size > 100000)
      throw new Error("Scenario file must be smaller than 100 kB.");
    replace(parseScenario(await file.text()), cursor);
    $("saveStatus").textContent = `Loaded ${file.name}.`;
  } catch (e) {
    $("saveStatus").textContent = `Could not load: ${e.message}`;
  }
  $("loadFile").value = "";
});
for (const [i, axis] of ["East", "North", "Up"].entries()) {
  const card = document.createElement("div");
  card.className = "plot";
  card.innerHTML = `<div class="plot-top"><span class="plot-name">${axis.toUpperCase()} <span class="subtle">/ ${["E", "N", "U"][i]}</span></span><div><div class="plot-value" id="sigma${i}"></div><div class="plot-baseline" id="baseline${i}"></div></div></div><svg id="plot${i}" viewBox="0 0 320 162" role="img" aria-label="${axis} global uncertainty versus distance walked"></svg>`;
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
function plot(result, p, i) {
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
    svg += `<text x="${x(d)}" y="153" text-anchor="middle">${Math.round(d)} m</text>`;
  for (const e of result.events)
    svg += `<line x1="${x(e.distance)}" x2="${x(e.distance)}" y1="132" y2="${e.applied ? 126 : 129}" stroke="${e.applied ? "#62ddce" : "#e4b477"}" opacity=".65"/>`;
  svg += `<path class="baseline-line" d="${path("baselineSigma")}"/><path class="selected-line" d="${path("selectedSigma")}"/><line class="cursor-line" x1="${x(cursor)}" x2="${x(cursor)}" y1="10" y2="132"/><circle cx="${x(cursor)}" cy="${y(p.selectedSigma[i])}" r="3" fill="#62ddce"/>`;
  $(`plot${i}`).innerHTML = svg;
  $(`sigma${i}`).innerHTML = `${fmt(p.selectedSigma[i])} <small>m</small>`;
  $(`sigma${i}`).dataset.value = p.selectedSigma[i];
  const reduction =
    p.baselineSigma[i] > 0
      ? 100 * (1 - p.selectedSigma[i] / p.baselineSigma[i])
      : 0;
  $(`baseline${i}`).textContent =
    `${fmt(p.baselineSigma[i])} baseline · ${Math.max(0, reduction).toFixed(0)}% lower σ`;
}
function render(missionChanged = false) {
  const errors = validateScenario(scenario);
  $("validation").hidden = !errors.length;
  $("validation").textContent = errors.length
    ? "Assessment incomplete. " + errors.join(" ")
    : "";
  $("assessment").hidden = !!errors.length;
  $("save").disabled = !!errors.length;
  if (errors.length) return;
  cursor = Math.min(cursor, totalDistance(scenario));
  $("routeCursor").max = totalDistance(scenario);
  $("routeCursor").value = cursor;
  const result = assess(scenario, { distances: [cursor] }),
    p = selectedPoint(result, cursor);
  $("routeSummary").innerHTML =
    `<div><strong>150 m</strong><span>APPROACH</span></div><div><strong>${scenario.ravineLength_m} m</strong><span>RAVINE</span></div><div><strong>${totalDistance(scenario)} m</strong><span>TOTAL</span></div>`;
  $("distanceReadout").textContent = `${cursor} m`;
  $("positionReadout").textContent =
    `E ${fmt(p.position[0], 1)} · N ${fmt(p.position[1], 1)} · U ${fmt(p.position[2], 1)} m`;
  $("cursorOutput").textContent =
    `${cursor} / ${totalDistance(scenario)} m walked`;
  $("bendLabel").textContent = `BEND · ${fmt(bendDistance(scenario), 0)} m`;
  $("endLabel").textContent = `END · ${totalDistance(scenario)} m`;
  const status = uwbAvailability(scenario, cursor);
  $("linkStatus").textContent = scenario.uwbEnabled
    ? `UWB · ${status}`
    : scenario.mapEnabled
      ? "MAP · " +
        (scenario.mapAvailable
          ? "Scheduled matches assumed successful"
          : "Observations unavailable")
      : "BASELINE · starting tie only";
  $("linkStatus").classList.toggle(
    "blocked",
    scenario.uwbEnabled && status !== "Available",
  );
  $("viewLabel").textContent =
    mode === "global" ? "GLOBAL POSITION" : "LOCAL NAVIGATION";
  $("viewExplanation").textContent =
    mode === "global"
      ? "Origin and heading knowledge move the route in the lunar frame."
      : "Origin and heading fixed. Nearby terrain and rocks share this reference.";
  for (let i = 0; i < 3; i++) plot(result, p, i);
  const traces = Object.entries(p.contributions)
      .map(([k, c]) => ({ key: k, value: c.reduce((v, r, i) => v + r[i], 0) }))
      .sort((a, b) => b.value - a.value),
    trace = traces.reduce((v, t) => v + t.value, 0);
  $("dominantText").innerHTML =
    trace > 1e-12
      ? `<strong>${SOURCE_NAMES[traces[0].key]}</strong> contributes ${Math.round((100 * traces[0].value) / trace)}% of the selected position variance.`
      : "All declared uncertainty is zero.";
  $("contributionContext").textContent = `${cursor} m`;
  $("contributions").innerHTML = traces
    .filter((t) => t.value > 1e-10)
    .map(
      (t) =>
        `<div class="contribution"><span>${SOURCE_NAMES[t.key]}</span><div class="bar-track"><div class="bar-fill" style="width:${(100 * t.value) / trace}%"></div></div><span>${Math.round((100 * t.value) / trace)}%</span></div>`,
    )
    .join("");
  const label =
    scenario.uwbEnabled && scenario.mapEnabled
      ? "UWB + map"
      : scenario.uwbEnabled
        ? "UWB range"
        : scenario.mapEnabled
          ? "Orbital map"
          : "Selected (= baseline)";
  const rows = [
    ["Local navigation", p.localSigma],
    ["Global baseline", p.baselineSigma],
  ];
  if (scenario.uwbEnabled && scenario.mapEnabled) {
    rows.push([
      "UWB only",
      selectedPoint(
        assess({ ...scenario, mapEnabled: false }, { distances: [cursor] }),
        cursor,
      ).selectedSigma,
    ]);
    rows.push([
      "Map only",
      selectedPoint(
        assess({ ...scenario, uwbEnabled: false }, { distances: [cursor] }),
        cursor,
      ).selectedSigma,
    ]);
  }
  rows.push([label, p.selectedSigma]);
  $("comparisonRows").innerHTML = rows
    .map(
      ([label, v]) =>
        `<tr><td>${label}</td>${v.map((n) => `<td>${fmt(n)}</td>`).join("")}</tr>`,
    )
    .join("");
  const past = result.events.filter((e) => e.distance <= cursor),
    applied = past.filter((e) => e.applied);
  $("observationCount").textContent =
    `${applied.length} APPLIED / ${past.length} SCHEDULED SO FAR`;
  $("observationLog").innerHTML = result.events.length
    ? result.events
        .map(
          (e) =>
            `<button class="event ${e.applied ? "" : "blocked"} ${e.distance > cursor ? "future" : ""} ${e.distance === cursor ? "current" : ""}" data-distance="${e.distance}">${e.kind === "uwb" ? "UWB" : "MAP"} · ${e.distance} m<small>${e.distance > cursor ? "Future · " : ""}${e.status}</small></button>`,
        )
        .join("")
    : '<p class="section-note">Enable UWB range or orbital map matching to compare observations with the baseline.</p>';
  for (const b of $("observationLog").querySelectorAll("button"))
    b.addEventListener("click", () =>
      selectDistance(Number(b.dataset.distance)),
    );
  if (!viewport) {
    try {
      viewport = new RouteViewport($("viewport"), selectDistance);
    } catch (e) {
      $("viewportError").hidden = false;
      $("viewportError").textContent = "3D view could not start: " + e.message;
    }
  }
  viewport?.update(scenario, result, p, missionChanged);
}
syncControls();
render(true);
