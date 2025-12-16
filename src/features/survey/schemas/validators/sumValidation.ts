// features/survey/schemas/validators/sumValidation.ts

import { z } from 'zod';

/**
 * Validate that sum of parts equals total
 */
export const validateSum = (
    parts: number[],
    total: number,
    ctx: z.RefinementCtx,
    config: {
        path: string[];
        label: string;
        totalLabel: string;
    }
): void => {
    const sum = parts.reduce((acc, val) => acc + (val ?? 0), 0);

    if (sum !== total) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${config.label} (${sum}) უნდა უდრიდეს ${config.totalLabel} (${total})`,
            path: config.path,
        });
    }
};

/**
 * Validate education levels sum
 */
export const validateEducationSum = (
    educationLevels: {
        average: number | null;
        professional: number | null;
        higher: number | null;
    },
    baseQuantity: number,
    ctx: z.RefinementCtx,
    path: string[]
): void => {
    if (baseQuantity === 0 || baseQuantity == null) return;

    const parts = [
        educationLevels.average ?? 0,
        educationLevels.professional ?? 0,
        educationLevels.higher ?? 0,
    ];

    validateSum(parts, baseQuantity, ctx, {
        path,
        label: 'განათლების დონეების ჯამი',
        totalLabel: '2025 წლის რაოდენობა',
    });
};

/**
 * Validate employment duration sum
 */
export const validateDurationSum = (
    duration: {
        underSixMonths: number | null | undefined;
        fromSixMonthsToOneYear: number | null | undefined;
        overOneYear: number | null | undefined;
    },
    totalVacancies: number,
    ctx: z.RefinementCtx,
    path: string[]
): void => {
    if (totalVacancies === 0 || totalVacancies == null) return;

    const parts = [
        duration.underSixMonths ?? 0,
        duration.fromSixMonthsToOneYear ?? 0,
        duration.overOneYear ?? 0,
    ];

    validateSum(parts, totalVacancies, ctx, {
        path,
        label: 'დასაქმების ხანგრძლივობის ჯამი',
        totalLabel: 'გამოცხადებული ვაკანსიების რაოდენობა',
    });
};