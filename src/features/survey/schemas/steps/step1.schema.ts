// features/survey/schemas/steps/step1.schema.ts

import { z } from 'zod';
import { hrEntrySchema } from '../entries/hrEntry.schema';
import { checkDuplicateCategories } from '../validators';

/**
 * Step 1: HR Entries
 *
 * Validates:
 * - At least one HR entry
 * - No duplicate categories
 */
export const step1Schema = z
    .object({
        hrEntries: z.array(hrEntrySchema).min(1, 'აუცილებელია: მინიმუმ ერთი HR ჩანაწერი'),
    })
    .superRefine((data, ctx) => {
        checkDuplicateCategories(data.hrEntries, ctx, ['hrEntries']);
    });

export type Step1Data = z.infer<typeof step1Schema>;