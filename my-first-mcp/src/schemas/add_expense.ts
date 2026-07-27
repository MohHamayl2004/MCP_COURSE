import { z } from "zod";

export const addExpenseInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),
  amount: z.number().positive("amount must be greater than 0"),
  category: z.string().min(1, "category is required"),
  note: z.string().optional(),
});

export type AddExpenseInput = z.infer<typeof addExpenseInputSchema>;

export const addExpenseOutputSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  category: z.string(),
  note: z.string(),
});

export type AddExpenseOutput = z.infer<typeof addExpenseOutputSchema>;
