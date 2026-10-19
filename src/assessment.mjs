/**
 * Pure assessment engine for LunarLeaper navigation × science trades.
 * No DOM. All units explicit. Deterministic.
 */

import {
  G,
  R_MOON,
  G_MOON,
  FREE_AIR,
  SLAB_COEFF,
  CONTROL_SOURCES,
  ERROR_SOURCES,
  NAV_CONOPS,
  SURVEY_CONOPS,
  INSTRUMENTS,
  PRESETS,
  DEFAULT_SCENARIO,
  ASSUMPTIONS,
  PDF_QUESTIONS,
  FRAMES,
  HEIGHT_CONVENTIONS,
} from "./mission-model.mjs";

export {
  G,
  R_MOON,
  G_MOON,
  FREE_AIR,
  SLAB_COEFF,
  CONTROL_SOURCES,
  ERROR_SOURCES,
  NAV_CONOPS,
  SURVEY_CONOPS,
  INSTRUMENTS,
  PRESETS,
  DEFAULT_SCENARIO,
  ASSUMPTIONS,
  PDF_QUESTIONS,
  FRAMES,
  HEIGHT_CONVENTIONS,
};

const TWO_PI = Math.PI * 2;
const HOUR = 3600;
const DAY = 86400;

export function hypot(...xs) {
  return Math.sqrt(xs.reduce((a, x) => a + x * x, 0));
}

export function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Round a metre value.
 * Use the same rounding as the page.
 */
export function formatMetres(value, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(digits);
}

/**
 * Show this text with every cartographic 1-sigma.
 * Mean Earth (ME) to principal axes (PA) uncertainty is outside the number.
 */
export const CARTOGRAPHIC_SIGMA_EXCLUSION = "excludes ME-to-PA uncertainty (TBD)";

/**
 * Build the text for one cartographic 1-sigma.
 * horizontal_m is required.
 * vertical_m is optional.
 */
export function formatCartographicSigmaText(horizontal_m, vertical_m = undefined, digits = 2) {
  const horizontalText = `${formatMetres(horizontal_m, digits)} m`;
  const body =
    vertical_m === undefined
      ? horizontalText
      : `${horizontalText} H / ${formatMetres(vertical_m, digits)} m V`;
  return `${body} ${CARTOGRAPHIC_SIGMA_EXCLUSION}`;
}

/**
 * Transform applied.
 * The rotation size is text.
 * The size is not an error.
 * The size is not a bias.
 */
export function formatMeanEarthToPrincipalAxesAppliedText(offset_m) {
  return `ME-to-PA applied (about ${offset_m} m); residual uncertainty TBD, common-mode`;
}

/** Free-air gradient [µGal/m]. */
export function freeAirGradient() {
  return FREE_AIR;
}

/** Simple Bouguer-slab coefficient [µGal/m] at density ρ. */
export function slabGradient(rho) {
  return SLAB_COEFF * rho;
}

/** Effective elevation sensitivity after optional simple Bouguer slab. */
export function elevationSensitivity(rho, useBouguer) {
  const fa = freeAirGradient();
  return useBouguer ? fa - slabGradient(rho) : fa;
}

/**
 * Ideal scalar tilt error: δg = g (1 − cos θ) ≈ g θ²/2 [µGal], θ in rad.
 * Around nonzero bias θ0: g(|θ0|δθ + δθ²/2).
 */
export function tiltError_uGal(theta_rad, bias_rad = 0) {
  const th = Math.abs(theta_rad);
  const b = Math.abs(bias_rad);
  const dg = G_MOON * (b * th + 0.5 * th * th); // m/s²
  return dg * 1e8; // µGal
}

/** Residual tilt allocation → angle for δg budget at zero bias. */
export function tiltAngleForBudget_uGal(budget_uGal) {
  const dg = budget_uGal / 1e8;
  return Math.sqrt((2 * dg) / G_MOON);
}

