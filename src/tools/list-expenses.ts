import { McpServer } from "@modelcontextprotocol/server";

import { listExpensesInputSchema } from "../schemas/list-expenses.js";
import { loadExpenses, filterExpenses, cap } from "../lib/expenses.js";
import { logFailure } from "../lib/csv.js";

/** List expenses from the CSV fixture, optionally filtered (P0). */
export function registerListExpensesTool(server: McpServer): void {
  server.registerTool(
    "list_expenses",
    {
      description: "List expenses, optionally filtered by month or category.",
      inputSchema: listExpensesInputSchema,
    },
    async ({ month, category, limit }) => {
      try {
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
      } catch (error) {
        // Full detail to stderr for me; one short sentence for the model.
        logFailure(
          "list_expenses",
          error instanceof Error ? error.message : String(error),
        );
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Could not read the expense data. The file may be missing or unreadable.",
            },
          ],
        };
      }
    },
  );
}