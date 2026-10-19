/**
 * LunarLeaper navigation / geodetic / science assessment model.
 * Declarative MBSE layer: frames, payloads, ConOps, sources, assumptions.
 * Numeric defaults are evidence-graded and scoped — never silently promoted to requirements.
 */

export const G = 6.6743e-11; // m^3 kg^-1 s^-2
export const R_MOON = 1_737_400; // m, IAU reference sphere radius
export const G_MOON = 1.62468; // m/s^2 surface gravity (approx)
export const FREE_AIR = (2 * G_MOON) / R_MOON * 1e8; // µGal/m ≈ 187.05
export const SLAB_COEFF = (2 * Math.PI * G) * 1e8; // µGal/m per (kg/m³) ≈ 0.041936

export const PDF_QUESTIONS = [
  {
    id: "Q1",
    text: "Define a local mission reference frame and quantities to estimate (position, attitude, time).",
  },
  {
    id: "Q2",
    text: "Register the local frame to the global lunar frame using geodetic control while minimizing accumulated uncertainty.",
  },
  {
    id: "Q3",
    text: "Translate payload science requirements into RT, relative, and post-processed geodetic accuracy.",
  },
  {
    id: "Q4",
    text: "Identify geodetic information sources that can improve the reconstructed trajectory.",
  },
  {
    id: "Q5",
    text: "Develop an error budget from trajectory uncertainty into science results.",
  },
];

export const FRAMES = {
  me_de440_me421: {
    id: "me_de440_me421",
    name: "ME / DE440 dynamics, DE421-aligned cartographic realization",
    layer: "cartographic",
    notes: "Default for new products (USGS / NAIF).",
  },
  me_de421: {
    id: "me_de421",
    name: "ME / DE421 legacy",
    layer: "cartographic",
    notes: "Legacy LRO-era cartographic products.",
  },
  pa: {
    id: "pa",
    name: "Principal Axis (PA)",
    layer: "inertial_ephemeris",
    notes: "Gravity models typically PA; ME↔PA mismatch ≈ 875 m great-circle.",
  },
  local_enu: {
    id: "local_enu",
    name: "Local topocentric ENU / site frame",
    layer: "map_relative",
    notes: "Science-driving local trajectory and DEM co-registration.",
  },
  lander: { id: "lander", name: "Lander body frame", layer: "map_relative" },
  body: { id: "body", name: "Quadruped body / navigation frame", layer: "map_relative" },
  payload: { id: "payload", name: "Instrument / antenna frames", layer: "map_relative" },
};

export const HEIGHT_CONVENTIONS = {
  radius: "Canonical: lunar center-of-mass radius r [m].",
  geometric: "h = r − 1,737,400 m (positive outward).",
  terrain_clearance: "Sensor height above local terrain (not a geodetic height).",
  potential: "Potential-referenced / geoid-like height — do not mix with geometric h.",
};

/** Control / information sources from the PDF, with graded assessments. */
export const CONTROL_SOURCES = [
  {
    id: "lander_nac",
    name: "Lander in LROC NAC / LOLA control",
    assessment: "primary",
    usable: true,
    notes:
      "Reliably recoverable object. Absolute accuracy inherits map product (typically ~5–15 m H / ~1–2 m V for post-2013 NAC DTMs vs LOLA).",
    evidence: "Wagner et al. 2024; Henriksen et al. 2017",
  },
  {
    id: "orbital_landmarks",
    name: "Orbital imagery landmarks (LRO NAC)",
    assessment: "useful_map_relative",
    usable: true,
    notes:
      "Improves map-relative localization when features are identifiable. Absolute accuracy limited by map/control skeleton, not NAC pixel scale.",
    evidence: "LROC controlled mosaics ~5–20 m absolute (product-dependent)",
  },
  {
    id: "visual_landmarks",
    name: "Local visual landmarks",
    assessment: "local_consistency",
    usable: true,
    notes: "Improves relative consistency / loop closure. Global only if independently surveyed.",
  },
  {
    id: "rover_tracks",
    name: "Quadruped footprints / tracks in NAC",
    assessment: "negative",
    usable: false,
    notes:
      "Individual small-quadruped prints are sub-pixel at 0.5–1 m/px NAC. Even LRV tracks (~23 cm) are often invisible at 50 cm/px. Not a geodetic source.",
    evidence: "LROC imaging notes on LRV track visibility",
  },
  {
    id: "active_beacons",
    name: "Deployed active surface beacons",
    assessment: "optional_high_cost",
    usable: true,
    notes: "Can provide local ranging/heading aids if deployed and powered.",
  },
  {
    id: "retroreflectors",
    name: "Laser retroreflectors (passive)",
    assessment: "external_geometry_required",
    usable: true,
    notes:
      "Requires external laser ranging (Earth or orbiter). Not equivalent to an active beacon. Legacy LLR set: five Apollo/Lunokhod arrays used by DE421/DE440; newer anchors exist separately.",
    evidence: "Wagner 2024; DE440; ILRS NGLR-1",
  },
];