/** Wavelength in nonmagnetic dielectric: λ = c / (f √εr). */
export function gprWavelength_m(freq_MHz, eps_r) {
  const c = 2.99792458e8;
  return c / (freq_MHz * 1e6 * Math.sqrt(eps_r));
}

/**
 * Infinite horizontal cylinder gravity anomaly [µGal] (mass deficit if Δρ>0 for void).
 * Δg_z(x) = −2π G Δρ r² z_c / (x² + z_c²)  with Δρ = |host−void|.
 */
export function tubeAnomalyInfinite_uGal(x, radius, depthCenter, densityContrast) {
  const A = Math.PI * radius * radius;
  const zc = depthCenter;
  const num = 2 * G * densityContrast * A * zc;
  const den = x * x + zc * zc;
  return -(num / den) * 1e8;
}

/** Finite-length tube midpoint approximation [µGal]. */
export function tubeAnomalyFinite_uGal(x, radius, depthCenter, densityContrast, length) {
  if (!Number.isFinite(length) || length <= 0) {
    return tubeAnomalyInfinite_uGal(x, radius, depthCenter, densityContrast);
  }
  const A = Math.PI * radius * radius;
  const zc = depthCenter;
  const half = length / 2;
  const r2 = x * x + zc * zc;
  const num = G * densityContrast * A * zc * length;
  const den = r2 * Math.sqrt(r2 + half * half);
  return -(num / den) * 1e8;
}

/**
 * Gaussian footprint broadening: σ_eff² = σ_foot² + σ_geo².
 * Allowed geolocation for permitted broadening fraction f of footprint.
 */
export function allowedGeolocation_m(footSigma_m, allowedBroadeningFraction = 0.1) {
  // σ_eff = foot * sqrt(1+f²) roughly if σ_geo = f * foot for small f using σ_eff² = σ_f²+σ_g²
  // Require σ_geo such that σ_eff / σ_foot − 1 ≤ allowedBroadeningFraction
  const ratio = 1 + allowedBroadeningFraction;
  const geo = footSigma_m * Math.sqrt(Math.max(0, ratio * ratio - 1));
  return geo;
}

export function effectiveFootprint_m(footSigma_m, geoSigma_m) {
  return Math.sqrt(footSigma_m * footSigma_m + geoSigma_m * geoSigma_m);
}

/**
 * First-order navigation uncertainty along a traverse.
 * Local along/cross grow as k * distance from nearest bound (lander / loop / map ties).
 * Returns per-station and pairwise-relative summaries.
 */
