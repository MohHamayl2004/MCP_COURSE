import { McpServer } from "@modelcontextprotocol/server";

import { getSpendingSummaryInputSchema } from "../schemas/get-spending-summary.js";
import { loadExpenses, summarizeMonth } from "../lib/expenses.js";
import { logFailure } from "../lib/csv.js";

/** Total and per-category spending for one month (P0). */
export function registerGetSpendingSummaryTool(server: McpServer): void {
  server.registerTool(
    "get_spending_summary",
    {
      description: "Total spending and a per-category breakdown for one month.",
      inputSchema: getSpendingSummaryInputSchema,
    },
    async ({ month }) => {
      try {
        const { items, skippedRows } = loadExpenses("get_spending_summary");
        const summary = summarizeMonth(items, month);

        if (summary.count === 0) {
          return {
            content: [
              { type: "text", text: `No expenses recorded for ${month}.` },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ...summary, skippedRows }, null, 2),
            },
          ],
        };
      } catch (error) {
        // Full detail to stderr for me; one short sentence for the model.
        logFailure(
          "get_spending_summary",
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