// features/survey/schemas/entries/growthEntry.schema.ts

import { z } from 'zod';
import { idField, categoryField, nonNegativeInt } from '../primitives';

/**
 * Growth Plan Entry Schema
 *
 * At least one growth plan (1-year or 5-year) must be specified
 */
export const growthPlanEntrySchema = z
    .object({
        id: idField,
        category: categoryField,
        oneYearGrowth: nonNegativeInt(10000, '1 წლის ზრდის გეგმა'),
        fiveYearGrowth: nonNegativeInt(50000, '5 წლის ზრდის გეგმა'),
    })
    .refine((d) => (d.oneYearGrowth ?? 0) > 0 || (d.fiveYearGrowth ?? 0) > 0, {
        message: 'აუცილებელია მინიმუმ ერთი ზრდის გეგმის მითითება',
        path: ['oneYearGrowth'],
    });

export type GrowthPlanEntry = z.infer<typeof growthPlanEntrySchema>;