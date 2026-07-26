/**
 * Decision UI for LunarLeaper navigation × science assessment.
 */

import {
  assess,
  comparePresets,
  NAV_CONOPS,
  SURVEY_CONOPS,
  INSTRUMENTS,
  DEFAULT_SCENARIO,
  PRESETS,
  freeAirGradient,
} from "./assessment.mjs";

const $ = (id) => document.getElementById(id);

function fmt(v, digits = 2, unit = "") {
  if (!Number.isFinite(v)) return "—";
  const n = Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(digits);
  return unit ? `${n} ${unit}` : n;
}

function cls(ok) {
  return ok ? "ok" : "bad";
}

function bindControls() {
  const ids = [
    "instrument",
    "navConops",
    "surveyConops",
    "odometryPct",
    "mapTieSigma_m",
    "cartographicSigma_m",
    "stationSpacing_m",
    "settle_s",
    "integration_s",
    "reoccupationCadence_h",
    "drift_uGal_per_day",
    "demDifferential_m",
    "footSigma_m",
    "tubeDepth_m",
    "tubeRadius_m",
    "activeLeveling",
    "lockedStance",
    "fixedBellyHeight",
    "useBouguerSensitivity",
    "frameMistag",
    "gprMode3d",
  ];
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
}

function readScenario() {
  const num = (id, fallback) => {
    const el = $(id);
    if (!el) return fallback;
    const v = +el.value;
    return Number.isFinite(v) ? v : fallback;
  };
  const chk = (id, fallback = false) => {
    const el = $(id);
    return el ? !!el.checked : fallback;
  };
  return {
    ...DEFAULT_SCENARIO,
    instrument: $("instrument").value,
    navConops: $("navConops").value,
    surveyConops: $("surveyConops").value,
    odometryPct: num("odometryPct", DEFAULT_SCENARIO.odometryPct),
    mapTieSigma_m: num("mapTieSigma_m", DEFAULT_SCENARIO.mapTieSigma_m),
    cartographicSigma_m: num("cartographicSigma_m", DEFAULT_SCENARIO.cartographicSigma_m),
    stationSpacing_m: num("stationSpacing_m", DEFAULT_SCENARIO.stationSpacing_m),
    settle_s: num("settle_s", DEFAULT_SCENARIO.settle_s),
    integration_s: num("integration_s", DEFAULT_SCENARIO.integration_s),
    reoccupationCadence_h: num("reoccupationCadence_h", DEFAULT_SCENARIO.reoccupationCadence_h),
    drift_uGal_per_day: num("drift_uGal_per_day", DEFAULT_SCENARIO.drift_uGal_per_day),
    demDifferential_m: num("demDifferential_m", DEFAULT_SCENARIO.demDifferential_m),
    footSigma_m: num("footSigma_m", DEFAULT_SCENARIO.footSigma_m),
    tubeDepth_m: num("tubeDepth_m", DEFAULT_SCENARIO.tubeDepth_m),
    tubeRadius_m: num("tubeRadius_m", DEFAULT_SCENARIO.tubeRadius_m),
    activeLeveling: chk("activeLeveling", true),
    lockedStance: chk("lockedStance", true),
    fixedBellyHeight: chk("fixedBellyHeight", true),
    useBouguerSensitivity: chk("useBouguerSensitivity", true),
    frameMistag: chk("frameMistag", false),
    gprMode3d: chk("gprMode3d", false) || $("surveyConops").value === "gpr_3d",
  };
}

function syncLabels(s) {
  $("odometryPctV").textContent = `${s.odometryPct.toFixed(1)} %`;
  $("mapTieSigmaV").textContent = `${s.mapTieSigma_m.toFixed(1)} m`;
  $("cartographicSigmaV").textContent = `${s.cartographicSigma_m.toFixed(0)} m`;
  $("stationSpacingV").textContent = `${s.stationSpacing_m.toFixed(0)} m`;
  $("settleV").textContent = `${s.settle_s.toFixed(0)} s`;
  $("integrationV").textContent = `${s.integration_s.toFixed(0)} s`;
  $("reoccupationV").textContent = `${s.reoccupationCadence_h.toFixed(1)} h`;
  $("driftV").textContent = `${s.drift_uGal_per_day.toFixed(0)} µGal/d`;
  $("demV").textContent = `${s.demDifferential_m.toFixed(1)} m`;
  $("footV").textContent = `${(s.footSigma_m * 1000).toFixed(0)} mm`;
  $("tubeDepthV").textContent = `${s.tubeDepth_m.toFixed(0)} m`;
  $("tubeRadiusV").textContent = `${s.tubeRadius_m.toFixed(0)} m`;
}

