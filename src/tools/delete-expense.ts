import { McpServer } from "@modelcontextprotocol/server";

import { deleteExpenseInputSchema } from "../schemas/delete-expense.js";
import { deleteExpenseById } from "../lib/expenses.js";
import { logFailure } from "../lib/csv.js";

/** Delete a single expense by id (P1). */
export function registerDeleteExpenseTool(server: McpServer): void {
  server.registerTool(
    "delete_expense",
    {
      title: "Delete Expense",
      description: "Delete a single expense by its id, for example exp_003.",
      inputSchema: deleteExpenseInputSchema.shape,
    },
    async ({ id }) => {
      try {
        const result = deleteExpenseById("delete_expense", id);

        if (!result.deleted) {
          return {
            content: [{ type: "text", text: `No expense found with id ${id}.` }],
          };
        }

        const { expense } = result;
        return {
          content: [
            {
              type: "text",
              text: `Deleted ${id}: ${expense?.amount} on ${expense?.category} (${expense?.date}).`,
            },
          ],
        };
      } catch (error) {
        logFailure(
          "delete_expense",
          error instanceof Error ? error.message : String(error),
        );
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Could not delete the expense. The data file may be missing or locked.",
            },
          ],
        };
      }
    },
  );
}
