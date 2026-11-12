import { defaultScenario } from "./scenario.mjs";
function demonstration(name, values) {
  const s = { ...defaultScenario(), name, ...values };
  for (const key of Object.keys(values))
    if (s.inputMetadata[key])
      s.inputMetadata[key].source =
        "Synthetic demonstration input; no performance claim";
  return s;
}
export function blockedDemo() {
  return demonstration("Demo · blocked UWB link", {
    uwbEnabled: true,
    // Isolate wall blockage. This is not the default link capability.
    maxRange_m: 650,
  });
}
export function mapDemo() {
  return demonstration("Demo · shared map control limit", {
    landerH_m: 1000,
    heading_deg: 0,
    motionH_m: 0,
    mapEnabled: true,
    mapControl_m: 30,
    matchSigma_m: 0.5,
    mapSpacing_m: 10,
  });
}
