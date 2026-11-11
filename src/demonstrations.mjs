import { defaultScenario } from "./scenario.mjs";
export function blockedDemo() {
  return {
    ...defaultScenario(),
    name: "Demo · blocked UWB link",
    uwbEnabled: true,
  };
}
export function mapDemo() {
  return {
    ...defaultScenario(),
    name: "Demo · shared map control limit",
    landerH_m: 1000,
    heading_deg: 0,
    motionH_m: 0,
    mapEnabled: true,
    mapControl_m: 5,
    matchSigma_m: 0.5,
    mapSpacing_m: 10,
  };
}
