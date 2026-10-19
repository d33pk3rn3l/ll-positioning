/**
 * Check a values table against format version 2.
 * The column lists live in the rules file.
 * This module does not hold science values.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const decimalNumberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

/**
 * Return true when the cell text is a decimal number.
 * An exponent is allowed.
 * The text "NaN" and the text "Infinity" are not numbers here.
 */
function isNumberCell(cellValue) {
  return decimalNumberPattern.test(cellValue);
}

function makeFinding(rowNumber, columnName, cellValue, reason) {
  const shownValue = String(cellValue);
  return {
    rowNumber,
    columnName,
    cellValue: shownValue,
    message: `Row ${rowNumber}, column ${columnName}, value "${shownValue}": ${reason}`,
  };
}

/**
 * Read comma-separated values text.
 * The rules are RFC 4180 (Request for Comments 4180).
 * A quoted field can contain a comma or a line break.
 * A quote inside a quoted field is two quote characters.
 * Return the records and any findings.
 */
export function parseCommaSeparatedValues(tableText) {
  const findings = [];
  const records = [];
  const sourceText = tableText.startsWith("\uFEFF") ? tableText.slice(1) : tableText;
  const cells = [];
  let fieldText = "";
  let insideQuotes = false;
  let quoteClosed = false;
  let lineNumber = 1;
  let recordLineNumber = 1;
  let index = 0;

  function columnNameForField(fieldIndex) {
    const headerRecord = records[0];
    if (headerRecord && fieldIndex < headerRecord.cells.length && headerRecord.cells[fieldIndex] !== "") {
      return headerRecord.cells[fieldIndex];
    }
    return `field ${fieldIndex + 1}`;
  }

  function pushRecord() {
    cells.push(fieldText);
    records.push({ lineNumber: recordLineNumber, cells: cells.slice() });
    cells.length = 0;
    fieldText = "";
    quoteClosed = false;
  }

  function stop(reason) {
    findings.push(makeFinding(
      recordLineNumber,
      columnNameForField(cells.length),
      fieldText,
      reason,
    ));
    return { records, findings };
  }

  while (index < sourceText.length) {
    const character = sourceText[index];

    if (insideQuotes) {
      if (character === '"') {
        if (sourceText[index + 1] === '"') {
          fieldText += '"';
          index += 2;
          continue;
        }
        insideQuotes = false;
        quoteClosed = true;
        index += 1;
        continue;
      }
      if (character === "\r") {
        fieldText += "\r";
        index += 1;
        if (sourceText[index] === "\n") {
          fieldText += "\n";
          index += 1;
        }
        lineNumber += 1;
        continue;
      }
      if (character === "\n") {
        fieldText += "\n";
        lineNumber += 1;
        index += 1;
        continue;
      }
      fieldText += character;
      index += 1;
      continue;
    }

    if (character === '"') {
      if (fieldText.length > 0 || quoteClosed) {
        return stop("A quote is in the wrong place.");
      }
      insideQuotes = true;
      index += 1;
      continue;
    }

    if (character === ",") {
      cells.push(fieldText);
      fieldText = "";
      quoteClosed = false;
      index += 1;
      continue;
    }

    if (character === "\n" || character === "\r") {
      if (character === "\r" && sourceText[index + 1] === "\n") {
        index += 2;
      } else {
        index += 1;
      }
      pushRecord();
      lineNumber += 1;
      recordLineNumber = lineNumber;
      continue;
    }

    if (quoteClosed) {
      return stop("Text follows the end quote.");
    }

    fieldText += character;
    index += 1;
  }

  if (insideQuotes) {
    return stop("A quoted field is not closed.");
  }

  if (fieldText.length > 0 || cells.length > 0 || quoteClosed) {
    pushRecord();
  }

  return { records, findings };
}

function checkFormatRules(formatRules) {
  if (!formatRules || formatRules.formatVersion !== 2) {
    const shownVersion = formatRules && formatRules.formatVersion !== undefined
      ? String(formatRules.formatVersion)
      : "";
    return [makeFinding(1, "formatVersion", shownVersion, "The format version must be 2.")];
  }
  if (!Array.isArray(formatRules.columns)) {
    return [makeFinding(1, "columns", "", "The format rules must list the columns.")];
  }
  if (!formatRules.vocabularies || typeof formatRules.vocabularies !== "object") {
    return [makeFinding(1, "vocabularies", "", "The format rules must list the vocabularies.")];
  }
  return [];
}

/**
 * Check the header row.
 * Each required column must appear once.
 * A name that is not in the rules is an unknown column.
 */
function checkHeader(headerRecord, formatRules) {
  const findings = [];
  const seenNames = new Set();
  const knownNames = new Set(formatRules.columns.map((column) => column.name));

  headerRecord.cells.forEach((columnName, fieldIndex) => {
    if (columnName === "") {
      findings.push(makeFinding(
        headerRecord.lineNumber,
        `field ${fieldIndex + 1}`,
        "",
        "Unknown column.",
      ));
      return;
    }
    if (seenNames.has(columnName)) {
      findings.push(makeFinding(
        headerRecord.lineNumber,
        columnName,
        columnName,
        "Duplicate column.",
      ));
      return;
    }
    seenNames.add(columnName);
    if (!knownNames.has(columnName)) {
      findings.push(makeFinding(
        headerRecord.lineNumber,
        columnName,
        columnName,
        "Unknown column.",
      ));
    }
  });

  for (const column of formatRules.columns) {
    if (column.required === true && !seenNames.has(column.name)) {
      findings.push(makeFinding(
        headerRecord.lineNumber,
        column.name,
        "",
        "Missing column.",
      ));
    }
  }

  return findings;
}