export const ERROR_SOURCES = [
  {
    id: "leg_slip",
    name: "Stance-correlated foot slip / sinkage / settlement",
    units: "fraction of distance + mm settlement",
    correlation: "stance_correlated",
    affects: ["local_pose", "relative"],
    mitigation: "contact-aware estimator; downward ranging; locked stance for gravity",
    evidence: "TBD lunar; terrestrial VILENS / Cerberus ~1%",
  },
  {
    id: "vo_drift",
    name: "Visual odometry drift / illumination failure",
    units: "% distance",
    correlation: "random_walk_plus_outliers",
    affects: ["local_pose", "rt"],
    mitigation: "loop closure; map matching; lighting-aware planning",
    evidence: "terrestrial VO 1–4%; lunar TBD",
  },
  {
    id: "imu_bias",
    name: "IMU bias / scale",
    units: "m/s², rad/s",
    correlation: "systematic",
    affects: ["attitude", "rt"],
    mitigation: "calibration; gravity leveling; celestial azimuth",
  },
  {
    id: "map_registration",
    name: "Trajectory-to-DEM / NAC map registration",
    units: "m",
    correlation: "common_mode_map",
    affects: ["map_relative", "terrain_correction"],
    mitigation: "landmark matching; lander tie; DTM metadata",
  },
  {
    id: "cartographic_datum",
    name: "Cartographic / LOLA control skeleton",
    units: "m",
    correlation: "common_mode_datum",
    affects: ["cartographic_absolute"],
    mitigation: "use product-specific covariance; do not invent sub-control floors",
  },
  {
    id: "frame_mistag",
    name: "ME↔PA frame mis-tag",
    units: "m",
    correlation: "deterministic_fault",
    affects: ["cartographic_absolute"],
    mitigation: "explicit frame kernel tags; fault flag ~875 m",
  },
  {
    id: "timing",
    name: "Clock / sync / latency",
    units: "s → m via v·δt",
    correlation: "along_track",
    affects: ["footprint", "gpr"],
  },
  {
    id: "lever_boresight",
    name: "Lever arm / boresight / thermal deformation",
    units: "m, rad",
    correlation: "systematic",
    affects: ["footprint", "gpr", "imaging"],
  },
  {
    id: "grav_drift",
    name: "Gravimeter temporal drift",
    units: "µGal/day",
    correlation: "systematic_time",
    affects: ["gravimetry"],
    mitigation: "base/check reoccupation network adjustment",
  },
  {
    id: "tilt_settle",
    name: "Residual tilt + foot creep during dwell",
    units: "mrad",
    correlation: "quasi_static",
    affects: ["gravimetry"],
    mitigation: "active leveling + tilt knowledge + locked stance",
  },
  {
    id: "terrain_dem",
    name: "DEM / terrain correction near pit",
    units: "µGal",
    correlation: "spatially_structured",
    affects: ["gravimetry"],
    mitigation: "high-res local DEM; trajectory-to-DEM co-registration",
  },
  {
    id: "tide_model",
    name: "Body tide / direct attraction / induced potential residual",
    units: "µGal",
    correlation: "systematic_time",
    affects: ["gravimetry"],
  },
  {
    id: "gait_vibration",
    name: "Gait-phase antenna height / coherent vibration",
    units: "cm, rad",
    correlation: "periodic_gait",
    affects: ["gpr", "spectrometer_moving"],
    mitigation: "fixed belly height; position-triggered traces; stop-and-stare",
  },
];

