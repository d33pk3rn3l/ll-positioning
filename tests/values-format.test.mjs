/**
 * Check the values table format.
 * Run: node --test tests/values-format.test.mjs
 * The product source table is not checked here.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseCommaSeparatedValues,
  validateValuesFile,
  validateValuesText,
} from "../src/values-format.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const formatRules = JSON.parse(readFileSync(join(testDirectory, "values-schema.json"), "utf8"));
const fixtureDirectory = join(testDirectory, "fixtures", "values");

const columnNames = [
  "value_id",
  "source_key",
  "quantity",
  "value",
  "uncertainty",
  "statistic",
  "unit",
  "value_type",
  "frame",
  "frame_status",
  "height_reference",
  "gravity_product",
  "averaging_time",
  "grade",
  "conditions",
  "note_anchor",
];

function fixturePath(fileName) {
  return join(fixtureDirectory, fileName);
}

function readFixture(fileName) {
  return readFileSync(fixturePath(fileName), "utf8");
}

function assertFinding(finding, expected) {
  assert.equal(finding.rowNumber, expected.rowNumber);
  assert.equal(finding.columnName, expected.columnName);
  assert.equal(finding.cellValue, expected.cellValue);
  const prefix = `Row ${expected.rowNumber}, column ${expected.columnName}, value "${expected.cellValue}":`;
  assert.ok(finding.message.startsWith(prefix), finding.message);
  assert.ok(finding.message.includes(expected.reason), finding.message);
}

function smallFormatRules() {
  return {
    formatVersion: 2,
    columns: [
      { name: "value_id", required: true, numeric: false, identifier: true },
      { name: "value", required: true, numeric: true },
      { name: "unit", required: true, numeric: false, vocabulary: "unit" },
    ],
    vocabularies: { unit: ["m"] },
  };
}

function cellByName(record, headerNames, columnName) {
  return record.cells[headerNames.indexOf(columnName)];
}

describe("comma-separated values parser", () => {
  it("keeps a comma inside a quoted field", () => {
    const parsed = parseCommaSeparatedValues('"one, two",next\n');
    assert.deepEqual(parsed.findings, []);
    assert.deepEqual(parsed.records[0].cells, ["one, two", "next"]);
    assert.equal(parsed.records[0].lineNumber, 1);
  });

  it("keeps a quote inside a quoted field", () => {
    const parsed = parseCommaSeparatedValues('"say ""hello""",next\n');
    assert.deepEqual(parsed.findings, []);
    assert.deepEqual(parsed.records[0].cells, ['say "hello"', "next"]);
  });

  it("keeps a line break inside a quoted field", () => {
    const parsed = parseCommaSeparatedValues('"line one\nline two",tail\n');
    assert.deepEqual(parsed.findings, []);
    assert.equal(parsed.records.length, 1);
    assert.equal(parsed.records[0].lineNumber, 1);
    assert.deepEqual(parsed.records[0].cells, ["line one\nline two", "tail"]);
  });

  it("reads a carriage return and a line feed as one row break", () => {
    const parsed = parseCommaSeparatedValues("a,b\r\nc,d\r\n");
    assert.deepEqual(parsed.findings, []);
    assert.deepEqual(parsed.records.map((record) => record.cells), [
      ["a", "b"],
      ["c", "d"],
    ]);
    assert.deepEqual(parsed.records.map((record) => record.lineNumber), [1, 2]);
  });

  it("keeps an empty field", () => {
    const parsed = parseCommaSeparatedValues("a,,c\n");
    assert.deepEqual(parsed.findings, []);
    assert.deepEqual(parsed.records[0].cells, ["a", "", "c"]);
    const quotedEmpty = parseCommaSeparatedValues('"","x"\n');
    assert.deepEqual(quotedEmpty.records[0].cells, ["", "x"]);
  });

  it("ignores a byte order mark before the first column", () => {
    const parsed = parseCommaSeparatedValues("\uFEFFvalue_id,value\nonly,1\n");
    assert.deepEqual(parsed.findings, []);
    assert.equal(parsed.records[0].cells[0], "value_id");
  });

  it("reports a quote in the wrong place", () => {
    const parsed = parseCommaSeparatedValues('"a", "b"\n');
    assert.equal(parsed.findings.length, 1);
    assert.equal(parsed.findings[0].rowNumber, 1);
    assert.ok(parsed.findings[0].message.includes("A quote is in the wrong place."));
  });

  it("reports a quoted field that is not closed", () => {
    const parsed = parseCommaSeparatedValues('"open,1\n');
    assert.equal(parsed.findings.length, 1);
    assert.equal(parsed.findings[0].rowNumber, 1);
    assert.ok(parsed.findings[0].cellValue.includes("open"));
    assert.ok(parsed.findings[0].message.includes("A quoted field is not closed."));
    assert.ok(parsed.findings[0].message.startsWith("Row 1, column "));
  });
});

describe("format rules file", () => {
  it("holds format version 2 and the agreed lists", () => {
    assert.deepEqual(Object.keys(formatRules), ["formatVersion", "columns", "vocabularies"]);
    assert.equal(formatRules.formatVersion, 2);
    assert.equal(typeof formatRules.formatVersion, "number");
    assert.deepEqual(formatRules.columns.map((column) => column.name), columnNames);
    assert.deepEqual(
      formatRules.columns
        .filter((column) => column.vocabulary)
        .map((column) => [column.name, column.vocabulary]),
      [
        ["statistic", "statistic"],
        ["unit", "unit"],
        ["value_type", "value_type"],
        ["frame", "frame"],
        ["frame_status", "frame_status"],
        ["height_reference", "height_reference"],
        ["gravity_product", "gravity_product"],
        ["grade", "grade"],
      ],
    );
    assert.deepEqual(formatRules.vocabularies, {
      statistic: [
        "one_sigma",
        "three_sigma",
        "maximum",
        "range_minimum",
        "range_maximum",
        "typical",
        "author_judgement",
        "not_stated",
        "rms",
        "scaled_formal",
        "mean",
        "median",
        "percentile_95",
        "linear_error_90_percent",
        "circular_error_90_percent",
        "peak_to_peak",
      ],
      value_type: ["measured", "requirement", "model", "derived", "specification"],
      frame: [
        "mean_earth_de421",
        "mean_earth_de440",
        "principal_axes_de421",
        "principal_axes_de430",
        "principal_axes_de440",
        "mean_earth_unknown_realization",
        "principal_axes_unknown_realization",
        "not_stated",
        "not_applicable",
        "principal_axes_inpop19a",
        "iau_moon_approximate_mean_earth",
      ],
      frame_status: ["sourced", "inferred", "not_applicable"],
      height_reference: ["sphere_1737400m", "other_stated", "not_stated", "not_applicable"],
      gravity_product: ["magnitude", "vertical_component", "full_vector", "not_applicable"],
      grade: ["A", "B", "C", "D"],
      unit: [
        "m",
        "km",
        "m/s",
        "m/s^2",
        "km^3/s^2",
        "uGal",
        "mGal",
        "uGal/m",
        "uGal/sqrt(Hz)",
        "mrad",
        "urad",
        "arcsec",
        "arcmin",
        "deg",
        "ug",
        "mg",
        "deg/h",
        "percent",
        "day",
        "s",
        "ns",
        "MHz",
        "dimensionless",
        "deg/day",
        "mGal/m",
        "s/day",
      ],
    });
    for (const unitName of ["cm", "mm", "rad", "deg/century", "Hz", "kg"]) {
      assert.equal(formatRules.vocabularies.unit.includes(unitName), false);
    }
  });

  it("marks the numeric columns and the required columns", () => {
    for (const column of formatRules.columns) {
      assert.equal(typeof column.numeric, "boolean");
      assert.equal(typeof column.required, "boolean");
    }
    assert.deepEqual(
      formatRules.columns.filter((column) => column.numeric).map((column) => column.name),
      ["value", "uncertainty", "averaging_time"],
    );
    assert.deepEqual(
      formatRules.columns.filter((column) => column.required).map((column) => column.name),
      columnNames,
    );
    assert.deepEqual(
      formatRules.columns.filter((column) => column.identifier).map((column) => column.name),
      ["value_id"],
    );
    const averagingTime = formatRules.columns.find((column) => column.name === "averaging_time");
    assert.equal(averagingTime.unitText, "s");
    const frameStatus = formatRules.columns.find((column) => column.name === "frame_status");
    assert.equal(
      frameStatus.ruleText,
      "When the source gives no frame and the author names one, the row uses that frame and frame_status inferred.",
    );
    assert.ok(formatRules.vocabularies.frame.includes("principal_axes_unknown_realization"));
    const statistic = formatRules.columns.find((column) => column.name === "statistic");
    assert.equal(
      statistic.ruleText,
      "Store the statistic as the source gives it. Do not convert the statistic in the file.",
    );
    const unit = formatRules.columns.find((column) => column.name === "unit");
    assert.equal(
      unit.ruleText,
      "A pure unit conversion is allowed. Keep the source wording and the source unit in conditions.",
    );
    const frame = formatRules.columns.find((column) => column.name === "frame");
    assert.equal(
      frame.ruleText,
      "A row with frame iau_moon_approximate_mean_earth is context only. It is never a map tie. A later INPOP version has its own frame name and its version number. For a transform, this cell is the from frame. The conditions cell names the to frame, the rotation direction, and the axis order.",
    );
  });
});

describe("values table check", () => {
  it("accepts the small valid file", () => {
    const tableText = readFixture("valid-values.csv");
    const parsed = parseCommaSeparatedValues(tableText);
    assert.deepEqual(parsed.findings, []);
    assert.equal(parsed.records.length, 17);
    const headerNames = parsed.records[0].cells;
    assert.deepEqual(headerNames, columnNames);
    for (const record of parsed.records) {
      assert.equal(record.cells.length, columnNames.length);
    }
    assert.equal(cellByName(parsed.records[1], headerNames, "uncertainty"), "");
    assert.equal(cellByName(parsed.records[1], headerNames, "averaging_time"), "");
    assert.equal(
      cellByName(parsed.records[1], headerNames, "conditions"),
      'radius with a comma, and a quote "mark"',
    );
    assert.equal(cellByName(parsed.records[2], headerNames, "statistic"), "rms");
    assert.equal(cellByName(parsed.records[2], headerNames, "unit"), "mGal");
    assert.equal(cellByName(parsed.records[3], headerNames, "statistic"), "scaled_formal");
    assert.equal(cellByName(parsed.records[3], headerNames, "unit"), "km^3/s^2");
    assert.equal(cellByName(parsed.records[4], headerNames, "statistic"), "typical");
    assert.equal(cellByName(parsed.records[4], headerNames, "unit"), "deg/day");
    assert.equal(cellByName(parsed.records[5], headerNames, "statistic"), "maximum");
    assert.equal(cellByName(parsed.records[5], headerNames, "unit"), "mGal/m");
    assert.equal(cellByName(parsed.records[5], headerNames, "value"), "3");
    assert.equal(cellByName(parsed.records[6], headerNames, "frame"), "principal_axes_unknown_realization");
    assert.equal(cellByName(parsed.records[6], headerNames, "frame_status"), "inferred");
    assert.equal(cellByName(parsed.records[7], headerNames, "value_type"), "specification");
    assert.equal(cellByName(parsed.records[7], headerNames, "statistic"), "three_sigma");
    assert.equal(cellByName(parsed.records[8], headerNames, "statistic"), "mean");
    assert.equal(cellByName(parsed.records[8], headerNames, "unit"), "m");
    assert.equal(cellByName(parsed.records[9], headerNames, "statistic"), "median");
    assert.equal(cellByName(parsed.records[10], headerNames, "statistic"), "percentile_95");
    assert.equal(cellByName(parsed.records[11], headerNames, "statistic"), "peak_to_peak");
    assert.equal(cellByName(parsed.records[12], headerNames, "statistic"), "linear_error_90_percent");
    assert.equal(cellByName(parsed.records[13], headerNames, "statistic"), "circular_error_90_percent");
    assert.equal(cellByName(parsed.records[14], headerNames, "unit"), "s/day");
    assert.equal(cellByName(parsed.records[14], headerNames, "statistic"), "range_minimum");
    assert.equal(cellByName(parsed.records[15], headerNames, "frame"), "principal_axes_inpop19a");
    assert.equal(cellByName(parsed.records[15], headerNames, "frame_status"), "sourced");
    assert.equal(cellByName(parsed.records[16], headerNames, "frame"), "iau_moon_approximate_mean_earth");
    assert.equal(cellByName(parsed.records[16], headerNames, "frame_status"), "sourced");
    assert.deepEqual(validateValuesText(tableText, formatRules), []);
  });

  it("rejects an unknown column", () => {
    const findings = validateValuesText(readFixture("unknown-column.csv"), formatRules);
    assert.equal(findings.length, 1);
    assertFinding(findings[0], {
      rowNumber: 1,
      columnName: "confidence",
      cellValue: "confidence",
      reason: "Unknown column.",
    });
  });

  it("rejects a missing column", () => {
    const findings = validateValuesText(readFixture("missing-column.csv"), formatRules);
    assert.equal(findings.length, 1);
    assertFinding(findings[0], {
      rowNumber: 1,
      columnName: "frame",
      cellValue: "",
      reason: "Missing column.",
    });
  });

  it("rejects a value outside a fixed vocabulary", () => {
    const findings = validateValuesText(readFixture("value-outside-vocabulary.csv"), formatRules);
    assert.equal(findings.length, 1);
    assertFinding(findings[0], {
      rowNumber: 2,
      columnName: "statistic",
      cellValue: "sigma",
      reason: "This value is outside the fixed vocabulary.",
    });
  });

  it("rejects an empty vocabulary cell", () => {
    const tableText = readFixture("valid-values.csv").replace("one_sigma", "");
    const findings = validateValuesText(tableText, formatRules);
    assert.equal(findings.length, 1);
    assertFinding(findings[0], {
      rowNumber: 2,
      columnName: "statistic",
      cellValue: "",
      reason: "This value is outside the fixed vocabulary.",
    });
  });

  it("rejects an unknown unit", () => {
    const findings = validateValuesText(readFixture("unknown-unit.csv"), formatRules);
    assert.equal(findings.length, 1);
    assertFinding(findings[0], {
      rowNumber: 2,
      columnName: "unit",
      cellValue: "furlong",
      reason: "Unknown unit.",
    });
  });

  it("rejects a unit that version 2 leaves out", () => {
    const fixtureText = readFixture("unit-left-out-of-version-2.csv");
    for (const unitName of ["Hz", "kg", "cm", "mm", "rad", "deg/century"]) {
      const findings = validateValuesText(fixtureText.replace("Hz", unitName), formatRules);
      assert.equal(findings.length, 1);
      assertFinding(findings[0], {
        rowNumber: 2,
        columnName: "unit",
        cellValue: unitName,
        reason: "Unknown unit.",
      });
    }
  });

  it("rejects text in a numeric cell", () => {
    const findings = validateValuesText(readFixture("text-in-numeric-cell.csv"), formatRules);
    assert.deepEqual(
      findings.map((finding) => [finding.rowNumber, finding.columnName, finding.cellValue]),
      [
        [2, "value", "TBD"],
        [3, "uncertainty", "NaN"],
        [4, "averaging_time", "~45"],
      ],
    );
    for (const finding of findings) {
      assertFinding(finding, {
        rowNumber: finding.rowNumber,
        columnName: finding.columnName,
        cellValue: finding.cellValue,
        reason: "This cell must hold a number or be empty.",
      });
    }
  });

  it("rejects a duplicate value identifier", () => {
    const findings = validateValuesText(readFixture("duplicate-value-identifier.csv"), formatRules);
    assert.equal(findings.length, 1);
    assertFinding(findings[0], {
      rowNumber: 3,
      columnName: "value_id",
      cellValue: "example-radius",
      reason: "This identifier is a duplicate.",
    });
    assert.ok(findings[0].message.includes("row 2"));
  });

  it("checks a table from any path", () => {
    assert.deepEqual(validateValuesFile(fixturePath("valid-values.csv")), []);
    const findings = validateValuesFile(fixturePath("unknown-unit.csv"));
    assert.equal(findings.length, 1);
    assertFinding(findings[0], {
      rowNumber: 2,
      columnName: "unit",
      cellValue: "furlong",
      reason: "Unknown unit.",
    });
  });

  it("reads the column rules from the rules object", () => {
    const rules = smallFormatRules();
    assert.deepEqual(validateValuesText("value_id,value,unit\nonly,,m\n", rules), []);
    assert.deepEqual(validateValuesText("value_id,value,unit\nonly,0,m\n", rules), []);
    assert.deepEqual(validateValuesText("value_id,value,unit\nonly,1e-3,m\n", rules), []);
    assert.deepEqual(validateValuesText("value_id,value,unit\nonly,+45,m\n", rules), []);
    assert.deepEqual(validateValuesText("unit,value,value_id\nm,1,only\n", rules), []);

    for (const cellValue of ["TBD", "NaN", "nan", "~45", "Infinity"]) {
      const findings = validateValuesText(`value_id,value,unit\nonly,${cellValue},m\n`, rules);
      assert.equal(findings.length, 1);
      assert.equal(findings[0].columnName, "value");
      assert.equal(findings[0].cellValue, cellValue);
      assert.ok(findings[0].message.includes("This cell must hold a number or be empty."));
    }

    const unknownUnit = validateValuesText("value_id,value,unit\nonly,1,km\n", rules);
    assert.equal(unknownUnit.length, 1);
    assert.equal(unknownUnit[0].columnName, "unit");
    assert.equal(unknownUnit[0].cellValue, "km");
    assert.ok(unknownUnit[0].message.includes("Unknown unit."));

    const shortRow = validateValuesText("value_id,value,unit\nonly,1\n", rules);
    assert.equal(shortRow.length, 1);
    assertFinding(shortRow[0], {
      rowNumber: 2,
      columnName: "cell count",
      cellValue: "2",
      reason: "The row must have 3 cells.",
    });

    const emptyIdentifier = validateValuesText("value_id,value,unit\n,,m\n", rules);
    assert.equal(emptyIdentifier.length, 1);
    assertFinding(emptyIdentifier[0], {
      rowNumber: 2,
      columnName: "value_id",
      cellValue: "",
      reason: "This identifier is empty.",
    });

    const wrongVersion = smallFormatRules();
    wrongVersion.formatVersion = 1;
    const versionFindings = validateValuesText("value_id,value,unit\nonly,1,m\n", wrongVersion);
    assertFinding(versionFindings[0], {
      rowNumber: 1,
      columnName: "formatVersion",
      cellValue: "1",
      reason: "The format version must be 2.",
    });
  });

  it("keeps the vocabulary lists and the product path out of the program", () => {
    const programPath = fileURLToPath(new URL("../src/values-format.mjs", import.meta.url));
    const programText = readFileSync(programPath, "utf8");
    assert.equal(programText.includes("one_sigma"), false);
    assert.equal(programText.includes("mean_earth_de440"), false);
    assert.equal(programText.includes("uGal"), false);
    assert.equal(programText.includes("value_id"), false);
    const productPath = ["docs", "sources", "values.csv"].join("/");
    assert.equal(programText.includes(productPath), false);
  });
});
