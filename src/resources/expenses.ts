import fs from "node:fs";

import { McpServer } from "@modelcontextprotocol/server";

import { resolveDataPath } from "../lib/paths.js";
import { loadExpenses } from "../lib/expenses.js";

// Read-only context the model can pull without calling a tool. 
export function registerExpenseResources(server: McpServer): void {
  server.registerResource(
    "expenses-fixture",
    "expenses://fixture",
    {
      title: "Expenses CSV",
      description: "Raw contents of data/expenses.csv",
      mimeType: "text/csv",
    },
    async (uri) => {
      const file = resolveDataPath("expenses.csv");
      const text = fs.existsSync(file)
        ? fs.readFileSync(file, "utf8")
        : "id,date,amount,category,note\n";

      return {
        contents: [{ uri: uri.href, mimeType: "text/csv", text }],
      };
    },
  );

  server.registerResource(
    "expense-categories",
    "expenses://categories",
    {
      title: "Expense categories",
      description: "Every category currently used in the expense data",
      mimeType: "application/json",
    },
    async (uri) => {
      const { items } = loadExpenses("expenses://categories");
      const categories = [...new Set(items.map((e) => e.category))].sort();

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ categories }, null, 2),
          },
        ],
      };
    },
  );
}