export const MITIGATIONS = {
  active_leveling: {
    id: "active_leveling",
    name: "Active body leveling at stations",
    residualDefault_mrad: 0.2,
    cost: "leg stroke / energy",
  },
  locked_gravity_stance: {
    id: "locked_gravity_stance",
    name: "Locked / quiescent stance for gravity",
    residualDefault_mrad: 0.1,
    cost: "settle time",
  },
  fixed_belly_height: {
    id: "fixed_belly_height",
    name: "Fixed belly-height gait for GPR",
    residualHeight_cm: 1.0,
    cost: "terrain margin",
  },
  downward_range: {
    id: "downward_range",
    name: "Downward antenna range sensor",
    residualHeight_cm: 0.5,
    cost: "mass / power",
  },
  stop_and_stare: {
    id: "stop_and_stare",
    name: "Stop-and-stare spectrometer / gravity",
    residual: "removes gait pointing jitter",
    cost: "time",
  },
  base_reoccupation: {
    id: "base_reoccupation",
    name: "Base / check-station reoccupation",
    residual: "controls drift in network adjustment",
    cost: "walk-back + settle time",
  },
};

export const NAV_CONOPS = {
  local_rt: {
    id: "local_rt",
    name: "Local real-time leg/VO/IMU",
    description: "Contact-aided visual-inertial dead reckoning, no map tie.",
    mapTie: false,
    loopClosure: false,
    celestialAzimuth: true,
  },
  smooth_loop: {
    id: "smooth_loop",
    name: "Post-processed smoothing + loop closure",
    description: "Fixed-interval smoother with internal loop closures; lander-relative.",
    mapTie: false,
    loopClosure: true,
    celestialAzimuth: true,
  },
  map_tied: {
    id: "map_tied",
    name: "Map-tied (NAC/DEM landmarks)",
    description: "Local trajectory registered to orbital map/DEM.",
    mapTie: true,
    loopClosure: true,
    celestialAzimuth: true,
  },
  lander_relative: {
    id: "lander_relative",
    name: "Lander-relative ranging / vision",
    description: "Frequent lander observations bound local drift.",
    mapTie: false,
    landerRanging: true,
    loopClosure: true,
    celestialAzimuth: true,
  },
  beacon_aided: {
    id: "beacon_aided",
    name: "Active beacon-aided",
    description: "Deployed ranging beacons improve local absolute-to-site accuracy.",
    mapTie: true,
    beacons: true,
    loopClosure: true,
    celestialAzimuth: true,
  },
};

export const SURVEY_CONOPS = {
  gravity_network: {
    id: "gravity_network",
    name: "Stop-and-go gravity network",
    instrument: "gravimeter",
    continuous: false,
  },
  gpr_2d: {
    id: "gpr_2d",
    name: "Continuous walking GPR (2D profiles)",
    instrument: "gpr",
    continuous: true,
    mode3d: false,
  },
  gpr_3d: {
    id: "gpr_3d",
    name: "Walking GPR 3D grid",
    instrument: "gpr",
    continuous: true,
    mode3d: true,
  },
  spectro_stare: {
    id: "spectro_stare",
    name: "Stop-and-stare spectrometer",
    instrument: "spectrometer",
    continuous: false,
  },
  imaging_walk: {
    id: "imaging_walk",
    name: "Walking imaging / geology",
    instrument: "imaging",
    continuous: true,
  },
};

export const INSTRUMENTS = {
  gravimeter: {
    id: "gravimeter",
    name: "Gravimeter",
    needs: {
      rt: "coarse stationing",
      relative: "station-to-station elevation + spacing",
      map: "trajectory-to-DEM co-registration for terrain",
      cartographic: "archive; weak for cave vs lunar potential over hundreds of m",
      inertial: "tide / celestial azimuth timing",
    },
  },
  gpr: {
    id: "gpr",
    name: "Ground-penetrating radar",
    needs: {
      rt: "path following",
      relative: "cm–dm along-track for migration",
      map: "optional co-registration",
      cartographic: "usually not science-driving",
      inertial: "time sync",
    },
  },
  spectrometer: {
    id: "spectrometer",
    name: "Spectrometer (parametric / aspirational)",
    needs: {
      rt: "pointing",
      relative: "scene / footprint co-registration",
      map: "scene-relative",
      cartographic: "rarely required",
      inertial: "time",
    },
  },
  imaging: {
    id: "imaging",
    name: "Imaging / geology",
    needs: {
      rt: "pose",
      relative: "stereo / mosaic",
      map: "orbital map tie for context",
      cartographic: "archive",
      inertial: "time",
    },
  },
};

