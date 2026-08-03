import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { getMonthlySummary } from "../lib/expenses.js";
import { getMonthlySummaryInputSchema } from "../schemas/get-monthly-summary.js";

/**
 * Registers the get_monthly_summary tool.
 * Returns a monthly summary using data from data/expenses.csv.
 */
export function registerGetMonthlySummaryTool(server: McpServer): void {
  server.registerTool(
    "get_monthly_summary",
    {
      title: "Get Monthly Summary",
      description:
        "Return a summary of expenses for a selected month.",
      inputSchema: getMonthlySummaryInputSchema,
    },
    async ({ month }) => {
      const result = await getMonthlySummary(month);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}