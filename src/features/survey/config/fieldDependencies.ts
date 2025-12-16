// features/survey/utils/fieldCleanup.ts

import type { SurveyFormData } from '../types/survey.types';

export interface FieldCleanupRule {
    field: keyof SurveyFormData;
    when: (value: any, formData: Partial<SurveyFormData>) => boolean;
    cleanup: (formData: Partial<SurveyFormData>) => Partial<SurveyFormData>;
}

export const FIELD_CLEANUP_RULES: FieldCleanupRule[] = [
    // =====================================================
    // Step 2: Vacancies
    // =====================================================
    {
        field: 'hasVacancies2025',
        when: (value) => value === false,
        cleanup: () => ({
            vacancies2025Count: null,
            vacancyEntries: [],
        }),
    },

    // =====================================================
    // Step 3: Growth - One Year
    // =====================================================
    {
        field: 'planOneYearGrowth',
        when: (value) => value === false,
        cleanup: (formData) => {
            const entries = formData.growthPlanEntries || [];

            // ✅ Clear oneYear field in all entries
            return {
                growthPlanEntries: entries.map((entry) => ({
                    ...entry,
                    oneYearGrowth: null,
                })),
            };
        },
    },

    // =====================================================
    // Step 3: Growth - Five Years
    // =====================================================
    {
        field: 'planFiveYearGrowth',
        when: (value) => value === false,
        cleanup: (formData) => {
            const entries = formData.growthPlanEntries || [];

            // ✅ Clear fiveYears field in all entries
            return {
                growthPlanEntries: entries.map((entry) => ({
                    ...entry,
                    fiveYearGrowth: null,
                })),
            };
        },
    },

    // =====================================================
    // Step 3: Both Unchecked - Clear Entire Array
    // =====================================================
    {
        field: 'planOneYearGrowth',
        when: (value, data) => !value && !data.planFiveYearGrowth,
        cleanup: () => ({
            growthPlanEntries: [],
        }),
    },
    {
        field: 'planFiveYearGrowth',
        when: (value, data) => !value && !data.planOneYearGrowth,
        cleanup: () => ({
            growthPlanEntries: [],
        }),
    },

    // =====================================================
    // Step 4: Reduction - One Year
    // =====================================================
    {
        field: 'planOneYearReduction',
        when: (value) => value === false,
        cleanup: (formData) => {
            const entries = formData.reductionPlanEntries || [];

            return {
                reductionPlanEntries: entries.map((entry) => ({
                    ...entry,
                    oneYearReduction: null,
                })),
            };
        },
    },

    // =====================================================
    // Step 4: Reduction - Five Years
    // =====================================================
    {
        field: 'planFiveYearReduction',
        when: (value) => value === false,
        cleanup: (formData) => {
            const entries = formData.reductionPlanEntries || [];

            return {
                reductionPlanEntries: entries.map((entry) => ({
                    ...entry,
                    fiveYearReduction: null,
                })),
            };
        },
    },

    // =====================================================
    // Step 4: Both Unchecked - Clear Entire Array
    // =====================================================
    {
        field: 'planOneYearReduction',
        when: (value, data) => !value && !data.planFiveYearReduction,
        cleanup: () => ({
            reductionPlanEntries: [],
        }),
    },
    {
        field: 'planFiveYearReduction',
        when: (value, data) => !value && !data.planOneYearReduction,
        cleanup: () => ({
            reductionPlanEntries: [],
        }),
    },
];