import fs from "node:fs";

import { expenseRowSchema, type ExpenseRow } from "../schemas/expense-row.js";
import { resolveDataPath } from "./paths.js";
import { parseCsvLine } from "./csv-format.js";

export function logFailure(tool: string, reason: string): void {
  console.error(`[${tool}] ${reason}`);
}

export function readExpenses(tool: string): {
  items: ExpenseRow[];
  skippedRows: number;
  message?: string;
} {
  const file = resolveDataPath("expenses.csv");

  if (!fs.existsSync(file)) {
    logFailure(tool, "data/expenses.csv not found");
    return { items: [], skippedRows: 0, message: "No expenses recorded yet." };
  }

  const lines = fs.readFileSync(file, "utf8").trim().split(/\r?\n/);
  const [, ...dataLines] = lines;

  const items: ExpenseRow[] = [];
  let skippedRows = 0;

  for (const [index, line] of dataLines.entries()) {
    if (!line.trim()) continue;

    const [id, date, amount, category, note = ""] = parseCsvLine(line);
    const parsed = expenseRowSchema.safeParse({
      id, date, amount, category, note,
    });

    if (parsed.success) {
      items.push(parsed.data);
    } else {
      skippedRows += 1;
      logFailure(tool, `skipped invalid row at line ${index + 2}`);
    }
  }

  return {
    items,
    skippedRows,
    message: items.length === 0 ? "No expenses matched." : undefined,
  };
}