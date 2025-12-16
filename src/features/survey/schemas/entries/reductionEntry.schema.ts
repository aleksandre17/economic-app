// features/survey/schemas/entries/reductionEntry.schema.ts

import { z } from 'zod';
import { idField, categoryField, nonNegativeInt } from '../primitives';

/**
 * Reduction Plan Entry Schema
 *
 * At least one reduction plan (1-year or 5-year) must be specified
 */
export const reductionPlanEntrySchema = z
    .object({
        id: idField,
        category: categoryField,
        oneYearReduction: nonNegativeInt(10000, '1 წლის შემცირება'),
        fiveYearReduction: nonNegativeInt(50000, '5 წლის შემცირება'),
    })
    .superRefine((data, ctx) => {
        if ((data.oneYearReduction ?? 0) === 0 && (data.fiveYearReduction ?? 0) === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'აუცილებელია მინიმუმ ერთი შემცირების გეგმის მითითება',
                path: ['oneYearReduction'],
            });
        }
    });

export type ReductionPlanEntry = z.infer<typeof reductionPlanEntrySchema>;