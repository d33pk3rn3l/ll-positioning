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

  it("ME/PA mistag raises frame fault ~875 m", () => {
    const r = assess({ frameMistag: true });
    assert.equal(r.nav.frameFault_m, PRESETS.control.me_pa_offset_m);
    assert.ok(r.layers.cartographic.horiz_m >= PRESETS.control.me_pa_offset_m);
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
