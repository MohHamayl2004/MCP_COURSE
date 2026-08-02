import { McpServer } from "@modelcontextprotocol/server";


import { getMonthlySummaryInputSchema } from "../schemas/get-monthly-summary.js";
import { loadExpenses, summarizeMonth } from "../lib/expenses.js";

/** Total and per-category spending for one month (P0). */
export function registerGetMonthlySummaryTool(server: McpServer): void {
  server.registerTool(
    "get_monthly_summary",
    {
      description: "Total spending and a per-category breakdown for one month.",
      inputSchema: getMonthlySummaryInputSchema,
    },
    async ({ month }) => {
      const { items, skippedRows } = loadExpenses("get_monthly_summary");
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