function fillSelects() {
  const nav = $("navConops");
  nav.innerHTML = Object.values(NAV_CONOPS)
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join("");
  nav.value = DEFAULT_SCENARIO.navConops;

  const survey = $("surveyConops");
  survey.innerHTML = Object.values(SURVEY_CONOPS)
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join("");
  survey.value = DEFAULT_SCENARIO.surveyConops;

  const inst = $("instrument");
  inst.innerHTML = Object.values(INSTRUMENTS)
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join("");
  inst.value = DEFAULT_SCENARIO.instrument;
}

function renderKpis(r) {
  const pass = r.science.pass;
  const sciVal =
    r.science.kind === "gravimetry"
      ? `SNR ${fmt(r.science.value, 1)}`
      : r.science.kind === "gpr"
        ? (pass ? "sampling OK" : "sampling short")
        : pass
          ? "geo OK"
          : "geo short";

  $("kpiScience").innerHTML = `
    <div class="label">Science</div>
    <div class="value ${pass ? "" : "bad"}">${sciVal}</div>
    <div class="sub">${r.science.metric}${
      r.science.signal_uGal != null ? ` · signal ${fmt(r.science.signal_uGal, 0)} µGal` : ""
    }</div>`;

  $("kpiCoverage").innerHTML = `
    <div class="label">14-day coverage</div>
    <div class="value ${r.resources.fits ? "" : "warn"}">${fmt(r.resources.fraction * 100, 0)}%</div>
    <div class="sub">${r.resources.label}${
      r.survey ? ` · ${r.survey.achievableStations}/${r.survey.nStations} sta` : ""
    }</div>`;

  $("kpiLocal").innerHTML = `
    <div class="label">Local / relative</div>
    <div class="value">${fmt(r.layers.local.horiz_m, 2)} m</div>
    <div class="sub">vert ${fmt(r.layers.local.vert_m, 2)} m · pair Δ ${fmt(r.nav.summary.relativePostHoriz_m, 2)} m</div>`;

  $("kpiMap").innerHTML = `
    <div class="label">Map / cartographic</div>
    <div class="value ${r.nav.frameFault_m ? "bad" : ""}">${fmt(r.layers.map.horiz_m, 1)} / ${fmt(r.layers.cartographic.horiz_m, 1)} m</div>
    <div class="sub">${r.nav.frameFault_m ? "ME↔PA fault included" : "map-relative · absolute"}</div>`;
}

function renderLayers(r) {
  $("layersBody").innerHTML = `
    <tr><td>Local / relative</td><td class="num">${fmt(r.layers.local.horiz_m)} m H / ${fmt(r.layers.local.vert_m)} m V</td><td>${r.layers.local.drives}</td></tr>
    <tr><td>Map-relative</td><td class="num">${fmt(r.layers.map.horiz_m)} m</td><td>${r.layers.map.drives}</td></tr>
    <tr><td>Cartographic absolute</td><td class="num">${fmt(r.layers.cartographic.horiz_m)} m H / ${fmt(r.layers.cartographic.vert_m)} m V</td><td>${r.layers.cartographic.drives}</td></tr>
    <tr><td>Inertial / ephemeris</td><td class="num">${fmt(r.layers.inertial.azimuth_mrad, 2)} mrad az</td><td>${r.layers.inertial.drives}</td></tr>
    <tr><td>Observability</td><td class="num">${r.observability.fullPose ? "6-DoF" : "partial"}</td><td>${r.observability.notes}</td></tr>
  `;
}

function renderBars(r) {
  const max = Math.max(...r.ranked.map((x) => x.uGal), 1e-9);
  $("errorBars").innerHTML = r.ranked
    .slice(0, 8)
    .map((t) => {
      const pct = Math.min(100, (t.uGal / max) * 100);
      const unit = r.science.kind === "gravimetry" ? "µGal" : "×";
      return `<div class="bar-row"><div>${t.name}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><div class="num">${fmt(t.uGal, 1)} ${unit}</div></div>`;
    })
    .join("");
}

function renderControls(r) {
  $("sourcesBody").innerHTML = r.controlSources
    .map((c) => {
      const tag =
        c.assessment === "negative"
          ? "neg"
          : c.usable
            ? "ok"
            : "tbd";
      return `<tr>
        <td>${c.name}<div class="note">${c.notes}</div></td>
        <td><span class="tag ${tag}">${c.assessment}</span></td>
        <td class="num">${c.usable ? "yes" : "no"}</td>
      </tr>`;
    })
    .join("");
}

