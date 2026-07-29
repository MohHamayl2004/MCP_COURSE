import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerListExpensesTool } from "./tools/list-expenses.js";
import { registerListCategoriesTool } from "./tools/list-catigories.js";

await serveStdio(() => {
  const server = new McpServer({ name: "my-first-mcp", version: "0.1.0" });
  registerListExpensesTool(server);
  registerListCategoriesTool(server);
  return server;
});
