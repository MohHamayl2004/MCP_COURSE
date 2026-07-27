import { readFileSync } from "node:fs";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { listExpensesInputSchema } from "../schemas/list-expenses.js";

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

/** List available expense records the model can inspect. */
export function registerListExpensesTool(server: McpServer): void {
  server.registerTool(
    "list_expenses",
    {
      title: "List expenses",
      description: "List expense records, optionally filtered by category or month.",
      inputSchema: listExpensesInputSchema,
    },
    async ({ month, category }: { month?: string; category?: string }) => {
      const expenses = readExpensesFromCsv();
      const filteredExpenses = expenses.filter((expense) => {
        const matchesMonth = !month || expense.date.startsWith(month);
        const matchesCategory = !category || expense.category.toLowerCase() === category.toLowerCase();
        return matchesMonth && matchesCategory;
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(filteredExpenses, null, 2),
          },
        ],
      };
    },
  );
}
