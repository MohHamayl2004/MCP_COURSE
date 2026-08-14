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
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      "Date must be a valid YYYY-MM-DD",
    )
    .describe("Date the money was spent, in YYYY-MM-DD format"),
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .max(1_000_000, "Amount is unrealistically large")
    .describe("Amount spent, a positive number"),
  category: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Category cannot be empty")
    .max(40, "Category must be 40 characters or fewer")
    .regex(/^[a-z][a-z0-9 -]*$/, "Category may only contain letters, numbers, spaces and hyphens")
    .describe("Spending category, e.g. food, transport, health"),
  note: z
    .string()
    .trim()
    .max(200, "Note must be 200 characters or fewer")
    .optional()
    .describe("Optional short description of the expense"),
});