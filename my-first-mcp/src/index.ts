import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerGetMonthlySummaryTool } from "./tools/get-monthly-summary.js";
import { registerDeleteExpenseTool } from "./tools/delete-expense.js";

void serveStdio(() => {
  const server = new McpServer({
    name: "my-first-mcp",
    version: "0.1.0",
  });

  registerGetMonthlySummaryTool(server);
  registerDeleteExpenseTool(server);

  return server;
});

console.error("expense-tracker-mcp MCP server running on stdio");