function vocabularyReason(vocabularyName) {
  if (vocabularyName === "unit") {
    return "Unknown unit.";
  }
  return "This value is outside the fixed vocabulary.";
}

function checkDataRecords(dataRecords, headerNames, formatRules) {
  const findings = [];
  const indexByName = new Map();
  headerNames.forEach((columnName, fieldIndex) => {
    indexByName.set(columnName, fieldIndex);
  });

  const identifierColumns = formatRules.columns.filter((column) => column.identifier === true);
  const firstLineByColumn = new Map();

  function firstLineNumber(columnName, cellValue) {
    const linesByValue = firstLineByColumn.get(columnName);
    if (!linesByValue) {
      return undefined;
    }
    return linesByValue.get(cellValue);
  }

  function rememberLine(columnName, cellValue, lineNumber) {
    let linesByValue = firstLineByColumn.get(columnName);
    if (!linesByValue) {
      linesByValue = new Map();
      firstLineByColumn.set(columnName, linesByValue);
    }
    linesByValue.set(cellValue, lineNumber);
  }

  for (const record of dataRecords) {
    if (record.cells.length !== headerNames.length) {
      findings.push(makeFinding(
        record.lineNumber,
        "cell count",
        String(record.cells.length),
        `The row must have ${headerNames.length} cells.`,
      ));
      continue;
    }

    for (const column of identifierColumns) {
      const fieldIndex = indexByName.get(column.name);
      if (fieldIndex === undefined) {
        continue;
      }
      const cellValue = record.cells[fieldIndex];
      if (cellValue === "") {
        findings.push(makeFinding(
          record.lineNumber,
          column.name,
          cellValue,
          "This identifier is empty.",
        ));
        continue;
      }
      const earlierLineNumber = firstLineNumber(column.name, cellValue);
      if (earlierLineNumber !== undefined) {
        findings.push(makeFinding(
          record.lineNumber,
          column.name,
          cellValue,
          `This identifier is a duplicate. The first use is on row ${earlierLineNumber}.`,
        ));
        continue;
      }
      rememberLine(column.name, cellValue, record.lineNumber);
    }

    for (const column of formatRules.columns) {
      const fieldIndex = indexByName.get(column.name);
      if (fieldIndex === undefined) {
        continue;
      }
      const cellValue = record.cells[fieldIndex];
      if (column.numeric === true) {
        if (cellValue !== "" && !isNumberCell(cellValue)) {
          findings.push(makeFinding(
            record.lineNumber,
            column.name,
            cellValue,
            "This cell must hold a number or be empty.",
          ));
        }
        continue;
      }
      if (typeof column.vocabulary !== "string") {
        continue;
      }
      const allowedValues = Object.hasOwn(formatRules.vocabularies, column.vocabulary)
        ? formatRules.vocabularies[column.vocabulary]
        : undefined;
      if (!Array.isArray(allowedValues)) {
        findings.push(makeFinding(
          record.lineNumber,
          column.name,
          cellValue,
          "The format rules do not list this vocabulary.",
        ));
        continue;
      }
      if (!allowedValues.includes(cellValue)) {
        findings.push(makeFinding(
          record.lineNumber,
          column.name,
          cellValue,
          vocabularyReason(column.vocabulary),
        ));
      }
    }
  }

  return findings;
}

/**
 * Check one table text against the format rules.
 * This function does not read a file.
 * An empty numeric cell is valid.
 * Empty means that the source does not state the number.
 * Return a list of findings. An empty list means the table is valid.
 */
export function validateValuesText(tableText, formatRules) {
  const ruleFindings = checkFormatRules(formatRules);
  if (ruleFindings.length > 0) {
    return ruleFindings;
  }

  const parsed = parseCommaSeparatedValues(tableText);
  if (parsed.findings.length > 0) {
    return parsed.findings;
  }
  if (parsed.records.length === 0) {
    return formatRules.columns
      .filter((column) => column.required === true)
      .map((column) => makeFinding(1, column.name, "", "Missing column."));
  }

  const headerRecord = parsed.records[0];
  const headerFindings = checkHeader(headerRecord, formatRules);
  if (headerFindings.length > 0) {
    return headerFindings;
  }

  return checkDataRecords(parsed.records.slice(1), headerRecord.cells, formatRules);
}

function loadDefaultFormatRules() {
  const schemaPath = fileURLToPath(new URL("../tests/values-schema.json", import.meta.url));
  return JSON.parse(readFileSync(schemaPath, "utf8"));
}

/**
 * Read a values table from a path and check it.
 * The path can be any file.
 * This function does not select the product source table.
 * When the caller does not pass rules, the function reads tests/values-schema.json.
 */
export function validateValuesFile(filePath, formatRules = loadDefaultFormatRules()) {
  const tableText = readFileSync(filePath, "utf8");
  return validateValuesText(tableText, formatRules);
}
