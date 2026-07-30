import { z } from "zod/v4";

export const getMonthlySummaryInputSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format")
    .describe("Month to summarize in YYYY-MM format"),
});
