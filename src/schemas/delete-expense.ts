
import { z } from "zod";

/**
 * Input validation for the delete_expense tool.
 * The tool expects the row number of the expense to delete.
 */

export const deleteExpenseInputSchema = z.object({
  id: z.number()
      .int("Expense ID must be an integer")
      .positive("Expense ID must be greater than zero")
      .max(10_000_000, "Expense ID is too large")
      .describe("Enter the unique ID of the expense to delete"),
});