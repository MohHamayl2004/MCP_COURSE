import fs from "fs";
import path from "path";
import { McpServer } from "@modelcontextprotocol/server";
import { deleteExpenseInputSchema } from "../schemas/delete-expense.js";

export function registerDeleteExpenseTool(server: McpServer) {
  server.registerTool(
    "delete_expense",
    {
      title: "Delete Expense",
      description: "[P1 — not implemented] List all spending categories seen in the expenses.",
      inputSchema: deleteExpenseInputSchema.shape,
    },
    async ({ row }) => {
      try {
        const filePath = path.join(process.cwd(), "data", "expenses.csv");

        if (!fs.existsSync(filePath)) {
          return {
            content: [
              {
                type: "text",
                text: "Expenses file not found.",
              },
            ],
          };
        }

        const rows = fs.readFileSync(filePath, "utf-8").trim().split("\n");

        if (rows.length <= 1) {
          return {
            content: [
              {
                type: "text",
                text: "No expenses found.",
              },
            ],
          };
        }

        const rowIndex = Number(row);

        if (rowIndex < 1 || rowIndex >= rows.length) {
          return {
            content: [
              {
                type: "text",
                text: `Invalid row number: ${row}`,
              },
            ],
          };
        }

        rows.splice(rowIndex, 1);

        fs.writeFileSync(filePath, rows.join("\n"));

        return {
          content: [
            {
              type: "text",
              text: `Expense at row ${row} deleted successfully.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error deleting expense: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}