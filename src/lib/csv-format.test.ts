import assert from "node:assert/strict";
import { test, describe } from "node:test";

import { toCsvValue, parseCsvLine } from "./csv-format.js";

describe("toCsvValue", () => {
  test("leaves a plain value untouched", () => {
    assert.equal(toCsvValue("food"), "food");
  });

  test("quotes a value containing a comma", () => {
    assert.equal(toCsvValue("Lunch, coffee"), '"Lunch, coffee"');
  });

  test("quotes and doubles inner quotes", () => {
    assert.equal(toCsvValue('a "large" tea'), '"a ""large"" tea"');
  });

  test("quotes a value containing a newline", () => {
    assert.equal(toCsvValue("line one\nline two"), '"line one\nline two"');
  });

  test("leaves an empty value empty", () => {
    assert.equal(toCsvValue(""), "");
  });
});

describe("parseCsvLine", () => {
  test("splits a simple row", () => {
    assert.deepEqual(
      parseCsvLine("exp_001,2026-07-02,15.00,food,Lunch"),
      ["exp_001", "2026-07-02", "15.00", "food", "Lunch"],
    );
  });

  test("keeps commas inside a quoted field", () => {
    assert.deepEqual(
      parseCsvLine('exp_002,2026-07-03,40.00,food,"Lunch, coffee"'),
      ["exp_002", "2026-07-03", "40.00", "food", "Lunch, coffee"],
    );
  });

  test("unescapes doubled quotes", () => {
    assert.deepEqual(
      parseCsvLine('exp_003,2026-07-05,25.00,food,"a ""large"" tea"'),
      ["exp_003", "2026-07-05", "25.00", "food", 'a "large" tea'],
    );
  });

  test("returns an empty string for a trailing empty field", () => {
    const fields = parseCsvLine("exp_004,2026-07-09,10.00,food,");
    assert.equal(fields.length, 5);
    assert.equal(fields[4], "");
  });
});

describe("round trip", () => {
  test("a note with a comma and quotes survives write then read", () => {
    const note = 'Lunch, coffee and a "large" tea';
    const line = ["exp_009", "2026-08-12", "25.00", "food", note]
      .map(toCsvValue)
      .join(",");

    assert.equal(parseCsvLine(line)[4], note);
  });
});
