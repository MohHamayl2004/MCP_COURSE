import assert from "node:assert/strict";
import { test, describe } from "node:test";

import { filterExpenses, summarizeMonth, nextId, cap } from "./expenses.js";
import type { ExpenseRow } from "../schemas/expense-row.js";

const rows: ExpenseRow[] = [
  { id: "exp_001", date: "2026-07-02", amount: 15, category: "food", note: "Lunch" },
  { id: "exp_002", date: "2026-07-03", amount: 40, category: "transport", note: "Gas" },
  { id: "exp_003", date: "2026-07-05", amount: 120, category: "food", note: "Groceries" },
  { id: "exp_004", date: "2026-08-01", amount: 10, category: "other", note: "Pens" },
];

describe("filterExpenses", () => {
  test("returns everything when no filter is given", () => {
    assert.equal(filterExpenses(rows, {}).length, 4);
  });

  test("filters by month", () => {
    assert.equal(filterExpenses(rows, { month: "2026-07" }).length, 3);
  });

  test("filters by category", () => {
    assert.equal(filterExpenses(rows, { category: "food" }).length, 2);
  });

  test("matches category case-insensitively", () => {
    assert.equal(filterExpenses(rows, { category: "FOOD" }).length, 2);
  });

  test("combines month and category", () => {
    const result = filterExpenses(rows, { month: "2026-07", category: "food" });
    assert.deepEqual(result.map((e) => e.id), ["exp_001", "exp_003"]);
  });

  test("returns an empty array when nothing matches", () => {
    assert.deepEqual(filterExpenses(rows, { month: "2026-01" }), []);
  });
});

describe("summarizeMonth", () => {
  test("totals one month and breaks it down by category", () => {
    const summary = summarizeMonth(rows, "2026-07");
    assert.equal(summary.total, 175);
    assert.equal(summary.count, 3);
    assert.deepEqual(summary.byCategory, { food: 135, transport: 40 });
  });

  test("a month with no expenses is zero, not an error", () => {
    const summary = summarizeMonth(rows, "2026-01");
    assert.equal(summary.total, 0);
    assert.equal(summary.count, 0);
    assert.deepEqual(summary.byCategory, {});
  });
});

describe("nextId", () => {
  test("continues the sequence", () => {
    assert.equal(nextId(rows), "exp_005");
  });

  test("starts at exp_001 when there is no data", () => {
    assert.equal(nextId([]), "exp_001");
  });

  test("ignores malformed ids instead of producing scientific notation", () => {
    const messy: ExpenseRow[] = [
      ...rows,
      { id: "7a35164f-b4ef-4633-867e", date: "2026-08-01", amount: 5, category: "food", note: "" },
    ];
    assert.equal(nextId(messy), "exp_005");
  });
});

describe("cap", () => {
  test("returns everything when under the limit", () => {
    const result = cap(rows, 10);
    assert.equal(result.items.length, 4);
    assert.equal(result.truncated, 0);
  });

  test("truncates and reports how many were hidden", () => {
    const result = cap(rows, 2);
    assert.equal(result.items.length, 2);
    assert.equal(result.truncated, 2);
  });
});
