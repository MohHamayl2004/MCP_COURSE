import { z } from "zod";

/** Input validation for the add_expense tool. */
export const addExpenseInputSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format")
    .describe("The expense date in YYYY-MM-DD format"),
  amount: z
    .number()
    .positive("amount must be greater than 0")
    .describe("The amount spent, as a positive number"),
  category: z
    .string()
    .min(1, "category is required")
    .describe("The spending category, such as food or transport"),
  note: z.string().optional().describe("Optional free-text note about the expense"),
});

export type AddExpenseInput = z.infer<typeof addExpenseInputSchema>;

/** Output shape for the add_expense tool. */
export const addExpenseOutputSchema = z.object({
  id: z.string().describe("Unique identifier assigned to the new expense record"),
  date: z.string().describe("The expense date in YYYY-MM-DD format"),
  amount: z.number().describe("The amount spent"),
  category: z.string().describe("The spending category"),
  note: z.string().describe("Free-text note about the expense, empty string if none"),
});

export type AddExpenseOutput = z.infer<typeof addExpenseOutputSchema>;

