import { McpServer } from "@modelcontextprotocol/server";

import { listExpensesInputSchema } from "../schemas/list-expenses.js";
import { readExpenses } from "../lib/csv.js";

/** List expenses from the CSV fixture, optionally filtered (P0). */
export function registerListExpensesTool(server: McpServer): void {
  server.registerTool(
    "list_expenses",
    {
      description: "List expenses, optionally filtered by month or category.",
      inputSchema: listExpensesInputSchema,
    },
    async ({ month, category }) => {
      const { items, skippedRows } = readExpenses("list_expenses");

      const filtered = items.filter(
        (e) =>
          (!month || e.date.startsWith(month)) &&
          (!category || e.category.toLowerCase() === category.toLowerCase()),
      );

      const payload = {
        items: filtered,
        count: filtered.length,
        skippedRows,
        ...(filtered.length === 0 && { message: "No expenses matched." }),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      };
    },
  );
}