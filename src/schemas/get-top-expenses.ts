import { z } from "zod";

/** Input validation for the get_top_expenses tool. */
export const getTopExpensesInputSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format")
    .optional()
    .describe("Optional month filter in YYYY-MM format"),
  limit: z
    .number()
    .int("Limit must be a whole number")
    .positive("Limit must be a positive number")
    .max(100, "Limit cannot be greater than 100")
    .describe("The number of top expenses to return"),
});