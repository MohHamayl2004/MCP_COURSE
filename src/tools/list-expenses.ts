import { McpServer } from "@modelcontextprotocol/server";

import { listExpensesInputSchema } from "../schemas/list-expenses.js";
import { loadExpenses, filterExpenses, cap } from "../lib/expenses.js";

/** List expenses from the CSV fixture, optionally filtered (P0). */
export function registerListExpensesTool(server: McpServer): void {
  server.registerTool(
    "list_expenses",
    {
      description: "List expenses, optionally filtered by month or category.",
      inputSchema: listExpensesInputSchema,
    },
    async ({ month, category, limit }) => {
      const { items, skippedRows } = loadExpenses("list_expenses");
      const { items: page, truncated } = cap(
        filterExpenses(items, { month, category }),
        limit,
      );

      if (page.length === 0) {
        return {
          content: [{ type: "text", text: "No expenses matched." }],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ items: page, truncated, skippedRows }, null, 2),
          },
        ],
      };
    },
  );
}