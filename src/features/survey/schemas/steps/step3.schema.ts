// features/survey/schemas/steps/step3.schema.ts

import { z } from 'zod';
import { booleanField } from '../primitives';
import { growthPlanEntrySchema } from '@features/survey/schemas';
import { checkDuplicateCategories } from '../validators';

/**
 * Step 3: Growth Plans
 *
 * Validates:
 * - If has plans, entries required
 * - Both plans must have values if both are selected
 * - No duplicate categories
 */
export const step3Schema = z
    .object({
        planOneYearGrowth: booleanField('გაქვთ 1 წლის ზრდის გეგმა'),
        planFiveYearGrowth: booleanField('გაქვთ 5 წლის ზრდის გეგმა'),
        growthPlanEntries: z.array(growthPlanEntrySchema).nullable(),
    })
    .superRefine((data, ctx) => {
        const hasPlan = data.planOneYearGrowth || data.planFiveYearGrowth;

        // ✅ If has plan, entries required
        if (hasPlan && (!data.growthPlanEntries || data.growthPlanEntries.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'აუცილებელია ზრდის გეგმების ჩანაწერები',
                path: ['growthPlanEntries'],
            });
        }

        // ✅ Validation 2: If both plans selected, validate single entry case
        if (hasPlan && data.growthPlanEntries?.length === 1) {
            const entry = data.growthPlanEntries[0];
            if (data.planOneYearGrowth && data.planFiveYearGrowth) {
                if ((entry!.oneYearGrowth ?? 0) === 0 || (entry!.fiveYearGrowth ?? 0) === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'აუცილებელია ორივე ზრდადი გეგმის მითითება',
                        path: ['growthPlanEntries'],
                    });
                }
            }
        }

        // ✅ If both plans selected, both values required
        if (hasPlan && data.planOneYearGrowth && data.planFiveYearGrowth) {
            const hasEmptyEntry = data.growthPlanEntries?.some(
                (e) => e.oneYearGrowth == null || e.fiveYearGrowth == null
            );

            if (hasEmptyEntry) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'ცარიელი ველის მითითება არ შეიძლება (ჩაწერეთ 0 თუ არ გაქვთ ზრდის გეგმა)',
                    path: ['growthPlanEntries'],
                });
            }
        }

        // ✅ Check duplicates
        if (data.growthPlanEntries && data.growthPlanEntries.length > 0) {
            checkDuplicateCategories(data.growthPlanEntries, ctx, ['growthPlanEntries']);
        }
    });

export type Step3Data = z.infer<typeof step3Schema>;