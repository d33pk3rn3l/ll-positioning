/**
 * Node test suite for LunarLeaper assessment engine.
 * Run: node --test tests/assessment.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FREE_AIR,
  freeAirGradient,
  slabGradient,
  elevationSensitivity,
  tiltError_uGal,
  tiltAngleForBudget_uGal,
  gprWavelength_m,
  tubeAnomalyInfinite_uGal,
  allowedGeolocation_m,
  effectiveFootprint_m,
  datumObservability,
  navigationUncertainty,
  gravitySurvey,
  spectrometerAssessment,
  assess,
  DEFAULT_SCENARIO,
  PRESETS,
  G_MOON,
} from "../src/assessment.mjs";

describe("constants and gradients", () => {
  it("free-air ≈ 187.05 µGal/m", () => {
    assert.ok(Math.abs(freeAirGradient() - 187.05) < 0.05);
    assert.ok(Math.abs(FREE_AIR - 187.05) < 0.05);
  });

  it("0.10 m radial → 18.705 µGal free-air", () => {
    assert.ok(Math.abs(0.1 * freeAirGradient() - 18.705) < 0.02);
  });

  it("Bouguer slab at 2000 kg/m³ leaves ~103.18 µGal/m", () => {
    const slab = slabGradient(2000);
    assert.ok(Math.abs(slab - 83.87) < 0.05);
    const eff = elevationSensitivity(2000, true);
    assert.ok(Math.abs(eff - 103.18) < 0.1);
  });

  it("10 µGal ideal tilt → ~0.3509 mrad", () => {
    const th = tiltAngleForBudget_uGal(10);
    assert.ok(Math.abs(th - 0.0003509) < 1e-6);
    assert.ok(Math.abs(tiltError_uGal(th) - 10) < 0.05);
  });
});

describe("GPR wavelength", () => {
  it("500 MHz at εr=3–4 → λ≈0.30–0.35 m", () => {
    const l3 = gprWavelength_m(500, 3);
    const l4 = gprWavelength_m(500, 4);
    assert.ok(l3 > 0.34 && l3 < 0.35); // c/(f√3) ≈ 0.346 m
    assert.ok(l4 > 0.299 && l4 < 0.301); // c/(f√4) = 0.300 m
    assert.ok(l4 < l3);
  });
});

describe("footprint geolocation", () => {
  it("narrowing footprint from 50 mm to 5 mm tightens allowed geo proportionally", () => {
    const a50 = allowedGeolocation_m(0.05, 0.1);
    const a5 = allowedGeolocation_m(0.005, 0.1);
    assert.ok(Math.abs(a50 / a5 - 10) < 1e-9);
    const eff = effectiveFootprint_m(0.05, a50);
    assert.ok(eff > 0.05);
  });
});

describe("tube forward model", () => {
  it("produces negative anomaly (mass deficit) peaking on axis", () => {
    const g0 = tubeAnomalyInfinite_uGal(0, 30, 48, 3000);
    const gFar = tubeAnomalyInfinite_uGal(200, 30, 48, 3000);
    assert.ok(g0 < 0);
    assert.ok(Math.abs(g0) > Math.abs(gFar));
  });

  it("large cylinder class is mGal-scale; weak void class is tens of µGal", () => {
    // Existing explorer geometry: r=30, z=48, Δρ=3000 → ~2 mGal (matches 2πGΔρr²/z)
    const large = Math.abs(tubeAnomalyInfinite_uGal(0, 30, 48, 3000));
    assert.ok(large > 1500 && large < 3000);
    // Smaller cross-section / deeper void class (literature-scale residual anomalies)
    const weak = Math.abs(tubeAnomalyInfinite_uGal(0, 8, 40, 2500));
    assert.ok(weak > 20 && weak < 200);
  });
});

describe("frame / correlation / observability", () => {
  it("common-mode cartographic translation does not inflate relative spacing", () => {
    const a = navigationUncertainty({ ...DEFAULT_SCENARIO, cartographicSigma_m: 1 });
    const b = navigationUncertainty({ ...DEFAULT_SCENARIO, cartographicSigma_m: 50 });
    assert.equal(a.relative.post.along, b.relative.post.along);
    assert.equal(a.summary.worstLocalHoriz_m, b.summary.worstLocalHoriz_m);
    assert.ok(b.summary.midCartHoriz_m > a.summary.midCartHoriz_m);
  });

  it("map bias affects cartographic more than local", () => {
    const r = assess({ cartographicSigma_m: 30, navConops: "map_tied" });
    assert.ok(r.layers.cartographic.horiz_m > r.layers.local.horiz_m);
  });

  it("ME/PA mistag is a fault of 875 m, kept out of the 1-sigma", () => {
    const r = assess({ frameMistag: true });
    const offset = PRESETS.control.me_pa_offset_m;
    assert.equal(r.nav.frameMistagFault, true);
    assert.equal(r.nav.frameMistagFault_m, offset);
    assert.equal(Object.hasOwn(r.nav, "frameFault_m"), false);
    assert.equal(Object.hasOwn(r.nav, "mePaOffset_m"), false);
    assert.ok(r.layers.cartographic.horiz_m < offset);
    assert.ok(r.layers.local.horiz_m < offset);
    assert.ok(r.layers.map.horiz_m < offset);
  });

  it("smoothing/loop can improve local relative without external map tie", () => {
    const open = navigationUncertainty({ ...DEFAULT_SCENARIO, navConops: "local_rt" });
    const smooth = navigationUncertainty({ ...DEFAULT_SCENARIO, navConops: "smooth_loop" });
    assert.ok(smooth.relative.post.along < open.relative.post.along);
    // without map tie, cartographic still inherits large datum
    assert.ok(smooth.summary.midCartHoriz_m > 5);
  });

  it("only external/map observations improve map-relative bound vs pure open DR mid-traverse", () => {
    const open = navigationUncertainty({
      ...DEFAULT_SCENARIO,
      navConops: "local_rt",
      traverseLength_m: 800,
      odometryPct: 2,
    });
    const mapped = navigationUncertainty({
      ...DEFAULT_SCENARIO,
      navConops: "map_tied",
      traverseLength_m: 800,
      odometryPct: 2,
      mapTieSigma_m: 5,
    });
    assert.ok(mapped.summary.worstLocalHoriz_m < open.summary.worstLocalHoriz_m);
  });

  it("one point + gravity + celestial azimuth constrains full pose observability", () => {
    const obs = datumObservability({ ...DEFAULT_SCENARIO, celestialAzimuth_mrad: 0.2 }, {
      celestialAzimuth: true,
    });
    assert.equal(obs.translation, true);
    assert.equal(obs.rollPitch, true);
    assert.equal(obs.yaw, true);
    assert.equal(obs.fullPose, true);
  });

  it("a scenario with no point tie gives translation false", () => {
    const obs = datumObservability(
      { ...DEFAULT_SCENARIO, hasPoint: false, celestialAzimuth_mrad: 0.2 },
      { celestialAzimuth: true },
    );
    assert.equal(obs.translation, false);
    assert.equal(obs.rollPitch, true);
    assert.equal(obs.yaw, true);
    assert.equal(obs.fullPose, false);
  });

  it("a ConOps with no point tie gives translation false", () => {
    const obs = datumObservability(
      { ...DEFAULT_SCENARIO, celestialAzimuth_mrad: 0.2 },
      { celestialAzimuth: true, hasPoint: false },
    );
    assert.equal(obs.translation, false);
    assert.equal(obs.fullPose, false);
  });

  it("a scenario with no gravity attitude gives roll and pitch false", () => {
    const obs = datumObservability(
      { ...DEFAULT_SCENARIO, hasGravityAttitude: false, celestialAzimuth_mrad: 0.2 },
      { celestialAzimuth: true },
    );
    assert.equal(obs.rollPitch, false);
    assert.equal(obs.translation, true);
    assert.equal(obs.fullPose, false);
  });
});

describe("gravity survey trades", () => {
  it("longer settle/reoccupation reduces coverage", () => {
    const fast = gravitySurvey({ ...DEFAULT_SCENARIO, settle_s: 60, integration_s: 60, reoccupationCadence_h: 24 });
    const slow = gravitySurvey({ ...DEFAULT_SCENARIO, settle_s: 900, integration_s: 900, reoccupationCadence_h: 2 });
    assert.ok(fast.coverageFraction >= slow.coverageFraction);
  });

  it("tighter reoccupation cadence reduces adjusted drift", () => {
    const loose = gravitySurvey({ ...DEFAULT_SCENARIO, reoccupationCadence_h: 24, drift_uGal_per_day: 200 });
    const tight = gravitySurvey({ ...DEFAULT_SCENARIO, reoccupationCadence_h: 3, drift_uGal_per_day: 200 });
    assert.ok(tight.adjustedDrift_uGal < loose.adjustedDrift_uGal);
  });

  it("moving gait data are not treated as gravity observations (stop-and-go dwell required)", () => {
    const s = gravitySurvey(DEFAULT_SCENARIO);
    assert.ok(s.dwell_s > 0);
    assert.ok(s.stationTime_s > 0);
  });
});

describe("monotonicity", () => {
  it("more odometry drift cannot improve local uncertainty", () => {
    const a = assess({ odometryPct: 1 });
    const b = assess({ odometryPct: 5 });
    assert.ok(b.layers.local.horiz_m >= a.layers.local.horiz_m);
  });

  it("poorer cartographic control cannot improve absolute accuracy", () => {
    const a = assess({ cartographicSigma_m: 5 });
    const b = assess({ cartographicSigma_m: 40 });
    assert.ok(b.layers.cartographic.horiz_m >= a.layers.cartographic.horiz_m);
  });

  it("changing cartographic datum does not alter purely local relative metrics", () => {
    const a = assess({ cartographicSigma_m: 5, instrument: "gpr" });
    const b = assess({ cartographicSigma_m: 40, instrument: "gpr" });
    assert.equal(a.nav.relative.post.along, b.nav.relative.post.along);
  });

  it("more DEM differential error increases gravity terrain term", () => {
    const a = assess({ demDifferential_m: 0.5, instrument: "gravimeter" });
    const b = assess({ demDifferential_m: 3, instrument: "gravimeter" });
    const ta = a.gravity.terms.find((t) => t.id === "terrain").uGal;
    const tb = b.gravity.terms.find((t) => t.id === "terrain").uGal;
    assert.ok(tb > ta);
  });
});

describe("tide radial component", () => {
  it("±0.1 m radial body tide → ~18.7 µGal free-air component", () => {
    const r = assess({ instrument: "gravimeter" });
    assert.ok(Math.abs(r.gravity.tideRadialComponent_uGal - 18.7) < 0.1);
  });
});

describe("control sources", () => {
  it("marks rover tracks as unusable / negative", () => {
    const r = assess();
    const tracks = r.controlSources.find((c) => c.id === "rover_tracks");
    assert.equal(tracks.usable, false);
    assert.equal(tracks.assessment, "negative");
  });
});

describe("spectrometer stop-and-stare", () => {
  const nav = { summary: { relativePostHoriz_m: 0.2 } };

  function stopAndStare(surveyConops) {
    return spectrometerAssessment(
      { ...DEFAULT_SCENARIO, surveyConops },
      nav,
    ).stopAndStare;
  }

  it("is true only for spectro_stare", () => {
    for (const id of ["gravity_network", "gpr_2d", "gpr_3d", "imaging_walk"]) {
      assert.equal(stopAndStare(id), false, id);
    }
    assert.equal(stopAndStare("spectro_stare"), true);
  });
});

describe("end-to-end assess", () => {
  it("returns science, layers, ranked errors, and PDF trace", () => {
    const r = assess({ instrument: "gravimeter" });
    assert.ok(r.science);
    assert.ok(r.layers.local);
    assert.ok(r.ranked.length >= 3);
    assert.equal(r.pdfTrace.length, 5);
    assert.ok(Number.isFinite(r.gravity.snr));
  });
});

describe("ranked error units", () => {
  const instruments = ["gravimeter", "gpr", "spectrometer", "imaging"];

  for (const instrument of instruments) {
    it(`${instrument}: every ranked term has one shared explicit unit`, () => {
      const r = assess({ instrument });
      assert.ok(r.ranked.length >= 1);
      for (const term of r.ranked) {
        assert.equal(typeof term.unit, "string");
        assert.ok(term.unit.length > 0);
      }
      const unit = r.ranked[0].unit;
      for (const term of r.ranked) {
        assert.equal(term.unit, unit);
      }
    });
  }

  it("gravity terms keep microgal values in uGal", () => {
    const r = assess({ instrument: "gravimeter" });
    for (const term of r.ranked) {
      assert.equal(term.unit, "µGal");
      assert.equal(typeof term.uGal, "number");
      assert.ok(Number.isFinite(term.uGal));
      assert.equal(Object.hasOwn(term, "ratio"), false);
    }
  });

  it("GPR and spectrometer terms use a ratio and do not use uGal", () => {
    for (const instrument of ["gpr", "spectrometer"]) {
      const r = assess({ instrument });
      assert.equal(r.ranked[0].unit, "m/m");
      for (const term of r.ranked) {
        assert.equal(Object.hasOwn(term, "uGal"), false);
        assert.equal(typeof term.ratio, "number");
        assert.ok(Number.isFinite(term.ratio));
      }
    }
  });

  it("GPR ratios stay equal to the length ratios", () => {
    const r = assess({ instrument: "gpr" });
    const along = r.ranked.find((t) => t.id === "along");
    const elev = r.ranked.find((t) => t.id === "elev");
    const belly = r.ranked.find((t) => t.id === "belly");
    assert.ok(Math.abs(along.ratio - r.gpr.achievedAlong_m / r.gpr.alongNeed_m) < 1e-12);
    assert.ok(Math.abs(elev.ratio - r.gpr.achievedElev_m / r.gpr.elevNeed_m) < 1e-12);
    assert.ok(Math.abs(belly.ratio - r.gpr.bellyResidual_m / 0.01) < 1e-12);
  });

  it("spectrometer footprint ratio stays a ratio to the allowed geolocation", () => {
    const r = assess({ instrument: "spectrometer" });
    const allowed_m = Math.max(r.spectro.allowedGeo_m, 1e-9);
    const geo = r.ranked.find((t) => t.id === "geo");
    assert.ok(geo);
    assert.ok(Math.abs(geo.ratio - r.spectro.geoSigma_m / allowed_m) < 1e-12);
  });

  it("spectrometer map term is in metres and is not compared to allowedGeo_m", () => {
    const r = assess({ instrument: "spectrometer" });
    const map = r.context.find((t) => t.id === "map");
    const allowed_m = r.spectro.allowedGeo_m;
    assert.ok(map);
    assert.equal(map.unit, "m");
    assert.equal(map.value_m, r.nav.summary.midMapHoriz_m);
    assert.equal(Object.hasOwn(map, "ratio"), false);
    assert.equal(r.ranked.some((t) => t.id === "map"), false);
    assert.ok(Math.abs(map.value_m - r.nav.summary.midMapHoriz_m / allowed_m) > 1);
  });

  it("imaging terms use value_m and state that the requirement is TBD", () => {
    const r = assess({ instrument: "imaging" });
    const local = r.ranked.find((t) => t.id === "local");
    const cart = r.ranked.find((t) => t.id === "cart");
    assert.equal(local.unit, "m");
    assert.equal(cart.unit, "m");
    assert.equal(Object.hasOwn(local, "uGal"), false);
    assert.equal(Object.hasOwn(local, "score"), false);
    assert.equal(Object.hasOwn(cart, "score"), false);
    assert.equal(local.value_m, r.nav.summary.worstLocalHoriz_m);
    assert.equal(cart.value_m, r.nav.summary.midCartHoriz_m);
    assert.equal(local.label, "no imaging requirement yet (TBD)");
    assert.equal(cart.label, "no imaging requirement yet (TBD)");
  });
});

/** Every local, map-relative, and cartographic 1-sigma on one assessment. */
function oneSigmaValues(r) {
  const s = r.nav.summary;
  const values = [
    r.layers.local.horiz_m,
    r.layers.local.vert_m,
    r.layers.map.horiz_m,
    r.layers.map.vert_m,
    r.layers.cartographic.horiz_m,
    r.layers.cartographic.vert_m,
    s.worstLocalHoriz_m,
    s.worstLocalVert_m,
    s.midMapHoriz_m,
    s.midCartHoriz_m,
    s.midCartVert_m,
    s.relativePostHoriz_m,
    s.relativePostVert_m,
  ];
  for (const st of r.nav.stations) {
    values.push(
      st.local.along,
      st.local.cross,
      st.local.vert,
      st.local.horiz,
      st.map.horiz,
      st.map.vert,
      st.cartographic.horiz,
      st.cartographic.vert,
    );
  }
  return values;
}

