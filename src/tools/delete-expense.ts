import { McpServer } from "@modelcontextprotocol/server";
import { deleteExpenseInputSchema } from "../schemas/delete-expense.js";
import { deleteExpense } from "../lib/expenses.js";

export function registerDeleteExpenseTool(server: McpServer): void { 
  server.registerTool("delete_expense",
    {
      title: "Delete Expense",
      description: "Delete an expense from the CSV file using its data row number.",
      inputSchema: deleteExpenseInputSchema.shape,
    },
    async ({ row }) => {
      try 
      {
        const result = await deleteExpense(row);
        return {content: [{type: "text", text: JSON.stringify(result, null, 2),},],};
      } 
      catch (error) 
      {
        const reason = error instanceof Error ? error.message : "Unknown error";
        console.error(`[delete_expense] ${reason}`);

        return {content: [{type: "text", text: `Could not delete the expense: ${reason}`,},],isError: true,};
      }},);
}