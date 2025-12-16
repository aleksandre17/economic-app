// features/survey/schemas/entries/vacancyEntry.schema.ts

import { z } from 'zod';
import { idField, categoryField, nonNegativeInt } from '../primitives';
import { validateGreaterOrEqual, validateDurationSum } from '../validators';

/**
 * Vacancy Entry Schema
 *
 * Validates:
 * - Total >= Announced >= Unfilled
 * - Duration breakdown sum equals announced
 */
export const vacancyEntrySchema = z
    .object({
        id: idField,
        category: categoryField,
        totalVacancies: nonNegativeInt(10000, 'საერთო ვაკანსიები', { required: true, min: 1 }),
        announcedVacancies: nonNegativeInt(10000, 'გამოცხადებული ვაკანსიები', { required: true, min: 0 }),
        unfilledVacancies: nonNegativeInt(10000, 'შეუვსებელი ვაკანსიები', { required: true, min: 0 }),
        employmentDuration: z.object({
            underSixMonths: nonNegativeInt(10000, '6 თვემდე', { required: true, min: 0 }),
            fromSixMonthsToOneYear: nonNegativeInt(10000, '6 თვიდან 1 წლამდე', { required: true, min: 0 }),
            overOneYear: nonNegativeInt(10000, '1 წელზე მეტი', { required: true, min: 0 }),
        }),
    })
    .superRefine((data, ctx) => {
        // ✅ Validation 1: Total >= Announced
        validateGreaterOrEqual(data.totalVacancies, data.announcedVacancies, ctx, {
            path: ['announcedVacancies'],
            labelA: 'არსებული ვაკანსიები',
            labelB: 'გამოცხადებული ვაკანსიები',
        });

        // ✅ Validation 2: Announced >= Unfilled
        validateGreaterOrEqual(data.announcedVacancies, data.unfilledVacancies, ctx, {
            path: ['unfilledVacancies'],
            labelA: 'გამოცხადებული ვაკანსიები',
            labelB: 'შეუვსებელი ვაკანსიები',
        });

        // ✅ Validation 3: Duration sum
        if (data.announcedVacancies != null && data.announcedVacancies > 0) {
            validateDurationSum(
                data.employmentDuration,
                data.announcedVacancies,
                ctx,
                ['employmentDuration']
            );
        }
    });

export type VacancyEntry = z.infer<typeof vacancyEntrySchema>;