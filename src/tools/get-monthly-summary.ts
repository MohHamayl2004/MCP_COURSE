import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { getMonthlySummaryInputSchema } from "../schemas/get-monthly-summary.js";

/**
 * Registers the get_monthly_summary tool.
 * CSV reading and summary calculation will be implemented later.
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
      return {
        content: [
          {
            type: "text",
            text:
              `Monthly summary for ${month}\n\n` +
              "🚧 This tool is registered successfully.\n" +
              "CSV reading and summary calculation will be implemented in the next step.",
          },
        ],
      };
    }
  );
}