/** Evidence-graded numeric presets (scoped — not requirements). */
export const PRESETS = {
  odometry: {
    terrestrial_nominal_pct: 1.5,
    terrestrial_range_pct: [1, 2],
    lunar_tbd_prior_pct: 2.0,
    lunar_degraded_pct: 6.0,
    evidence: "Terrestrial legged VO/leg fusion ~1–2%; lunar regolith TBD — sweep required.",
  },
  map_matching: {
    conservative_m: 10,
    conservative_heading_deg: 5,
    optimistic_goal_m: 5,
    optimistic_heading_deg: 3,
    evidence: "LunarNav goal <5 m / <3° 3σ (not flight-proven); conservative ~10 m / 5°.",
  },
  control: {
    lola_standard_h_m: 7.5,
    lola_standard_v_m: 0.75,
    nac_dtm_h_m: 12,
    nac_dtm_v_m: 1.5,
    me_pa_offset_m: 875,
    de440_vs_de421_m: 0.6,
  },
  gravity: {
    freeAir_uGal_per_m: FREE_AIR,
    mems_drift_examples_uGal_per_day: [153, 268],
    vega_noise_uGal_at_600s: 300,
    tube_case: {
      label:
        "UI default uses infinite-cylinder geometry (r=30 m class → mGal peak). Literature irregular voids can be tens of µGal — sweep radius/depth; do not treat 25 µGal as a universal depth limit.",
      literature_peak_uGal_example: 65,
      detect_snr: 3,
    },
  },
  gpr: {
    freq_MHz: 500,
    eps_r: [3, 4],
    lambda_m: [0.3, 0.346],
  },
  mission: {
    lunar_day_h: 14 * 24,
  },
};

export const ASSUMPTIONS = [
  {
    id: "A1",
    text: "Platform is a continuously walking quadruped (not a hopper); gravity is stop-and-go.",
    status: "baseline",
  },
  {
    id: "A2",
    text: "Quadruped odometry on lunar regolith is TBD; terrestrial 1–2% is a prior for sensitivity only.",
    status: "tbd",
  },
  {
    id: "A3",
    text: "Most science is driven by map-relative / relative knowledge; cartographic absolute is for archive and weak for short-traverse cave vs lunar potential.",
    status: "baseline",
  },
  {
    id: "A4",
    text: "Rover tracks are not a usable NAC geodetic source for a small quadruped.",
    status: "baseline",
  },
  {
    id: "A5",
    text: "Post-processing can improve local interior estimates without external ties; global datum needs external observations.",
    status: "baseline",
  },
  {
    id: "A6",
    text: "Attitude observability: gravity pins roll/pitch; sun/star sensor can pin azimuth without a second surveyed point.",
    status: "baseline",
  },
];

export const DEFAULT_SCENARIO = {
  instrument: "gravimeter",
  navConops: "smooth_loop",
  surveyConops: "gravity_network",
  traverseLength_m: 800,
  walkSpeed_m_per_s: 0.15,
  stationSpacing_m: 25,
  settle_s: 600,
  integration_s: 600,
  reoccupationCadence_h: 6,
  drift_uGal_per_day: 200,
  odometryPct: PRESETS.odometry.lunar_tbd_prior_pct,
  mapTieSigma_m: PRESETS.map_matching.conservative_m,
  cartographicSigma_m: PRESETS.control.nac_dtm_h_m,
  cartographicSigmaVert_m: PRESETS.control.nac_dtm_v_m,
  celestialAzimuth_mrad: 0.2,
  levelingResidual_mrad: 0.2,
  tiltKnowledge_mrad: 0.15,
  footCreep_mrad: 0.1,
  demDifferential_m: 2.0,
  bouguerDensity_kg_m3: 2000,
  useBouguerSensitivity: true,
  tubeRadius_m: 30,
  tubeDepth_m: 48,
  tubeDensityContrast: 3000,
  tubeLength_m: Infinity,
  gprEps: 3.5,
  gprFreq_MHz: 500,
  gprMode3d: false,
  footSigma_m: 0.05,
  featureScale_m: 0.1,
  fixedBellyHeight: true,
  activeLeveling: true,
  lockedStance: true,
  frameMistag: false,
  // Default is true. The lander point and the gravity attitude are present.
  hasPoint: true,
  hasGravityAttitude: true,
};