export function navigationUncertainty(scenario) {
  const nav = NAV_CONOPS[scenario.navConops] || NAV_CONOPS.local_rt;
  const L = scenario.traverseLength_m;
  const k = (scenario.odometryPct / 100); // fraction of distance
  const n = Math.max(2, Math.round(L / scenario.stationSpacing_m) + 1);
  const stations = [];

  // Anchor model: start at lander; optional loop closure; optional map ties every ~mapSpacing
  const anchors = [{ s: 0, sh: 0.05, sv: 0.05, kind: "lander" }];
  if (nav.loopClosure) anchors.push({ s: L, sh: 0.05, sv: 0.05, kind: "loop" });
  if (nav.landerRanging) {
    for (let s = 100; s < L; s += 100) anchors.push({ s, sh: 0.5, sv: 0.3, kind: "lander_range" });
  }
  if (nav.beacons) {
    for (let s = 50; s < L; s += 150) anchors.push({ s, sh: 0.3, sv: 0.2, kind: "beacon" });
  }
  if (nav.mapTie) {
    const tie = scenario.mapTieSigma_m;
    for (let s = Math.min(200, L / 2); s < L; s += 200) {
      anchors.push({ s, sh: tie, sv: tie * 0.4, kind: "map" });
    }
  }
  anchors.sort((a, b) => a.s - b.s);

  const fuse = (v1, v2) => (v1 * v2) / (v1 + v2);
  const channel = (rate, sig) => {
    const m = anchors.length;
    const vf = new Array(m);
    const vb = new Array(m);
    for (let i = 0; i < m; i++) {
      const va = sig(anchors[i]) ** 2;
      vf[i] = i === 0 ? va : fuse(vf[i - 1] + (rate * (anchors[i].s - anchors[i - 1].s)) ** 2, va);
    }
    for (let i = m - 1; i >= 0; i--) {
      const va = sig(anchors[i]) ** 2;
      vb[i] = i === m - 1 ? va : fuse(vb[i + 1] + (rate * (anchors[i + 1].s - anchors[i].s)) ** 2, va);
    }
    return (s) => {
      let i = 0;
      while (i + 1 < m && anchors[i + 1].s <= s) i++;
      const vF = vf[i] + (rate * (s - anchors[i].s)) ** 2;
      if (i + 1 >= m) return Math.sqrt(vF);
      const vB = vb[i + 1] + (rate * (anchors[i + 1].s - s)) ** 2;
      return Math.sqrt(fuse(vF, vB));
    };
  };

  // Along-track ~ odometry scale; cross ~ same order for contact+VO (first-order)
  const chAlong = channel(k, (a) => a.sh);
  const chCross = channel(k * 0.8, (a) => a.sh);
  const chVert = channel(k * 0.4, (a) => a.sv);

  for (let i = 0; i < n; i++) {
    const s = (i / (n - 1)) * L;
    const locAlong = chAlong(s);
    const locCross = chCross(s);
    const locVert = chVert(s);
    const mapH = nav.mapTie
      ? hypot(locAlong, locCross, 0) // map-relative after ties already in local
      : hypot(locAlong, locCross);
    const mapSigma = nav.mapTie ? Math.min(hypot(locAlong, locCross), scenario.mapTieSigma_m * 1.2) : hypot(locAlong, locCross);
    const cartH = hypot(mapSigma, scenario.cartographicSigma_m);
    const cartV = hypot(locVert, scenario.cartographicSigmaVert_m);
    stations.push({
      s,
      local: { along: locAlong, cross: locCross, vert: locVert, horiz: hypot(locAlong, locCross) },
      map: { horiz: mapSigma, vert: locVert },
      cartographic: { horiz: cartH, vert: cartV },
    });
  }

  // Pairwise relative between adjacent stations (correlated: open-loop growth over spacing)
  const spacing = scenario.stationSpacing_m;
  const relAlong = k * spacing;
  const relCross = k * 0.8 * spacing;
  const relVert = k * 0.4 * spacing;
  // Smoothing / loop reduces interior relative error vs open RT
  const rtFactor = 1.0;
  const smoothFactor = nav.loopClosure || scenario.navConops !== "local_rt" ? 0.55 : 0.85;
  const relative = {
    rt: { along: relAlong * rtFactor, cross: relCross * rtFactor, vert: relVert * rtFactor },
    post: { along: relAlong * smoothFactor, cross: relCross * smoothFactor, vert: relVert * smoothFactor },
  };

  // Observability of datum transform
  const observability = datumObservability(scenario, nav);

  // Transform applied. The mean Earth to principal axes rotation is in use.
  // The rotation size is not an error.
  // The rotation size is not a bias.
  // Report the size as text only.
  // The budget field is meanEarthToPrincipalAxesSigma_m.
  // The value is null until a source exists.
  // The uncertainty is common to all points.
  // Frame mistag. The frame mistag is a fault.
  // A principal axes product is used as mean Earth, or the transform is skipped.
  // frameMistagFault_m is the fault size.
  // Keep the fault out of every 1-sigma.
  // Keep the fault out of every bias field.
  const meanEarthToPrincipalAxesSize_m = PRESETS.control.me_pa_offset_m;
  const frameMistagFault = !!scenario.frameMistag;
  const meanEarthToPrincipalAxesSigma_m = null;
  const meanEarthToPrincipalAxesSigmaStatus = "TBD";
  const frameMistagFault_m = frameMistagFault ? meanEarthToPrincipalAxesSize_m : null;
  const meanEarthToPrincipalAxesAppliedText = frameMistagFault
    ? null
    : formatMeanEarthToPrincipalAxesAppliedText(meanEarthToPrincipalAxesSize_m);

  // Mid / worst local
  const mid = stations[Math.floor(stations.length / 2)];
  const worstLocal = stations.reduce((w, st) => (st.local.horiz > w.local.horiz ? st : w), stations[0]);

  return {
    nav,
    anchors,
    stations,
    relative,
    observability,
    frameMistagFault,
    frameMistagFault_m,
    meanEarthToPrincipalAxesSigma_m,
    meanEarthToPrincipalAxesSigmaStatus,
    meanEarthToPrincipalAxesAppliedText,
    mid,
    worstLocal,
    summary: {
      worstLocalHoriz_m: worstLocal.local.horiz,
      worstLocalVert_m: Math.max(...stations.map((s) => s.local.vert)),
      midMapHoriz_m: mid.map.horiz,
      midCartHoriz_m: mid.cartographic.horiz,
      midCartVert_m: mid.cartographic.vert,
      relativePostHoriz_m: hypot(relative.post.along, relative.post.cross),
      relativePostVert_m: relative.post.vert,
    },
  };
}

