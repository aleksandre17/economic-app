// features/survey/schemas/validators/rangeValidation.ts

import { z } from 'zod';

/**
 * Validate that value does not exceed max
 */
export const validateNotExceeds = (
    value: number | null,
    max: number | null,
    ctx: z.RefinementCtx,
    config: {
        path: string[];
        valueLabel: string;
        maxLabel: string;
    }
): void => {
    if (value == null || max == null) return;

    if (value > max) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${config.valueLabel} არ უნდა აღემატებოდეს ${config.maxLabel}`,
            path: config.path,
        });
    }
};

/**
 * Validate A >= B relationship
 */
export const validateGreaterOrEqual = (
    valueA: number | null,
    valueB: number | null,
    ctx: z.RefinementCtx,
    config: {
        path: string[];
        labelA: string;
        labelB: string;
    }
): void => {
    if (valueA == null || valueB == null) return;

    if (valueB > valueA) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${config.labelB} (${valueB}) არ უნდა აღემატებოდეს ${config.labelA} (${valueA})`,
            path: config.path,
        });
    }
};