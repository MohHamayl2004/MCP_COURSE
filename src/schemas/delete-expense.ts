
import { z } from "zod";

/**
 * Input validation for the delete_expense tool.
 * The tool expects the row number of the expense to delete.
 */

export const deleteExpenseInputSchema = z.object({
  row: z
    .string()
    .min(1, "Row number is required")
    .max(7, "Row number must not exceed 7 characters")
    .regex(/^[1-9]\d*$/, "Row number must be a positive integer")
    .describe("Enter the row number of the expense to delete"),
});