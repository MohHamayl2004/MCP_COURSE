import type { McpServer } from "@modelcontextprotocol/server";

import { deleteExpenseInputSchema } from "../schemas/delete-expense.js";

/**
 * Registers the delete_expense tool.
 * Actual CSV deletion will be implemented later.
 */
export function registerDeleteExpenseTool(server: McpServer): void {
    
  server.registerTool(
    "delete_expense",
    {
      title: "Delete Expense",
      description: "Delete an expense record using its row number.",
      inputSchema: deleteExpenseInputSchema,
    },
    async ({ row }) => {
        const rowNumber = Number(row);
      return {
        content: [
          {
            type: "text",
            text:
              `Delete request received for expense at row ${rowNumber}.\n\n` +
              "🚧 The tool is registered successfully.\n" +
              "CSV deletion will be implemented later.",
          },
        ],
      };
    },
  );
}