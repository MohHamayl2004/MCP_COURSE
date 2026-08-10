import { z } from "zod/v4";

export const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "rent",
  "other",
] as const;

export const addExpenseInputSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .describe("Date the money was spent, in YYYY-MM-DD format"),
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .max(1_000_000, "Amount is unrealistically large")
    .describe("Amount spent, a positive number"),
  category: z
    .enum(EXPENSE_CATEGORIES)
    .describe("Spending category"),
  note: z
    .string()
    .trim()
    .max(200, "Note must be 200 characters or fewer")
    .optional()
    .describe("Optional short description of the expense"),
});