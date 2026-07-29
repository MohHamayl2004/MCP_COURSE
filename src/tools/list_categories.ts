import { McpServer } from "@modelcontextprotocol/server";

import { listCategoriesInputSchema } from "../schemas/list_categories.js";

/** Week 2 stub — list every category seen so far (P1). */
export function registerListCategoriesTool(server: McpServer): void {
  server.registerTool(
    "list_categories",
    {
      description:
        "List all spending categories that appear in the saved expenses.",
      inputSchema: listCategoriesInputSchema,
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "list_categories",
                categories: ["food", "transport", "other"],
                message:
                  "Replace this stub in Week 3 with distinct categories read from the CSV.",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}