/**
 * Datum / transform observability.
 * Gravity pins roll and pitch. Celestial azimuth pins yaw. One lander point pins translation.
 * hasPoint and hasGravityAttitude come from the scenario or the ConOps.
 * An omitted flag stays true.
 */
export function datumObservability(scenario, nav = NAV_CONOPS[scenario.navConops]) {
  const hasPoint = scenario.hasPoint !== false && (!nav || nav.hasPoint !== false);
  const hasGravityAttitude =
    scenario.hasGravityAttitude !== false && (!nav || nav.hasGravityAttitude !== false);
  const hasAzimuth = !!(nav && nav.celestialAzimuth !== false) && scenario.celestialAzimuth_mrad < 100;
  const translation = hasPoint;
  const rollPitch = hasGravityAttitude;
  const yaw = hasAzimuth;
  const fullPose = translation && rollPitch && yaw;
  return {
    translation,
    rollPitch,
    yaw,
    fullPose,
    notes: fullPose
      ? "One lander point + gravity leveling + celestial azimuth constrains 6-DoF registration (to finite accuracy)."
      : "Missing attitude and/or point observations leave transform modes unconstrained.",
    azimuthSigma_mrad: scenario.celestialAzimuth_mrad,
  };
}

/**
 * Gravity survey time and drift network (first-order).
 */
export function gravitySurvey(scenario) {
  const L = scenario.traverseLength_m;
  const spacing = scenario.stationSpacing_m;
  const nStations = Math.max(2, Math.round(L / spacing) + 1);
  const walkSpeed = Math.max(0.01, scenario.walkSpeed_m_per_s);
  const settle = scenario.settle_s;
  const integ = scenario.integration_s;
  const dwell = settle + integ;
  const walkTime = L / walkSpeed;
  // Reoccupations: every cadence hours, return to base (approx half-traverse walk each way amortized)
  const missionH = PRESETS.mission.lunar_day_h;
  const cadenceH = Math.max(0.5, scenario.reoccupationCadence_h);
  const nReocc = Math.floor(missionH / cadenceH);
  const reoccWalk = nReocc * (L / 2) / walkSpeed; // crude
  const reoccDwell = nReocc * dwell;
  const stationTime = nStations * dwell;
  const totalTime_s = walkTime + stationTime + reoccWalk + reoccDwell;
  const coverageFraction = clamp(missionH * HOUR / totalTime_s, 0, 1);
  const achievableStations = Math.floor(nStations * coverageFraction);
  const achievableLength_m = achievableStations * spacing;

  // Drift residual after network: approx drift_rate * (cadence/2) with reoccupation; full open otherwise
  const driftRate = scenario.drift_uGal_per_day; // µGal/day
  const openDrift = driftRate * (totalTime_s / DAY);
  const adjustedDrift = driftRate * (cadenceH / 24) / Math.sqrt(2); // half-interval, network

  return {
    nStations,
    dwell_s: dwell,
    walkTime_s: walkTime,
    stationTime_s: stationTime,
    reoccWalk_s: reoccWalk,
    reoccDwell_s: reoccDwell,
    totalTime_s,
    mission_s: missionH * HOUR,
    coverageFraction,
    achievableStations,
    achievableLength_m,
    openDrift_uGal: openDrift,
    adjustedDrift_uGal: adjustedDrift,
    nReoccupations: nReocc,
  };
}