describe("ME/PA offset is a bias, not a 1-sigma (D-007)", () => {
  it("no 1-sigma value contains the 875 m ME/PA offset", () => {
    const offset = PRESETS.control.me_pa_offset_m;
    assert.equal(offset, 875);
    const on = assess({ frameMistag: true });
    const off = assess({ frameMistag: false });
    const onSigmas = oneSigmaValues(on);
    const offSigmas = oneSigmaValues(off);
    assert.equal(onSigmas.length, offSigmas.length);
    for (let i = 0; i < onSigmas.length; i++) {
      assert.ok(onSigmas[i] < offset, `1-sigma ${onSigmas[i]} contains the ${offset} m ME/PA offset`);
      assert.equal(onSigmas[i], offSigmas[i]);
    }
  });

  it("ME-to-PA uncertainty is null with status TBD", () => {
    const r = assess({ frameMistag: false });
    assert.equal(r.nav.mePaTransformSigma_m, null);
    assert.equal(r.nav.mePaTransformSigmaStatus, "TBD");
    assert.equal(Object.hasOwn(r.nav, "mePaOffsetSigma_m"), false);
  });

  it("changing the ME/PA offset does not change local or map-relative sigmas, nor gravity SNR", () => {
    const saved = PRESETS.control.me_pa_offset_m;
    try {
      PRESETS.control.me_pa_offset_m = 875;
      const a = assess({ frameMistag: true, instrument: "gravimeter" });
      PRESETS.control.me_pa_offset_m = 100;
      const b = assess({ frameMistag: true, instrument: "gravimeter" });
      assert.equal(a.layers.local.horiz_m, b.layers.local.horiz_m);
      assert.equal(a.layers.local.vert_m, b.layers.local.vert_m);
      assert.equal(a.layers.map.horiz_m, b.layers.map.horiz_m);
      assert.equal(a.layers.map.vert_m, b.layers.map.vert_m);
      assert.equal(a.nav.summary.worstLocalHoriz_m, b.nav.summary.worstLocalHoriz_m);
      assert.equal(a.nav.summary.midMapHoriz_m, b.nav.summary.midMapHoriz_m);
      assert.equal(a.layers.cartographic.horiz_m, b.layers.cartographic.horiz_m);
      assert.equal(a.layers.cartographic.vert_m, b.layers.cartographic.vert_m);
      assert.equal(a.nav.summary.midCartHoriz_m, b.nav.summary.midCartHoriz_m);
      assert.equal(a.gravity.snr, b.gravity.snr);
    } finally {
      PRESETS.control.me_pa_offset_m = saved;
    }
  });
});

