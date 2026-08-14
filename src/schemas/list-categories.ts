import { z } from "zod/v4";

/** Input validation for the list_categories tool. */
export const listCategoriesInputSchema = z.object({
    month: z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Month must be YYYY-MM")
        .optional()
        .describe("Only list categories used in this month, e.g. 2026-07"),
});
