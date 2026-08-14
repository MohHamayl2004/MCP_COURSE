import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerAddExpenseTool } from "./tools/add_expense.js";
import { registerListExpensesTool } from "./tools/list-expenses.js";
import { registerGetSpendingSummaryTool } from "./tools/get-spending-summary.js";
import { registerListCategoriesTool } from "./tools/list-categories.js";
import { registerDeleteExpenseTool } from "./tools/delete-expense.js";
import { registerGetTopExpensesTool } from "./tools/get-top-expenses.js";
import { registerExpenseResources } from "./resources/expenses.js";

// Week 2: import and register your project tools here, for example:
// import { registerAddNoteTool } from "./tools/add-note.js";

/**
 * Factory used by stdio (and later HTTP) so every connection gets a fresh server.
 * Register all tools inside this function — never on a shared global instance.
 */
function createServer(): McpServer {
  const server = new McpServer({
    name: "mcprepo",
    version: "0.1.0",
  });

  // Week 1 — expense tracker P0 tools
  registerAddExpenseTool(server);
  registerListExpensesTool(server);
  registerGetSpendingSummaryTool(server);
  registerListCategoriesTool(server);
  registerDeleteExpenseTool(server);
  registerGetTopExpensesTool(server);
  registerExpenseResources(server);
  // Week 2 — register your multi-tool skeleton (stubs are OK)
  // registerAddNoteTool(server);

  return server;
}

void serveStdio(createServer);
console.error("mcprepo MCP server running on stdio");
