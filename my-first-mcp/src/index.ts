import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerListExpensesTool } from "./tools/list-expenses.js";

await serveStdio(() => {
  const server = new McpServer({ name: "my-first-mcp", version: "0.1.0" });
  registerListExpensesTool(server);
  return server;
});
