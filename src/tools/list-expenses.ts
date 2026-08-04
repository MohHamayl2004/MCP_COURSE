import { McpServer } from "@modelcontextprotocol/server";
import { listExpensesInputSchema } from "../schemas/list-expenses.js";
import { listExpenses } from "../lib/expenses.js";

/** List available expense records the model can inspect. */
export function registerListExpensesTool(server: McpServer): void {
  server.registerTool(
    "list_expenses",
    {
      title: "List Expenses",
      description:
        "List expense records, optionally filtered by category or month.",
      inputSchema: listExpensesInputSchema.shape,
    },
    async ({ month, category }) => {
      try {
        const items = await listExpenses({
          month,
          category,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  items,
                  message:
                    items.length === 0
                      ? "No expenses matched the selected filters."
                      : `Found ${items.length} expense(s).`,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const reason =
          error instanceof Error ? error.message : "Unknown error";

        console.error(`[list_expenses] ${reason}`);

        return {
          content: [
            {
              type: "text",
              text: `Could not list expenses: ${reason}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}