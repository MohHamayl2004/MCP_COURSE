import { McpServer } from "@modelcontextprotocol/server";

import { addExpenseInputSchema } from "../schemas/add_expense.js";
import { appendExpense } from "../lib/expenses.js";

/** Save a new expense to the CSV (P0). */
export function registerAddExpenseTool(server: McpServer): void {
  server.registerTool(
    "add_expense",
    {
      description:
        "Save a new expense record with date, amount, category and an optional note.",
      inputSchema: addExpenseInputSchema,
    },
    async ({ date, amount, category, note }) => {
      const saved = appendExpense("add_expense", {
        date,
        amount,
        category,
        note: note ?? "",
      });

      return {
        content: [
          {
            type: "text",
            text: `Saved ${saved.id}: ${saved.amount} on ${saved.category} (${saved.date})`,
          },
        ],
      };
    },
  );
}