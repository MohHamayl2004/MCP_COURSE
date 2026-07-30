import { readFileSync } from "node:fs";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { getMonthlySummaryInputSchema } from "../schemas/get-sumary.js";

type Expense = {
  id: string;
  date: string;
  amount: number;
  category: string;
  note: string;
};

function readExpensesFromCsv(): Expense[] {
  const filePath = path.resolve(process.cwd(), "expenses.csv");
  const content = readFileSync(filePath, "utf8");

  return content
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line: string) => {
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

/** Summarize total spending and category breakdown for a month. */
export function registerGetMonthlySummaryTool(server: McpServer): void {
  server.registerTool(
    "get_monthly_summary",
    {
      title: "Get monthly summary",
      description: "Calculate the total spending and per-category breakdown for a month.",
      inputSchema: getMonthlySummaryInputSchema,
    },
    async ({ month }: { month: string }) => {
      const expenses = readExpensesFromCsv();
      const filteredExpenses = expenses.filter((expense) => expense.date.startsWith(month));

      const byCategory = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
        const category = expense.category.trim() || "other";
        acc[category] = (acc[category] || 0) + expense.amount;
        return acc;
      }, {});

      const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ month, total, byCategory }, null, 2),
          },
        ],
      };
    },
  );
}
