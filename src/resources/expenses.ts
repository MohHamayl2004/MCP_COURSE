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
      const file = resolveDataPath("expenses.csv");
      if (!fs.existsSync(file)) {
        return { contents: [{ uri: uri.href, mimeType: "text/csv", text: "id,date,amount,category,note\n" }] };
      }

      const lines = fs.readFileSync(file, "utf8").trimEnd().split(/\r?\n/);
      const [header, ...rows] = lines;
      const MAX_ROWS = 50;
      const shown = rows.slice(0, MAX_ROWS);

      const text =
        [header, ...shown].join("\n") +
        (rows.length > MAX_ROWS
          ? `\n# truncated: showing ${MAX_ROWS} of ${rows.length} rows`
          : "");

      return { contents: [{ uri: uri.href, mimeType: "text/csv", text }] };
    },
  );
}