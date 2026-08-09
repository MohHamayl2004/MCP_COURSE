import { z } from "zod";

/**
 * Input validation for the get_spending_summary tool.
 * The tool expects a single input:
 * - month: in YYYY-MM format (e.g. 2026-07)
 */
export const getSpendingSummaryInputSchema = {
  month: z
    .string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])$/,
      "Month must be in YYYY-MM format (e.g. 2026-07)"
    )
    .describe("The month to summarize in YYYY-MM format"),
};