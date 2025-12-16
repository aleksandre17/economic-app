// features/survey/schemas/steps/step4.schema.ts

import { z } from 'zod';
import { booleanField } from '../primitives';
import { reductionPlanEntrySchema } from '@features/survey/schemas';
import { checkDuplicateCategories } from '../validators';

/**
 * Step 4: Reduction Plans
 *
 * Validates:
 * - If has plans, entries required
 * - If both plans selected, both values required in each entry
 * - No empty values when both plans are selected
 * - No duplicate categories
 */
export const step4Schema = z
    .object({
        planOneYearReduction: booleanField('გაქვთ 1 წლის შემცირების გეგმა'),
        planFiveYearReduction: booleanField('გაქვთ 5 წლის შემცირების გეგმა'),
        reductionPlanEntries: z.array(reductionPlanEntrySchema).nullable(),
    })
    .superRefine((data, ctx) => {
        const hasPlan = data.planOneYearReduction || data.planFiveYearReduction;

        // ✅ Validation 1: If has plan, entries required
        if (hasPlan && (!data.reductionPlanEntries || data.reductionPlanEntries.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'აუცილებელია შემცირების გეგმების ჩანაწერები',
                path: ['reductionPlanEntries'],
            });
        }

        // ✅ Validation 2: If both plans selected, validate single entry case
        if (hasPlan && data.reductionPlanEntries?.length === 1) {
            const entry = data.reductionPlanEntries[0];
            if (data.planOneYearReduction && data.planFiveYearReduction) {
                if ((entry!.oneYearReduction ?? 0) === 0 || (entry!.fiveYearReduction ?? 0) === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'აუცილებელია ორივე შემცირების გეგმის მითითება',
                        path: ['reductionPlanEntries'],
                    });
                }
            }
        }

        // ✅ Validation 3: Multiple entries - check if any has both values
        if (hasPlan && data.reductionPlanEntries != null && data.reductionPlanEntries.length > 1) {
            const entry = data.reductionPlanEntries.find(
                (e) => (e.oneYearReduction ?? 0) > 0 && (e.fiveYearReduction ?? 0) > 0
            );
            if (entry && data.planOneYearReduction && data.planFiveYearReduction) {
                if ((entry.oneYearReduction ?? 0) === 0 || (entry.fiveYearReduction ?? 0) === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'აუცილებელია მინიმუმ ორივე შემცირების გეგმის მითითება',
                        path: ['reductionPlanEntries'],
                    });
                }
            }
        }

        // ✅ If both plans selected, both values required
        if (hasPlan && data.planOneYearReduction && data.planFiveYearReduction) {
            const hasEmptyEntry = data.reductionPlanEntries?.some(
                (e) => e.oneYearReduction == null || e.fiveYearReduction == null
            );

            if (hasEmptyEntry) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'ცარიელი ველის მითითება არ შეიძლება (ჩაწერეთ 0 თუ არ გაქვთ ზრდის გეგმა)',
                    path: ['reductionPlanEntries'],
                });
            }
        }

        // ✅ Validation 5: Check duplicates
        if (data.reductionPlanEntries && data.reductionPlanEntries.length > 0) {
            checkDuplicateCategories(data.reductionPlanEntries, ctx, ['reductionPlanEntries']);
        }
    });

export type Step4Data = z.infer<typeof step4Schema>;