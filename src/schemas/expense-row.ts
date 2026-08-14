import { z } from "zod/v4";

/** Shape of one row in ./data/expenses.csv, after CSV parsing. */
export const expenseRowSchema = z.object({
  id: z.string().regex(/^exp_\d+$/, "Id must look like exp_001"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Date in YYYY-MM-DD"),
  amount: z.coerce.number().positive().describe("Amount spent"),
  category: z.string().min(1).describe("Spending category"),
  note: z.string().default("").describe("Free-text description"),
});

export type ExpenseRow = z.infer<typeof expenseRowSchema>;