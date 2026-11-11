import { writeFileSync, readFileSync } from "node:fs";
import { blockedDemo, mapDemo } from "../src/demonstrations.mjs";
import { assess, selectedPoint } from "../src/localization.mjs";
import { serializeScenario } from "../src/scenario.mjs";
const check = process.argv.includes("--check");
const files = {};
const results = {};
for (const [name, scenario, cursor] of [
  ["blocked-uwb", blockedDemo(), 400],
  ["shared-map-limit", mapDemo(), 550],
]) {
  files[`scenarios/${name}.json`] = serializeScenario(scenario);
  const assessment = assess(scenario, { distances: [cursor] }),
    p = selectedPoint(assessment, cursor);
  results[name] = {
    cursor_m: cursor,
    baseline_sigma_m: p.baselineSigma,
    selected_sigma_m: p.selectedSigma,
    local_sigma_m: p.localSigma,
    observations: assessment.events.map(
      ({ kind, distance, status, applied }) => ({
        kind,
        distance_m: distance,
        status,
        applied,
      }),
    ),
  };
}
files["scenarios/results.json"] = JSON.stringify(results, null, 2) + "\n";
for (const [path, text] of Object.entries(files)) {
  if (check) {
    if (readFileSync(new URL("../" + path, import.meta.url), "utf8") !== text)
      throw new Error(`${path} differs. Run node scripts/demonstrations.mjs.`);
  } else writeFileSync(new URL("../" + path, import.meta.url), text);
}
console.log(
  check
    ? "Saved scenarios and results reproduce exactly."
    : "Generated saved scenarios and results.",
);
