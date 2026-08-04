import { readFileSync } from "node:fs";
import path from "node:path";
import type { McpServer } from "@modelcontextprotocol/server";

import { getTopExpensesInputSchema } from "../schemas/get-top-expenses.js";

type Expense = {
  id: string;
  date: string;
  amount: number;
  category: string;
  note: string;
};

function readExpensesFromCsv(): Expense[] {
  const filePath = path.resolve(process.cwd(), "data", "expenses.csv");

  let content: string;
  try {
    content = readFileSync(filePath, "utf8");
  } catch {
    return [];
  }

  return content
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const [id, date, amount, category, note] = line.split(",");
      return {
        id,
        date,
        amount: Number(amount),
        category,
        note,
      };
    });
}

/** Return the largest expense records, optionally limited to one month. */
export function registerGetTopExpensesTool(server: McpServer): void {
  server.registerTool(
    "get_top_expenses",
    {
      title: "Get top expenses",
      description: "[P1 — not implemented] List all spending categories seen in the expenses.",
      inputSchema: getTopExpensesInputSchema,
    },
    async ({ month, limit }) => {
      const topExpenses = readExpensesFromCsv()
        .filter((expense) => !month || expense.date.startsWith(month))
        .sort((first, second) => second.amount - first.amount)
        .slice(0, limit)
        .map(({ id, amount, category, note }) => ({
          id,
          amount,
          category,
          note,
        }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(topExpenses, null, 2),
          },
        ],
      };
    },
  );
}