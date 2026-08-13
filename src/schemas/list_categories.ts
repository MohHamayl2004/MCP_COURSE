import { z } from "zod/v4";
import { MONTH_PATTERN } from "../lib/validation.js";

/** Input validation for the list_categories tool. */
export const listCategoriesInputSchema = z.object({
    month: z.string()
            .regex(MONTH_PATTERN, "Month must be YYYY-MM")
            .optional()
            .describe("Only list categories used in this month, e.g. 2026-07"),
});