const APPLIED_TEXT = "ME-to-PA applied (about 875 m); residual uncertainty TBD, common-mode";
const CARTO_EXCLUSION = "excludes ME-to-PA uncertainty (TBD)";

function numericFieldProblems(value, path = "r", problems = []) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => numericFieldProblems(item, `${path}[${i}]`, problems));
    return problems;
  }
  if (!value || typeof value !== "object") return problems;
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    const metreLike =
      /(_m|_uGal|_mrad)$/.test(key) ||
      key === "uGal" ||
      key === "snr" ||
      key === "ratio" ||
      key === "value_m";
    if (typeof child === "number" && Number.isNaN(child)) problems.push(`${childPath} is NaN`);
    if (metreLike) {
      if (typeof child === "string") problems.push(`${childPath} is a string`);
      else if (child !== null && typeof child !== "number") problems.push(`${childPath} is ${typeof child}`);
    }
    if (child && typeof child === "object") numericFieldProblems(child, childPath, problems);
  }
  return problems;
}

describe("ME-to-PA cases (prof-geodesy review)", () => {
  it("case A: applied transform is text only; uncertainty is null and TBD", async () => {
    const engine = await import("../src/assessment.mjs");
    assert.equal(typeof engine.formatMePaAppliedText, "function");
    assert.equal(engine.formatMePaAppliedText(PRESETS.control.me_pa_offset_m), APPLIED_TEXT);
    const r = assess({ frameMistag: false });
    assert.equal(r.nav.mePaAppliedText, APPLIED_TEXT);
    assert.equal(r.nav.mePaTransformSigma_m, null);
    assert.equal(r.nav.mePaTransformSigmaStatus, "TBD");
    assert.equal(r.nav.frameMistagFault, false);
    assert.equal(Object.hasOwn(r.nav, "mePaOffset_m"), false);
    assert.equal(Object.hasOwn(r.nav, "mePaOffsetSigma_m"), false);
    assert.equal(Object.hasOwn(r.nav, "frameFault_m"), false);
    assert.equal(
      r.gravity.terms.some((term) => term.uGal === PRESETS.control.me_pa_offset_m),
      false,
    );
    assert.equal(String(r.layers.cartographic.text ?? "").includes("875"), false);
  });

  it("case B: frame mistag is a fault flag, not a bias and not a 1-sigma", () => {
    const r = assess({ frameMistag: true });
    const offset = PRESETS.control.me_pa_offset_m;
    assert.equal(r.nav.frameMistagFault, true);
    assert.equal(r.nav.frameMistagFault_m, offset);
    assert.equal(r.nav.mePaTransformSigma_m, null);
    assert.equal(r.nav.mePaAppliedText, null);
    assert.equal(Object.hasOwn(r.nav, "mePaOffset_m"), false);
    assert.equal(Object.hasOwn(r.nav, "frameFault_m"), false);
    for (const value of oneSigmaValues(r)) {
      assert.ok(value < offset);
    }
  });

  it("cartographic 1-sigma text excludes ME-to-PA uncertainty (TBD)", async () => {
    const engine = await import("../src/assessment.mjs");
    assert.equal(typeof engine.formatCartographicSigmaText, "function");
    const r = assess();
    const text = engine.formatCartographicSigmaText(
      r.layers.cartographic.horiz_m,
      r.layers.cartographic.vert_m,
    );
    assert.match(text, new RegExp(CARTO_EXCLUSION.replace(/[()]/g, "\\$&")));
    assert.match(text, /14\.02/);
    assert.equal(text.includes("875"), false);
    assert.equal(r.layers.cartographic.text, text);
  });

  it("no numeric output is NaN or a string", () => {
    for (const frameMistag of [false, true]) {
      const problems = numericFieldProblems(assess({ frameMistag, instrument: "gravimeter" }));
      assert.deepEqual(problems, []);
    }
  });
});
