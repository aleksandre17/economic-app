// features/survey/schemas/entries/hrEntry.schema.ts

import { z } from 'zod';
import { idField, categoryField, nonNegativeInt } from '../primitives';
import { validateEducationSum, validateNotExceeds } from '../validators';

/**
 * HR Entry Schema
 *
 * Validates:
 * - Education levels sum equals 2025 quantity
 * - Retirement values don't exceed base quantity
 * - Upcoming retirements don't exceed retirement range
 */
export const hrEntrySchema = z
    .object({
        id: idField,
        category: categoryField,
        quantity2025: nonNegativeInt(10000000, '2025 წლის რაოდენობა', { required: true }),
        quantity2024: nonNegativeInt(10000000, '2024 წლის რაოდენობა', { required: true }),
        educationLevels: z.object({
            average: nonNegativeInt(10000000, 'საშუალო განათლება', { required: true }),
            professional: nonNegativeInt(10000000, 'პროფესიონალური განათლება', { required: true }),
            higher: nonNegativeInt(10000000, 'მაღალი განათლება', { required: true }),
        }),
        retirementNextFiveYears: nonNegativeInt(
            10000,
            'პენსიაზე გასვლა მომავალი 5 წლის განმავლობაში'
        ),
        upcomingRetirements: nonNegativeInt(10000, 'მომავალი პენსიონერები'),
    })
    .superRefine((data, ctx) => {
        const base = data.quantity2025 ?? 0;

        // ✅ Validation 1: Education levels sum
        validateEducationSum(data.educationLevels, base, ctx, ['educationLevels']);

        // ✅ Validation 2: Retirement doesn't exceed base
        validateNotExceeds(data.retirementNextFiveYears, base, ctx, {
            path: ['retirementNextFiveYears'],
            valueLabel: 'პენსიაზე გასული',
            maxLabel: '2025 წლის რაოდენობა',
        });

        // ✅ Validation 3: Upcoming retirements doesn't exceed base
        validateNotExceeds(data.upcomingRetirements, base, ctx, {
            path: ['upcomingRetirements'],
            valueLabel: 'მომავალი პენსიონერები',
            maxLabel: '2025 წლის რაოდენობა',
        });

        // ✅ Validation 4: Upcoming <= Retirement range
        validateNotExceeds(data.upcomingRetirements, data.retirementNextFiveYears, ctx, {
            path: ['upcomingRetirements'],
            valueLabel: 'მომდევნო 5 წლის განმავლობაში პენსიაზე გამსვლელთა სავარაუდო რაოდენობა',
            maxLabel: 'მომდევნო 5 წლის განმავლობაში საპენსიო ასაკის მქონე დასაქმებულთა რაოდენობა',
        });
    });

export type HREntry = z.infer<typeof hrEntrySchema>;