/**
 * Full gravity error budget + tube detectability.
 */
export function gravityAssessment(scenario, navResult, survey) {
  const elevSens = elevationSensitivity(scenario.bouguerDensity_kg_m3, scenario.useBouguerSensitivity);
  const sigmaU = navResult.summary.relativePostVert_m; // relative vertical drives free-air / Bouguer
  const elevTerm = elevSens * sigmaU;

  // Horizontal misplacement × field gradient near tube
  const depth = scenario.tubeDepth_m;
  const peak = Math.abs(
    tubeAnomalyInfinite_uGal(0, scenario.tubeRadius_m, depth, scenario.tubeDensityContrast)
  );
  // Max |d(Δg)/dx| for infinite cylinder ~ at x = zc/√3
  const xmax = depth / Math.sqrt(3);
  const g1 = tubeAnomalyInfinite_uGal(xmax - 0.5, scenario.tubeRadius_m, depth, scenario.tubeDensityContrast);
  const g2 = tubeAnomalyInfinite_uGal(xmax + 0.5, scenario.tubeRadius_m, depth, scenario.tubeDensityContrast);
  const grad = Math.abs(g2 - g1); // µGal/m
  const horizTerm = grad * navResult.summary.relativePostHoriz_m;

  // Tilt chain
  const level = scenario.activeLeveling ? scenario.levelingResidual_mrad * 1e-3 : 2e-3;
  const know = scenario.tiltKnowledge_mrad * 1e-3;
  const creep = scenario.lockedStance ? scenario.footCreep_mrad * 1e-3 : 1e-3;
  const tiltTotal = hypot(level, know, creep);
  const tiltTerm = tiltError_uGal(tiltTotal);

  // DEM / terrain: differential height error × elevation sensitivity + structured pit term
  const demDiff = scenario.demDifferential_m;
  // Map registration couples: local map error selects wrong terrain cell
  const mapReg = navResult.summary.midMapHoriz_m;
  const terrainFromHeight = elevSens * demDiff;
  // Crude pit-rim amplification: extra 0.3 * elevSens * demDiff when map error > 2 m
  const pitAmpl = mapReg > 2 ? 0.35 * terrainFromHeight : 0.1 * terrainFromHeight;
  const terrainTerm = hypot(terrainFromHeight, pitAmpl);

  // Tide residual (first-order incomplete model residual after correction)
  // Radial ±0.1 m → 18.7 µGal free-air component; residual after model ~ few µGal
  const tideRadialComponent = freeAirGradient() * 0.1;
  const tideResidual = 5; // µGal assumed residual after correction

  const driftTerm = survey.adjustedDrift_uGal;
  const instrumentNoise = 20; // µGal white / occupation (illustrative MEMS)

  // Gravity fields of the GRAIL type are given in principal axes.
  // This term should use the mean Earth to principal axes uncertainty.
  // This term should not use the map offset.
  // The 0.01 µGal/m gradient has no source (see issue #19).
  // The formula below is unchanged.
  // Decision 5: the baseline navigation core will be replaced, not tuned.
  // No new navigation model before G1.
  const grailGradient_uGal_per_m = 0.01; // ~ tens of µGal over km → ~0.01 µGal/m
  const grailTerm = grailGradient_uGal_per_m * navResult.summary.midCartHoriz_m;

  const terms = [
    { id: "instrument", name: "Instrument / occupation noise", uGal: instrumentNoise },
    { id: "drift", name: "Drift after network adjustment", uGal: driftTerm },
    { id: "elevation", name: `Elevation (sens ${elevSens.toFixed(1)} µGal/m)`, uGal: elevTerm },
    { id: "horizontal", name: "Horizontal × local gradient", uGal: horizTerm },
    { id: "tilt", name: "Tilt (level + knowledge + creep)", uGal: tiltTerm },
    { id: "terrain", name: "DEM / terrain (pit-structured)", uGal: terrainTerm },
    { id: "tide", name: "Tide model residual", uGal: tideResidual },
    { id: "grail", name: "Orbital gravity ramp residual", uGal: grailTerm },
  ].map((term) => ({ ...term, unit: "µGal" }));
  const total_uGal = hypot(...terms.map((t) => t.uGal));
  const ranked = [...terms].sort((a, b) => b.uGal - a.uGal);

  const signal = peak;
  const snr = signal / Math.max(total_uGal, 1e-9);
  const detectable = snr >= 3;

  return {
    elevSens,
    peak_uGal: peak,
    grad_uGal_per_m: grad,
    terms,
    ranked,
    total_uGal,
    snr,
    detectable,
    tideRadialComponent_uGal: tideRadialComponent,
    notes: [
      "Detectability uses SNR = peak_tube / RSS(budget); threshold SNR≥3.",
      "GRAIL/orbital field is a smooth km-scale ramp — map-relative DEM registration dominates cave science.",
      "Cartographic absolute mainly for archive / weak background ramp.",
    ],
  };
}

