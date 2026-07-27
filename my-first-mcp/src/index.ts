



import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { registerGetMonthlySummaryTool } from "./tools/get-monthly-summary.js";

await serveStdio(() => {
  const server = new McpServer({ name: "my-first-mcp", version: "0.1.0" });
registerGetMonthlySummaryTool(server);
  return server;
});