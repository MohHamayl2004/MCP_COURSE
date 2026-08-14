import fs from "node:fs";

import { readExpenses, logFailure } from "./csv.js";
import { resolveDataPath } from "./paths.js";
import type { ExpenseRow } from "../schemas/expense-row.js";
import { toCsvValue } from "./csv-format.js";

const MAX_ITEMS = 20;

// load every valid expense from csv file
export function loadExpenses(tool: string) {
  return readExpenses(tool);
}

// filter by month and/or category
export function filterExpenses(
  items: ExpenseRow[],
  { month, category }: { month?: string; category?: string },
): ExpenseRow[] {
  return items.filter(
    (e) =>
      (!month || e.date.startsWith(month)) &&
      (!category || e.category.toLowerCase() === category.toLowerCase()),
  );
}

// Total + per-category breakdown for one month
export function summarizeMonth(items: ExpenseRow[], month: string) {
  const rows = filterExpenses(items, { month });

  const byCategory: Record<string, number> = {};
  let total = 0;

  for (const row of rows) {
    total += row.amount;
    byCategory[row.category] = (byCategory[row.category] ?? 0) + row.amount;
  }

  return {
    month,
    total: Number(total.toFixed(2)),
    byCategory,
    count: rows.length,
  };
}

// Next sequential id
export function nextId(items: ExpenseRow[]): string {
  const highest = items.reduce((max, e) => {
    const match = /^exp_(\d+)$/.exec(e.id);
    if (!match) return max;                      // ignore malformed ids
    const n = Number(match[1]);
    return Number.isSafeInteger(n) && n > max ? n : max;
  }, 0);
  return `exp_${String(highest + 1).padStart(3, "0")}`;
}

// Append one expense to the CSV file , write to a temp file
export function appendExpense(
  tool: string,
  row: Omit<ExpenseRow, "id">,
): ExpenseRow {
  const file = resolveDataPath("expenses.csv");
  const header = "id,date,amount,category,note";

  const { items } = readExpenses(tool);
  const record: ExpenseRow = { id: nextId(items), ...row };

 const line = [
    record.id,
    record.date,
    record.amount.toFixed(2),
    record.category,
    record.note.replace(/[\r\n]+/g, " "),
  ].map(toCsvValue).join(",");

  const existing = fs.existsSync(file)
    ? fs.readFileSync(file, "utf8").trimEnd()
    : header;

  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${existing}\n${line}\n`, "utf8");
  fs.renameSync(temp, file);

  logFailure(tool, `appended ${record.id}`);
  return record;
}

// Cap a list so the model never gets a huge dump
export function cap<T>(items: T[], limit = MAX_ITEMS) {
  return {
    items: items.slice(0, limit),
    truncated: items.length > limit ? items.length - limit : 0,
  };
}