/**
 * GPR assessment.
 */
export function gprAssessment(scenario, navResult) {
  const lam = gprWavelength_m(scenario.gprFreq_MHz, scenario.gprEps);
  const alongNeed = lam / 4;
  const elevNeed = lam / 8;
  const rel = navResult.relative.post;
  const alongOk = rel.along <= alongNeed;
  const elevOk = rel.vert <= elevNeed;

  const belly = scenario.fixedBellyHeight ? 0.01 : 0.05; // m residual height variation
  const heightPhase_deg = (360 * scenario.gprFreq_MHz * 1e6 * 2 * belly) / 2.99792458e8;

  const mode3d = scenario.gprMode3d || scenario.surveyConops === "gpr_3d";
  const crossNeed = mode3d ? lam / 4 : null;

  // Continuous walking: time for length L
  const walkTime = scenario.traverseLength_m / Math.max(0.01, scenario.walkSpeed_m_per_s);
  const mission = PRESETS.mission.lunar_day_h * HOUR;
  // 3D grid: N lines across width ~100 m
  let coverageNote = "2D profiles along traverse";
  let lines = 1;
  let gridTime = walkTime;
  if (mode3d) {
    const width = 40;
    const dline = alongNeed;
    lines = Math.ceil(width / dline);
    gridTime = lines * (scenario.traverseLength_m / Math.max(0.01, scenario.walkSpeed_m_per_s));
    coverageNote = `${lines} lines @ ${dline.toFixed(2)} m for full-resolution 3D over 40 m width`;
  }

  return {
    lambda_m: lam,
    alongNeed_m: alongNeed,
    elevNeed_m: elevNeed,
    crossNeed_m: crossNeed,
    achievedAlong_m: rel.along,
    achievedElev_m: rel.vert,
    alongOk,
    elevOk,
    bellyResidual_m: belly,
    heightPhase_deg,
    mode3d,
    lines,
    gridTime_s: gridTime,
    fitsMission: gridTime < mission,
    coverageNote,
  };
}

/**
 * Spectrometer footprint assessment.
 */
