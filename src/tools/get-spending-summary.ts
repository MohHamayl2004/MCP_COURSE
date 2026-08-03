import { McpServer } from "@modelcontextprotocol/server";


import { getSpendingSummaryInputSchema } from "../schemas/get-spending-summary.js";
import { loadExpenses, summarizeMonth } from "../lib/expenses.js";

/** Total and per-category spending for one month (P0). */
export function registerGetSpendingSummaryTool(server: McpServer): void {
  server.registerTool(
    "get_spending_summary",
    {
      description: "Total spending and a per-category breakdown for one month.",
      inputSchema: getSpendingSummaryInputSchema,
    },
    async ({ month }) => {
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
    },
  );
}