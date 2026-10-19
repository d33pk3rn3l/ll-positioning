import { it } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { validateValuesFile } from "../src/values-format.mjs";

it("checks the product source values table", () => {
  const sourceTablePath = fileURLToPath(
    new URL("../docs/sources/values.csv", import.meta.url),
  );
  const result = validateValuesFile(sourceTablePath);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
});