export function spectrometerAssessment(scenario, navResult) {
  const foot = scenario.footSigma_m;
  const geo = navResult.summary.relativePostHoriz_m;
  const eff = effectiveFootprint_m(foot, geo);
  const allowed = allowedGeolocation_m(foot, 0.1);
  const stare = scenario.surveyConops === "spectro_stare";
  const broadeningOk = geo <= allowed;
  return {
    footSigma_m: foot,
    geoSigma_m: geo,
    effectiveSigma_m: eff,
    allowedGeo_m: allowed,
    broadeningOk,
    stopAndStare: stare,
    needsGlobal: false,
    notes: "Scene-relative co-registration drives science; cartographic absolute rarely required.",
  };
}

/**
 * Ranked error contributions for the active instrument.
 * Every term in the list has a unit. Terms in one list share that unit.
 * Gravity values stay in uGal.
 * GPR terms and the spectrometer footprint term use ratio.
 * The spectrometer map length is not in this list.
 * Imaging terms use value_m.
 */
export function rankErrors(instrument, gravity, gpr, spectro, navResult) {
  if (instrument === "gravimeter") return gravity.ranked;
  if (instrument === "gpr") {
    return [
      { id: "along", name: "Along-track relative pose", ratio: gpr.achievedAlong_m / gpr.alongNeed_m, unit: "m/m" },
      { id: "elev", name: "Elevation statics", ratio: gpr.achievedElev_m / gpr.elevNeed_m, unit: "m/m" },
      // The 0.01 m denominator is unsourced.
      // It equals the fixed-belly residual.
      // The real value depends on the GPR frequency (TBD).
      { id: "belly", name: "Antenna height / gait", ratio: gpr.bellyResidual_m / 0.01, unit: "m/m" },
    ].sort((a, b) => b.ratio - a.ratio);
  }
  if (instrument === "spectrometer") {
    const allowed_m = Math.max(spectro.allowedGeo_m, 1e-9);
    return [
      {
        id: "geo",
        name: "Footprint geolocation vs allowed",
        ratio: spectro.geoSigma_m / allowed_m,
        unit: "m/m",
      },
    ];
  }
  const imagingLabel = "no imaging requirement yet (TBD)";
  return [
    {
      id: "local",
      name: "Local horiz",
      value_m: navResult.summary.worstLocalHoriz_m,
      unit: "m",
      label: imagingLabel,
    },
    {
      id: "cart",
      name: "Cartographic horiz",
      value_m: navResult.summary.midCartHoriz_m,
      unit: "m",
      label: imagingLabel,
    },
  ];
}

/**
 * Terms that give context and are not ranked.
 * The spectrometer map length stays in metres.
 * Scene-relative position drives the spectrometer. Map registration is not a footprint need.
 */
export function contextTerms(instrument, navResult) {
  if (instrument !== "spectrometer") return [];
  return [
    {
      id: "map",
      name: "Map-relative (if used)",
      value_m: navResult.summary.midMapHoriz_m,
      unit: "m",
    },
  ];
}

/**
 * Mission-time resource summary.
 */
export function missionResources(scenario, survey, gpr) {
  const mission_s = PRESETS.mission.lunar_day_h * HOUR;
  let used = 0;
  let label = "";
  if (scenario.instrument === "gravimeter") {
    used = survey.totalTime_s;
    label = "gravity network + reoccupations";
  } else if (scenario.instrument === "gpr") {
    used = gpr.gridTime_s;
    label = gpr.mode3d ? "GPR 3D grid" : "GPR 2D traverse";
  } else {
    used = scenario.traverseLength_m / Math.max(0.01, scenario.walkSpeed_m_per_s);
    label = "walking traverse";
  }
  return {
    mission_s,
    used_s: used,
    fraction: used / mission_s,
    fits: used <= mission_s,
    label,
  };
}

/**
 * Control-source table with scenario-aware notes.
 */
export function assessControlSources() {
  return CONTROL_SOURCES.map((c) => ({ ...c }));
}

/**
 * Full scenario assessment.
 */
