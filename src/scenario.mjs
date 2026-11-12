/** Versioned, unit-explicit inputs. All example performance values are assumptions. */
export const MODEL = "linear-gaussian-distance-random-walk-v1";
export const FRAME =
  "Synthetic lander-centred east-north-up, aligned to DE421 mean Earth";
const LEGACY_ASSUMPTIONS = {
  status: "assumed",
  source: "Sprint 1 illustrative inputs; no flight performance claim",
  statistic: "one standard deviation; horizontal values per axis",
  growth:
    "Independent motion increments: variance = sigma100^2 * distance_walked / 100 m",
  attitude: "Gravity-aligned roll and pitch; first-order initial yaw error",
  control:
    "Lander position and orbital map control priors are independent; each is shared across the route",
  availability:
    "UWB blocked behind the synthetic ravine bend; enabled available map matches succeed",
  height:
    "Geometric up from the synthetic local tangent plane; no lunar terrain or frame transform applied",
  landing:
    "Lander position knowledge describes the achieved position, not landing dispersion",
};
export const INPUTS = {
  ravineLength_m: {
    label: "Ravine distance walked",
    unit: "m",
    min: 0,
    max: 500,
    step: 10,
    value: 400,
    group: "mission",
  },
  climb_m: {
    label: "Ravine climb",
    unit: "m",
    min: 0,
    max: 250,
    step: 5,
    value: 80,
    group: "mission",
  },
  motionH_m: {
    label: "Horizontal motion σ at 100 m",
    unit: "m / axis",
    min: 0,
    max: 20,
    step: 0.1,
    value: 4,
    group: "robot",
  },
  motionU_m: {
    label: "Up motion σ at 100 m",
    unit: "m",
    min: 0,
    max: 20,
    step: 0.1,
    value: 4,
    group: "robot",
  },
  initH_m: {
    label: "Rover initialization σ, horizontal",
    unit: "m / axis",
    min: 0,
    max: 10,
    step: 0.05,
    value: 0.5,
    group: "robot",
  },
  initU_m: {
    label: "Rover initialization σ, up",
    unit: "m",
    min: 0,
    max: 10,
    step: 0.05,
    value: 0.5,
    group: "robot",
  },
  landerH_m: {
    label: "Lander position σ, horizontal",
    unit: "m / axis",
    min: 0,
    max: 1000,
    step: 0.5,
    value: 40,
    group: "reference",
  },
  landerU_m: {
    label: "Lander position σ, up",
    unit: "m",
    min: 0,
    max: 1000,
    step: 0.5,
    value: 15,
    group: "reference",
  },
  heading_deg: {
    label: "Initial heading σ",
    unit: "deg",
    min: 0,
    max: 10,
    step: 0.1,
    value: 3,
    group: "reference",
  },
  rangeSigma_m: {
    label: "Range measurement σ",
    unit: "m",
    min: 0,
    max: 100,
    step: 0.05,
    value: 0.5,
    group: "uwb",
  },
  maxRange_m: {
    label: "Assumed maximum range",
    unit: "m",
    min: 0,
    max: 1500,
    step: 25,
    value: 75,
    group: "uwb",
  },
  uwbSpacing_m: {
    label: "Range observation spacing",
    unit: "m walked",
    min: 5,
    max: 1000,
    step: 5,
    value: 50,
    group: "uwb",
  },
  matchSigma_m: {
    label: "Horizontal match σ",
    unit: "m / axis",
    min: 0,
    max: 100,
    step: 0.1,
    value: 5,
    group: "map",
  },
  mapControl_m: {
    label: "Shared map control σ",
    unit: "m / axis",
    min: 0,
    max: 100,
    step: 0.5,
    value: 30,
    group: "reference",
  },
  mapSpacing_m: {
    label: "Map observation spacing",
    unit: "m walked",
    min: 5,
    max: 1000,
    step: 5,
    value: 100,
    group: "map",
  },
};
const SOURCES = {
  motionH_m:
    "Planning allowance; LL reports ATE / trajectory length = 1%, RMSE and alignment unconfirmed. No automatic conversion.",
  motionU_m:
    "Planning allowance; no separate vertical test statistic supplied.",
  initH_m: "Planning allowance; rover deployment measurement is unspecified.",
  initU_m: "Planning allowance; rover deployment measurement is unspecified.",
  landerH_m:
    "Planning allowance including shared map control; Collins et al. 2026, doi:10.3390/rs18030525.",
  landerU_m:
    "Planning allowance; Henriksen et al. 2016, doi:10.5194/isprsarchives-XLI-B4-397-2016. Not a reported absolute sigma.",
  heading_deg:
    "Planning allowance conditional on an independent initial heading measurement. Aligned ATE does not specify heading accuracy.",
  rangeSigma_m:
    "Accepted line-of-sight range allowance; Chen et al. 2022, doi:10.3390/rs14174258. Not a conversion from paper RMSE.",
  maxRange_m:
    "Provisional 75 m cap; Chen et al. 2022 lists UWB range below 80 m. LL link budget is unspecified.",
  matchSigma_m:
    "Planning allowance; WARG (arXiv:2606.10602) reports 1.68 m real-data and 3.63 m domain-transfer errors, not per-axis sigma.",
  mapControl_m:
    "Shared horizontal control allowance; Collins et al. 2026 reports latitude offset spreads up to 22.4 m against uncertain references.",
};
export const inputMetadata = () =>
  Object.fromEntries(
    Object.entries(INPUTS).map(([key, d]) => [
      key,
      {
        unit: d.unit,
        statistic: /Sigma|motion|init|lander|heading|Control/.test(key)
          ? "one_sigma"
          : "not_applicable",
        status: "assumed",
        source:
          SOURCES[key] ?? "Synthetic route or assumed observation spacing",
      },
    ]),
  );
