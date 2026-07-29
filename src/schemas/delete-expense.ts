
import { z } from "zod";

/**
 * Input validation for the delete_expense tool.
 * The tool expects the row number of the expense to delete.
 */

export const deleteExpenseInputSchema = z.object({
  row: z
    .string()
    .regex(/^[1-9]\d*$/, "Row number must be a positive integer")
    .describe("Enter the row number of the expense to delete"),
});