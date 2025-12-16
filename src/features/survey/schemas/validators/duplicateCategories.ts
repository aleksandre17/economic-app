// features/survey/schemas/validators/duplicateCategories.ts

import { z } from 'zod';

/**
 * Check for duplicate categories in entries array
 * @param entries - Array of entries with category field
 * @param ctx - Zod refinement context
 * @param path - Path for error message
 */
export const checkDuplicateCategories = <T extends { category: number }>(
    entries: T[],
    ctx: z.RefinementCtx,
    path: string[]
): void => {
    const categories = entries.map((entry) => entry.category);
    const uniqueCategories = new Set(categories);

    if (categories.length !== uniqueCategories.size) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'გამეორებული კატეგორია: თითოეული კატეგორია მხოლოდ ერთხელ უნდა შეიყვანოთ',
            path,
        });
    }
};

/**
 * Validator function for array entries
 */
export const validateUniqueCategories = <T extends { category: number }>(
    path: string[] = []
) => {
    return (entries: T[], ctx: z.RefinementCtx) => {
        checkDuplicateCategories(entries, ctx, path);
    };
};