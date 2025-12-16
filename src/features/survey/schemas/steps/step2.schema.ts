// features/survey/schemas/steps/step2.schema.ts

import { z } from 'zod';
import { booleanField, nonNegativeInt } from '../primitives';
import { vacancyEntrySchema } from '../entries/vacancyEntry.schema';
import { checkDuplicateCategories } from '../validators';

/**
 * Step 2: Vacancies
 *
 * Validates:
 * - If has vacancies, count and entries required
 * - Total count matches sum of announced vacancies
 * - No duplicate categories
 */
export const step2Schema = z
    .object({
        hasVacancies2025: z.boolean({
            required_error: `გთხოვთ უპასხოთ: 2025 წლის პერიოდში გქონდათ თუ არა ვაკანსიები?`,
            invalid_type_error: `გთხოვთ უპასხოთ: 2025 წლის პერიოდში გქონდათ თუ არა ვაკანსიები?`,
        }),
        vacancies2025Count: nonNegativeInt(10000, 'ვაკანსიების რაოდენობა').refine(
            (v) => v == null || v >= 1,
            { message: 'რაოდენობა უნდა იყოს მინიმუმ 1' }
        ),
        vacancyEntries: z.array(vacancyEntrySchema).nullable(),
    })
    .superRefine((data, ctx) => {
        const announcedSum =
            data.vacancyEntries?.reduce((sum, e) => sum + (e.totalVacancies ?? 0), 0) || 0;

        // ✅ If has vacancies, validate requirements
        if (data.hasVacancies2025) {
            if (!data.vacancies2025Count || data.vacancies2025Count < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'აუცილებელია ვაკანსიების რაოდენობა ≥ 1',
                    path: ['vacancies2025Count'],
                });
            }

            if (!data.vacancyEntries || data.vacancyEntries.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'აუცილებელია ვაკანსიების ჩანაწერები',
                    path: ['vacancyEntries'],
                });
            }
        }

        // ✅ Validate count matches sum
        if ((data.hasVacancies2025 != null && data.hasVacancies2025) && data.vacancies2025Count != announcedSum) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'ვაკანსიების რაოდენობა უნდა ემთხვეოდეს გამოცხადებული ვაკანსიების ჯამს',
                path: ['vacancies2025Count'],
            });
        }

        // ✅ Check duplicates
        if (data.vacancyEntries && data.vacancyEntries.length > 0) {
            checkDuplicateCategories(data.vacancyEntries, ctx, ['vacancyEntries']);
        }
    });

export type Step2Data = z.infer<typeof step2Schema>;