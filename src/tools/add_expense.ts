import type { McpServer } from "@modelcontextprotocol/server";
import { addExpense } from "../lib/expenses.js";
import {
  addExpenseInputSchema,
  addExpenseOutputSchema,
} from "../schemas/add_expense.js";

export function registerAddExpenseTool(server: McpServer): void {
  server.registerTool(
    "add_expense",
    {
      title: "Add Expense",
      description:
        "Save a new expense record to the local expense log.",
      inputSchema: addExpenseInputSchema,
      outputSchema: addExpenseOutputSchema,
    },
    async ({ date, amount, category, note }) => {
      try {
        const output = await addExpense({
          date,
          amount,
          category,
          note: note ?? "",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(output, null, 2),
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        const reason =
          error instanceof Error ? error.message : "Unknown error";

        console.error(`[add_expense] ${reason}`);

        return {
          content: [
            {
              type: "text",
              text: `Could not add the expense: ${reason}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}