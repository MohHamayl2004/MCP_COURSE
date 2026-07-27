import { z } from "zod/v4";

/** Input validation for the list_expenses tool. */
export const listExpensesInputSchema = z.object({
  month: z
    .string()
    .optional()
    .describe("Optional month filter in YYYY-MM format"),
  category: z
    .string()
    .optional()
    .describe("Optional category filter such as food or transport"),
});