function renderCompare(base) {
  const rows = comparePresets(base);
  $("compareBody").innerHTML = rows
    .map((row) => {
      const sci =
        row.science.kind === "gravimetry"
          ? `SNR ${fmt(row.science.value, 1)}`
          : row.science.pass
            ? "pass"
            : "short";
      return `<tr>
        <td>${row.name}</td>
        <td class="num">${fmt(row.layers.local.horiz_m)}</td>
        <td class="num">${fmt(row.layers.map.horiz_m)}</td>
        <td class="num">${fmt(row.layers.cartographic.horiz_m)}</td>
        <td class="num">${sci}</td>
        <td>${row.dominant?.name ?? "—"}</td>
      </tr>`;
    })
    .join("");
}

function drawTraverse(r) {
  const canvas = $("traverseChart");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const sts = r.nav.stations;
  const L = sts[sts.length - 1].s || 1;
  const ymax = Math.max(...sts.map((s) => s.cartographic.horiz), 1) * 1.15;
  const pad = { l: 42, r: 10, t: 12, b: 24 };
  const x = (s) => pad.l + (s / L) * (W - pad.l - pad.r);
  const y = (v) => pad.t + (1 - v / ymax) * (H - pad.t - pad.b);

  ctx.strokeStyle = "#243044";
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, H - pad.b);
  ctx.lineTo(W - pad.r, H - pad.b);
  ctx.stroke();

  ctx.fillStyle = "#6b7788";
  ctx.font = "10px IBM Plex Mono, monospace";
  ctx.textAlign = "right";
  ctx.fillText("0", pad.l - 4, H - pad.b);
  ctx.fillText(fmt(ymax, 0), pad.l - 4, pad.t + 8);
  ctx.textAlign = "center";
  ctx.fillText("0 m", x(0), H - 6);
  ctx.fillText(`${fmt(L, 0)} m`, x(L), H - 6);
  ctx.fillText("σ horiz [m]", W / 2, 10);

  const series = [
    { key: (s) => s.local.horiz, color: "#e6b35a", label: "local" },
    { key: (s) => s.map.horiz, color: "#6ec6e8", label: "map" },
    { key: (s) => s.cartographic.horiz + r.nav.frameFault_m, color: "#e88787", label: "cartographic" },
  ];
  for (const ser of series) {
    ctx.strokeStyle = ser.color;
    ctx.beginPath();
    sts.forEach((st, i) => {
      const X = x(st.s);
      const Y = y(ser.key(st));
      if (i === 0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    });
    ctx.stroke();
  }

  // anchors
  ctx.fillStyle = "#8fd39a";
  r.nav.anchors.forEach((a) => {
    ctx.beginPath();
    ctx.arc(x(a.s), H - pad.b - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGravity(r) {
  const canvas = $("gravityChart");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  if (r.scenario.instrument !== "gravimeter") {
    ctx.fillStyle = "#6b7788";
    ctx.font = "12px IBM Plex Sans, sans-serif";
    ctx.fillText("Switch instrument to Gravimeter for anomaly / budget view.", 16, 28);
    return;
  }

  const depth = r.scenario.tubeDepth_m;
  const rad = r.scenario.tubeRadius_m;
  const dens = r.scenario.tubeDensityContrast;
  const xs = [];
  const gs = [];
  for (let i = 0; i <= 80; i++) {
    const x = -150 + (300 * i) / 80;
    xs.push(x);
    // reuse assessment import via dynamic — compute here simply
    gs.push(r.gravity.peak_uGal * (-depth * depth) / (x * x + depth * depth)); // same shape as infinite cyl peak-normalized
  }
  // Better: use peak and shape from model already in r — approximate with exact formula inline
  const G = 6.6743e-11;
  for (let i = 0; i <= 80; i++) {
    const x = -150 + (300 * i) / 80;
    const A = Math.PI * rad * rad;
    const num = 2 * G * dens * A * depth;
    const den = x * x + depth * depth;
    gs[i] = -(num / den) * 1e8;
    xs[i] = x;
  }

  const pad = { l: 48, r: 12, t: 14, b: 24 };
  const gmin = Math.min(...gs, -r.gravity.total_uGal);
  const gmax = Math.max(...gs.map(Math.abs), r.gravity.total_uGal) * 0.15;
  const yMin = gmin * 1.15;
  const yMax = Math.max(20, gmax);
  const xOf = (x) => pad.l + ((x + 150) / 300) * (W - pad.l - pad.r);
  const yOf = (g) => pad.t + (1 - (g - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);

  ctx.strokeStyle = "#243044";
  ctx.beginPath();
  ctx.moveTo(pad.l, yOf(0));
  ctx.lineTo(W - pad.r, yOf(0));
  ctx.stroke();

  // ±1σ band around 0 as noise floor marker
  ctx.fillStyle = "rgba(110,198,232,0.12)";
  ctx.fillRect(pad.l, yOf(r.gravity.total_uGal), W - pad.l - pad.r, yOf(-r.gravity.total_uGal) - yOf(r.gravity.total_uGal));

  ctx.strokeStyle = "#e88787";
  ctx.beginPath();
  gs.forEach((g, i) => {
    const X = xOf(xs[i]);
    const Y = yOf(g);
    if (i === 0) ctx.moveTo(X, Y);
    else ctx.lineTo(X, Y);
  });
  ctx.stroke();

  ctx.fillStyle = "#6b7788";
  ctx.font = "10px IBM Plex Mono, monospace";
  ctx.textAlign = "right";
  ctx.fillText(`${fmt(yMax, 0)}`, pad.l - 4, pad.t + 8);
  ctx.fillText(`${fmt(yMin, 0)}`, pad.l - 4, H - pad.b);
  ctx.textAlign = "center";
  ctx.fillText("tube Δg [µGal] vs cross-track x; band = RSS budget", W / 2, 10);
}

function renderScienceNote(r) {
  let html = "";
  if (r.science.kind === "gravimetry") {
    html = `<p class="note">Free-air ${fmt(freeAirGradient(), 2)} µGal/m · elev. sensitivity ${fmt(r.gravity.elevSens, 1)} µGal/m
      (${r.scenario.useBouguerSensitivity ? "after simple Bouguer" : "free-air only"}).
      Drift adjusted ${fmt(r.survey.adjustedDrift_uGal, 1)} µGal · tide radial component ±0.1 m → ${fmt(r.gravity.tideRadialComponent_uGal, 1)} µGal.
      Detectable (SNR≥3): <span class="tag ${cls(r.gravity.detectable)}">${r.gravity.detectable ? "yes" : "no"}</span></p>`;
  } else if (r.science.kind === "gpr") {
    html = `<p class="note">λ = ${fmt(r.gpr.lambda_m, 3)} m @ ${r.scenario.gprFreq_MHz} MHz, εr=${r.scenario.gprEps}.
      Need along ≤ ${fmt(r.gpr.alongNeed_m, 3)} m, elev ≤ ${fmt(r.gpr.elevNeed_m, 3)} m.
      Achieved ${fmt(r.gpr.achievedAlong_m, 3)} / ${fmt(r.gpr.achievedElev_m, 3)} m.
      ${r.gpr.coverageNote}. Belly residual ${fmt(r.gpr.bellyResidual_m * 100, 1)} cm → ~${fmt(r.gpr.heightPhase_deg, 0)}° phase @ f₀.</p>`;
  } else if (r.science.kind === "spectrometer") {
    html = `<p class="note">Footprint σ ${fmt(r.spectro.footSigma_m * 1000, 0)} mm · geo ${fmt(r.spectro.geoSigma_m * 1000, 0)} mm ·
      allowed ${fmt(r.spectro.allowedGeo_m * 1000, 0)} mm for 10% broadening.
      Stop-and-stare default. Global rarely required.</p>`;
  } else {
    html = `<p class="note">Imaging uses local pose for reconstruction; map tie for orbital context.</p>`;
  }
  $("scienceNote").innerHTML = html;
}

function renderPdf(r) {
  $("pdfBody").innerHTML = r.pdfTrace
    .map((q) => `<tr><td class="mono">${q.id}</td><td>${q.text}</td><td>${q.addressedBy}</td></tr>`)
    .join("");
}

function render() {
  const s = readScenario();
  syncLabels(s);
  const r = assess(s);
  renderKpis(r);
  renderLayers(r);
  renderBars(r);
  renderControls(r);
  renderCompare(s);
  renderScienceNote(r);
  renderPdf(r);
  drawTraverse(r);
  drawGravity(r);
  $("assumptions").textContent = `FA ${fmt(freeAirGradient(), 2)} µGal/m · odometry prior TBD (${PRESETS.odometry.evidence})`;
}

function main() {
  fillSelects();
  bindControls();
  render();
  addEventListener("resize", render);
}

main();
