import { z } from "zod";

/**
 * Input validation for the delete_expense tool.
 *
 * Deletion is by id, not by row position. Row numbers shift after every delete,
 * so "delete row 3" twice would remove two different expenses.
 */
export const deleteExpenseInputSchema = z.object({
  id: z
    .string()
    .regex(/^exp_\d+$/, "Id must look like exp_001")
    .describe("Id of the expense to delete, for example exp_003"),
});
