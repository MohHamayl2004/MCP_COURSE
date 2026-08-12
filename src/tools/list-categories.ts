import { McpServer } from "@modelcontextprotocol/server";

import { listCategoriesInputSchema } from "../schemas/list-categories.js";
import { loadExpenses } from "../lib/expenses.js";
import { logFailure } from "../lib/csv.js";

/** List every category present in the expense data (P1). */
export function registerListCategoriesTool(server: McpServer): void {
  server.registerTool(
    "list_categories",
    {
      description:
        "List all spending categories that appear in the saved expenses, optionally for one month.",
      inputSchema: listCategoriesInputSchema,
    },
    async ({ month }) => {
      try {
        const { items } = loadExpenses("list_categories");
        const scoped = month
          ? items.filter((e) => e.date.startsWith(month))
          : items;
        const categories = [...new Set(scoped.map((e) => e.category))].sort();

        if (categories.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: month
                  ? `No categories found for ${month}.`
                  : "No categories found.",
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ categories, count: categories.length }, null, 2),
            },
          ],
        };
      } catch (error) {
        logFailure(
          "list_categories",
          error instanceof Error ? error.message : String(error),
        );
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Could not read the expense data. The file may be missing or unreadable.",
            },
          ],
        };
      }
    },
  );
}