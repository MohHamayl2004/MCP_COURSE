import type { McpServer } from "@modelcontextprotocol/server";

import { getTopExpensesInputSchema } from "../schemas/get-top-expenses.js";
import { loadExpenses, topExpenses } from "../lib/expenses.js";
import { logFailure } from "../lib/csv.js";

/** Return the largest expense records, optionally limited to one month (P1). */
export function registerGetTopExpensesTool(server: McpServer): void {
  server.registerTool(
    "get_top_expenses",
    {
      title: "Get top expenses",
      description:
        "Return the largest expenses, optionally limited to a single month.",
      inputSchema: getTopExpensesInputSchema,
    },
    async ({ month, limit }) => {
      try {
        const { items, skippedRows } = loadExpenses("get_top_expenses");
        const rows = topExpenses(items, { month, limit });

        if (rows.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: month
                  ? `No expenses recorded for ${month}.`
                  : "No expenses recorded yet.",
              },
            ],
          };
        }

        const payload = {
          items: rows.map(({ id, date, amount, category, note }) => ({
            id,
            date,
            amount,
            category,
            note,
          })),
          count: rows.length,
          skippedRows,
        };

        return {
          content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        };
      } catch (error) {
        logFailure(
          "get_top_expenses",
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
