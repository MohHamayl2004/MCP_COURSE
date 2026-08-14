import { z } from "zod/v4";

import { EXPENSE_CATEGORIES } from "./add_expense.js";

export const listExpensesInputSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be YYYY-MM")
    .optional()
    .describe("Optional month filter in YYYY-MM format"),
  category: z
    .enum(EXPENSE_CATEGORIES)
    .optional()
    .describe("Optional category filter"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("Maximum rows to return, defaults to 20"),
});