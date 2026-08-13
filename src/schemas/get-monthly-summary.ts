import { z } from "zod";
import { MONTH_PATTERN } from "../lib/validation.js";

/**
 * Input validation for the get_monthly_summary tool.
 * The tool expects a single input:
 * - month: in YYYY-MM format (e.g. 2026-07)
 */
export const getMonthlySummaryInputSchema = {
  month: z.string()
          .min(1, "Month is required")
          .max(7, "Month must not exceed 7 characters")
          .regex(MONTH_PATTERN, "Month must be in YYYY-MM format (e.g. 2026-07)")
          .describe("The month to summarize in YYYY-MM format"),
};