export function assess(partial = {}) {
  const scenario = { ...DEFAULT_SCENARIO, ...partial };
  const navResult = navigationUncertainty(scenario);
  const survey = gravitySurvey(scenario);
  const gravity = gravityAssessment(scenario, navResult, survey);
  const gpr = gprAssessment(scenario, navResult);
  const spectro = spectrometerAssessment(scenario, navResult);
  const resources = missionResources(scenario, survey, gpr);
  const ranked = rankErrors(scenario.instrument, gravity, gpr, spectro, navResult);
  const context = contextTerms(scenario.instrument, navResult);

  const layers = {
    local: {
      horiz_m: navResult.summary.worstLocalHoriz_m,
      vert_m: navResult.summary.worstLocalVert_m,
      drives: "autonomy, relative science, station spacing",
    },
    map: {
      horiz_m: navResult.summary.midMapHoriz_m,
      vert_m: navResult.mid.map.vert,
      drives: "DEM terrain correction, orbital context co-registration",
    },
    cartographic: {
      horiz_m: navResult.summary.midCartHoriz_m,
      vert_m: navResult.summary.midCartVert_m,
      drives: "archive / interoperability; weak for short-traverse cave vs lunar potential",
      text: formatCartographicSigmaText(
        navResult.summary.midCartHoriz_m,
        navResult.summary.midCartVert_m,
      ),
    },
    inertial: {
      azimuth_mrad: scenario.celestialAzimuth_mrad,
      drives: "tides, celestial azimuth, ephemeris timing",
    },
  };

  let science;
  if (scenario.instrument === "gravimeter") {
    science = {
      kind: "gravimetry",
      metric: "tube anomaly SNR",
      value: gravity.snr,
      pass: gravity.detectable,
      totalError_uGal: gravity.total_uGal,
      signal_uGal: gravity.peak_uGal,
      coverage_m: survey.achievableLength_m,
      coverageFraction: survey.coverageFraction,
    };
  } else if (scenario.instrument === "gpr") {
    science = {
      kind: "gpr",
      metric: "relative sampling vs λ/4",
      value: gpr.alongNeed_m / Math.max(gpr.achievedAlong_m, 1e-9),
      pass: gpr.alongOk && gpr.elevOk && gpr.fitsMission,
      lambda_m: gpr.lambda_m,
      coverageNote: gpr.coverageNote,
    };
  } else if (scenario.instrument === "spectrometer") {
    science = {
      kind: "spectrometer",
      metric: "geo ≤ allowed for footprint",
      value: spectro.allowedGeo_m / Math.max(spectro.geoSigma_m, 1e-9),
      pass: spectro.broadeningOk,
      foot_m: spectro.footSigma_m,
      geo_m: spectro.geoSigma_m,
    };
  } else {
    science = {
      kind: "imaging",
      metric: "local pose",
      value: 1 / Math.max(navResult.summary.worstLocalHoriz_m, 1e-9),
      pass: navResult.summary.worstLocalHoriz_m < 1,
    };
  }

  return {
    scenario,
    nav: navResult,
    survey,
    gravity,
    gpr,
    spectro,
    resources,
    ranked,
    context,
    layers,
    science,
    controlSources: assessControlSources(),
    observability: navResult.observability,
    pdfTrace: PDF_QUESTIONS.map((q) => ({
      ...q,
      addressedBy:
        q.id === "Q1"
          ? "FRAMES + state in layers"
          : q.id === "Q2"
            ? "datumObservability + control sources + nav ConOps"
            : q.id === "Q3"
              ? "instrument science-down + layers"
              : q.id === "Q4"
                ? "CONTROL_SOURCES (incl. negative track assessment)"
                : "ranked error budget + gravity/GPR/spectro propagation",
    })),
  };
}

/** Compare a few ConOps presets quickly. */
export function comparePresets(base = {}) {
  const navIds = ["local_rt", "smooth_loop", "map_tied", "lander_relative", "beacon_aided"];
  return navIds.map((navConops) => {
    const r = assess({ ...base, navConops });
    return {
      navConops,
      name: NAV_CONOPS[navConops].name,
      science: r.science,
      layers: r.layers,
      dominant: r.ranked[0],
    };
  });
}