export function defaultScenario() {
  return {
    version: 2,
    model: MODEL,
    name: "Ravine traverse",
    frame: FRAME,
    approach_m: 150,
    ...Object.fromEntries(Object.entries(INPUTS).map(([k, v]) => [k, v.value])),
    inputMetadata: inputMetadata(),
    uwbEnabled: false,
    mapEnabled: false,
    terrainOcclusion: true,
    mapAvailable: true,
    landerFromMap: true,
    assumptions: {
      status: "assumed",
      source: "User-set planning inputs; no flight performance claim",
      statistic: "one standard deviation; horizontal values per axis",
      growth:
        "Independent motion increments: variance = sigma100^2 * distance_walked / 100 m",
      attitude: "Gravity-aligned roll and pitch; first-order initial yaw error",
      control:
        "Lander horizontal sigma includes shared map control when landerFromMap is true; otherwise priors are independent",
      availability:
        "UWB blocked behind the synthetic ravine bend; enabled available map matches succeed",
      height:
        "Geometric up from the synthetic local tangent plane; no lunar terrain or frame transform applied",
      landing:
        "Lander position knowledge describes the achieved position, not landing dispersion",
    },
  };
}
export function validateScenario(s) {
  const errors = [];
  if (!s || typeof s !== "object" || Array.isArray(s))
    return ["Scenario must be an object."];
  if (![1, 2].includes(s.version) || s.model !== MODEL)
    errors.push("Unsupported scenario version or growth model.");
  if (s.frame !== FRAME || s.approach_m !== 150)
    errors.push(
      "Sprint 1 requires the declared synthetic frame and 150 m approach.",
    );
  if (typeof s.name !== "string" || !s.name.trim() || s.name.length > 100)
    errors.push("Scenario name is required (up to 100 characters).");
  for (const [k, d] of Object.entries(INPUTS)) {
    if (s[k] === null || s[k] === undefined || s[k] === "")
      errors.push(`${d.label}: TBD. Enter a value in ${d.unit}.`);
    else if (
      typeof s[k] !== "number" ||
      !Number.isFinite(s[k]) ||
      s[k] < d.min ||
      s[k] > d.max
    )
      errors.push(`${d.label} must be ${d.min}–${d.max} ${d.unit}.`);
  }
  if (s.climb_m > s.ravineLength_m)
    errors.push("Climb cannot exceed ravine distance walked.");
  if (s.version === 2 && typeof s.landerFromMap !== "boolean")
    errors.push("landerFromMap must be true or false.");
  if (s.version === 1 && s.landerFromMap !== undefined)
    errors.push("Version 1 requires independent lander and map priors.");
  if (s.landerFromMap && s.landerH_m < s.mapControl_m)
    errors.push(
      "Lander position σ, horizontal must include the shared map control σ.",
    );
  for (const k of [
    "uwbEnabled",
    "mapEnabled",
    "terrainOcclusion",
    "mapAvailable",
  ])
    if (typeof s[k] !== "boolean") errors.push(`${k} must be true or false.`);
  if (
    !s.inputMetadata ||
    Object.entries(inputMetadata()).some(([key, fields]) =>
      Object.entries(fields).some(([field, value]) =>
        field === "source"
          ? typeof s.inputMetadata[key]?.source !== "string" ||
            !s.inputMetadata[key].source.trim() ||
            s.inputMetadata[key].source.length > 1000
          : s.inputMetadata[key]?.[field] !== value,
      ),
    )
  )
    errors.push(
      "Input units, statistics and assumption labels must match this model.",
    );
  const expected =
    s.version === 1 ? LEGACY_ASSUMPTIONS : defaultScenario().assumptions;
  if (
    !s.assumptions ||
    Object.keys(expected).some((k) => s.assumptions[k] !== expected[k])
  )
    errors.push("Scenario assumptions must match this declared model.");
  return errors;
}
export function serializeScenario(s) {
  const errors = validateScenario(s);
  if (errors.length) throw new Error(errors.join("\n"));
  return JSON.stringify(s, null, 2) + "\n";
}
export function parseScenario(text) {
  const s = JSON.parse(text);
  const errors = validateScenario(s);
  if (errors.length) throw new Error(errors.join("\n"));
  if (s.version === 1) {
    // Preserve old numeric inputs and independent priors. Do not apply new defaults.
    return {
      ...s,
      version: 2,
      landerFromMap: false,
      assumptions: defaultScenario().assumptions,
    };
  }
  return s;
}
export const totalDistance = (s) => s.approach_m + s.ravineLength_m;
export const bendDistance = (s) => s.approach_m + s.ravineLength_m * 0.45;
/** Piecewise straight, true distance parameterization; final leg bends 48 degrees. */
export function routePoint(s, distance) {
  const d = Math.max(0, Math.min(totalDistance(s), distance));
  if (d <= 150) return [d, 0, 0];
  const t = (d - 150) / (s.ravineLength_m || 1),
    bend = 0.45,
    angle = (48 * Math.PI) / 180;
  const horizontal = Math.sqrt(
    Math.max(0, s.ravineLength_m ** 2 - s.climb_m ** 2),
  );
  return [
    150 +
      horizontal *
        (Math.min(t, bend) + Math.max(0, t - bend) * Math.cos(angle)),
    horizontal * Math.max(0, t - bend) * Math.sin(angle),
    s.climb_m * t,
  ];
}
export function uwbAvailability(s, d) {
  if (s.terrainOcclusion && s.ravineLength_m > 0 && d > bendDistance(s) + 1e-8)
    return "Blocked by ravine wall";
  if (Math.hypot(...routePoint(s, d)) > s.maxRange_m)
    return "Outside maximum range";
  if (d === 0) return "No range direction at origin";
  return "Available";
}
