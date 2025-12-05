import { z } from 'zod';

/* ═══════════════════════════════════════════════════════════
   Education Levels Schema
   ═══════════════════════════════════════════════════════════ */

export const educationLevelsSchema = z.object({
    average: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
    professional: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
    higher: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
});

/* ═══════════════════════════════════════════════════════════
   HR Entry Schema (Step 1)
   ═══════════════════════════════════════════════════════════ */

export const hrEntrySchema = z.object({
    id: z.string().min(1, 'ID აუცილებელია'),
    category: z.string()
        .min(1, 'კატეგორია აუცილებელია')
        .max(100, 'კატეგორია ძალიან გრძელია'),
    quantity2025: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(100000, 'ძალიან დიდი რიცხვი'),
    quantity2024: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(100000, 'ძალიან დიდი რიცხვი'),
    educationLevels: educationLevelsSchema,
    retirementNextFiveYears: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
    upcomingRetirements: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
    })
    .refine((data) => {
            // Validation: განათლების დონეების ჯამი არ უნდა აღემატებოდეს 2025 წლის რაოდენობას
            const totalEducation = data.educationLevels.average +
                data.educationLevels.professional +
                data.educationLevels.higher;
            return totalEducation <= data.quantity2025;
        },
        {
            message: 'განათლების დონეების ჯამი არ შეიძლება აღემატებოდეს 2025 წლის საერთო რაოდენობას',
            path: ['educationLevels'],
        })
    .refine((data) => {
        // Validation: პენსიაზე გასული არ უნდა აღემატებოდეს 2025 წლის რაოდენობას
        return data.retirementNextFiveYears <= data.quantity2025;
        }, {
            message: 'პენსიაზე გასული არ შეიძლება აღემატებოდეს 2025 წლის საერთო რაოდენობას',
            path: ['retirementNextFiveYears'],
        })
    .refine((data) => {
        // Validation: მომავალი პენსიონერები არ უნდა აღემატებოდეს 2025 წლის რაოდენობას
        return data.upcomingRetirements <= data.quantity2025;
        }, {
            message: 'მომავალი პენსიონერები არ შეიძლება აღემატებოდეს 2025 წლის საერთო რაოდენობას',
            path: ['upcomingRetirements'],
    });

/* ═══════════════════════════════════════════════════════════
   Vacancy Entry Schema (Step 2)
   ═══════════════════════════════════════════════════════════ */

export const vacancyEntrySchema = z.object({
    id: z.string().min(1, 'ID აუცილებელია'),
    category: z.string()
        .min(1, 'კატეგორია აუცილებელია')
        .max(100, 'კატეგორია ძალიან გრძელია'),
    totalVacancies: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
    announcedVacancies: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
    unfilledVacancies: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი'),
    employmentDuration: z.enum(['under_6_months', '6_months_to_1_year', 'over_1_year'], {
        errorMap: () => ({ message: 'აირჩიეთ დასაქმების ხანგრძლივობა' }),
    }),
    }).refine((data) => {
        // Validation: გამოცხადებული ვაკანსიები არ უნდა აღემატებოდეს საერთო ვაკანსიებს
        return data.announcedVacancies <= data.totalVacancies;
    }, {
        message: 'გამოცხადებული ვაკანსიები არ შეიძლება აღემატებოდეს საერთო ვაკანსიებს',
        path: ['announcedVacancies'],
    }).refine((data) => {
        // Validation: შეუვსებელი ვაკანსიები არ უნდა აღემატებოდეს საერთო ვაკანსიებს
        return data.unfilledVacancies <= data.totalVacancies;
    }, {
        message: 'შეუვსებელი ვაკანსიები არ შეიძლება აღემატებოდეს საერთო ვაკანსიებს',
        path: ['unfilledVacancies'],
    });

/* ═══════════════════════════════════════════════════════════
   Growth Plan Entry Schema (Step 3)
   ═══════════════════════════════════════════════════════════ */

export const growthPlanEntrySchema = z.object({
    id: z.string().min(1, 'ID აუცილებელია'),
    category: z.string()
        .min(1, 'კატეგორია აუცილებელია')
        .max(100, 'კატეგორია ძალიან გრძელია'),
    oneYearGrowth: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი')
        .optional(),
    fiveYearGrowth: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(50000, 'ძალიან დიდი რიცხვი')
        .optional(),
    }).refine((data) => {
        // Validation: მინიმუმ ერთი ველი უნდა იყოს შევსებული
        return data.oneYearGrowth !== undefined || data.fiveYearGrowth !== undefined;
    }, {
        message: 'მინიმუმ ერთი ველი უნდა იყოს შევსებული (1 წლის ან 5 წლის)',
        path: ['oneYearGrowth'],
    });

/* ═══════════════════════════════════════════════════════════
   Reduction Plan Entry Schema (Step 4)
   ═══════════════════════════════════════════════════════════ */

export const reductionPlanEntrySchema = z.object({
    id: z.string().min(1, 'ID აუცილებელია'),
    category: z.string()
        .min(1, 'კატეგორია აუცილებელია')
        .max(100, 'კატეგორია ძალიან გრძელია'),
    oneYearReduction: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(10000, 'ძალიან დიდი რიცხვი')
        .optional(),
    fiveYearReduction: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(0, 'უნდა იყოს 0 ან მეტი')
        .max(50000, 'ძალიან დიდი რიცხვი')
        .optional(),
    }).refine((data) => {
        // Validation: მინიმუმ ერთი ველი უნდა იყოს შევსებული
        return data.oneYearReduction !== undefined || data.fiveYearReduction !== undefined;
    }, {
        message: 'მინიმუმ ერთი ველი უნდა იყოს შევსებული (1 წლის ან 5 წლის)',
        path: ['oneYearReduction'],
    });

/* ═══════════════════════════════════════════════════════════
   Main Survey Form Data Schema
   ═══════════════════════════════════════════════════════════ */

export const surveySchema = z.object({
    // Step 1 - HR მონაცემები
    hrEntries: z.array(hrEntrySchema)
        .min(1, 'მინიმუმ ერთი HR ჩანაწერი აუცილებელია')
        .optional(),

    // Step 2 - ვაკანსიების ინფორმაცია
    hasVacancies2025: z.boolean({
        required_error: 'აუცილებელია: გქონდათ თუ არა ვაკანსიები 2025 წელს',
    }),
    vacancies2025Count: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(1, 'რაოდენობა უნდა იყოს მინიმუმ 1')
        .max(10000, 'ძალიან დიდი რიცხვი')
        .optional(),
    vacancyEntries: z.array(vacancyEntrySchema).optional(),

    // Step 3 - დასაქმების ზრდის გეგმები
    planOneYearGrowth: z.boolean({
        required_error: 'აუცილებელია: გაქვთ თუ არა 1 წლის ზრდის გეგმები',
    }),
    planFiveYearGrowth: z.boolean({
        required_error: 'აუცილებელია: გაქვთ თუ არა 5 წლის ზრდის გეგმები',
    }),
    growthPlanEntries: z.array(growthPlanEntrySchema).optional(),

    // Step 4 - დასაქმების შემცირების გეგმები
    planOneYearReduction: z.boolean({
        required_error: 'აუცილებელია: გაქვთ თუ არა 1 წლის შემცირების გეგმები',
    }),
    planFiveYearReduction: z.boolean({
        required_error: 'აუცილებელია: გაქვთ თუ არა 5 წლის შემცირების გეგმები',
    }),
    reductionPlanEntries: z.array(reductionPlanEntrySchema).optional(),
    }).refine((data) => {
        // Validation: თუ hasVacancies2025 = true, მაშინ vacancies2025Count აუცილებელია
        if (data.hasVacancies2025 && !data.vacancies2025Count) {
            return false;
        }
        return true;
    }, {
        message: 'ვაკანსიების რაოდენობა აუცილებელია, როცა არის ვაკანსიები',
        path: ['vacancies2025Count'],
    }).refine((data) => {
        // Validation: თუ hasVacancies2025 = true და vacancies2025Count > 0, მაშინ vacancyEntries აუცილებელია
        if (data.hasVacancies2025 && data.vacancies2025Count && data.vacancies2025Count > 0) {
            if (!data.vacancyEntries || data.vacancyEntries.length === 0) {
                return false;
            }
        }
        return true;
    }, {
        message: 'დაამატეთ ვაკანსიების ჩანაწერები',
        path: ['vacancyEntries'],
    }).refine((data) => {
        // Validation: თუ planOneYearGrowth ან planFiveYearGrowth = true, მაშინ growthPlanEntries აუცილებელია
        if ((data.planOneYearGrowth || data.planFiveYearGrowth) &&
            (!data.growthPlanEntries || data.growthPlanEntries.length === 0)) {
            return false;
        }
        return true;
    }, {
        message: 'დაამატეთ ზრდის გეგმების ჩანაწერები',
        path: ['growthPlanEntries'],
    }).refine((data) => {
        // Validation: თუ planOneYearReduction ან planFiveYearReduction = true, მაშინ reductionPlanEntries აუცილებელია
        if ((data.planOneYearReduction || data.planFiveYearReduction) &&
            (!data.reductionPlanEntries || data.reductionPlanEntries.length === 0)) {
            return false;
        }
        return true;
    }, {
        message: 'დაამატეთ შემცირების გეგმების ჩანაწერები',
        path: ['reductionPlanEntries'],
    });

/* ═══════════════════════════════════════════════════════════
   Step-Specific Schemas (For Individual Step Validation)
   ═══════════════════════════════════════════════════════════ */

// Step 1 Validation Schema
export const step1Schema = z.object({
    hrEntries: z.array(hrEntrySchema)
        .min(1, 'მინიმუმ ერთი HR ჩანაწერი აუცილებელია'),
});

// Step 2 Validation Schema
export const step2Schema = z.object({
    hasVacancies2025: z.boolean(),
    vacancies2025Count: z.number()
        .int('უნდა იყოს მთელი რიცხვი')
        .min(1, 'რაოდენობა უნდა იყოს მინიმუმ 1')
        .max(10000, 'ძალიან დიდი რიცხვი')
        .optional(),
    vacancyEntries: z.array(vacancyEntrySchema).optional(),
    }).refine((data) => {
        if (data.hasVacancies2025 && !data.vacancies2025Count) {
            return false;
        }
        return true;
    }, {
        message: 'ვაკანსიების რაოდენობა აუცილებელია',
        path: ['vacancies2025Count'],
    }).refine((data) => {
        if (data.hasVacancies2025 && data.vacancies2025Count && data.vacancies2025Count > 0) {
            if (!data.vacancyEntries || data.vacancyEntries.length === 0) {
                return false;
            }
        }
        return true;
    }, {
        message: 'დაამატეთ ვაკანსიების ჩანაწერები',
        path: ['vacancyEntries'],
    });

    // Step 3 Validation Schema
    export const step3Schema = z.object({
        planOneYearGrowth: z.boolean(),
        planFiveYearGrowth: z.boolean(),
        growthPlanEntries: z.array(growthPlanEntrySchema).optional(),
    }).refine((data) => {
        if ((data.planOneYearGrowth || data.planFiveYearGrowth) &&
            (!data.growthPlanEntries || data.growthPlanEntries.length === 0)) {
            return false;
        }
        return true;
    }, {
        message: 'დაამატეთ ზრდის გეგმების ჩანაწერები',
        path: ['growthPlanEntries'],
    });

    // Step 4 Validation Schema
    export const step4Schema = z.object({
        planOneYearReduction: z.boolean(),
        planFiveYearReduction: z.boolean(),
        reductionPlanEntries: z.array(reductionPlanEntrySchema).optional(),
    }).refine((data) => {
        if ((data.planOneYearReduction || data.planFiveYearReduction) &&
            (!data.reductionPlanEntries || data.reductionPlanEntries.length === 0)) {
            return false;
        }
        return true;
    }, {
        message: 'დაამატეთ შემცირების გეგმების ჩანაწერები',
        path: ['reductionPlanEntries'],
    });

/* ═══════════════════════════════════════════════════════════
   Type Exports
   ═══════════════════════════════════════════════════════════ */

export type EducationLevels = z.infer<typeof educationLevelsSchema>;
export type HREntry = z.infer<typeof hrEntrySchema>;
export type VacancyEntry = z.infer<typeof vacancyEntrySchema>;
export type GrowthPlanEntry = z.infer<typeof growthPlanEntrySchema>;
export type ReductionPlanEntry = z.infer<typeof reductionPlanEntrySchema>;
export type SurveyFormData = z.infer<typeof surveySchema>;

/* ═══════════════════════════════════════════════════════════
   Helper Function: Validate Step Data
   ═══════════════════════════════════════════════════════════ */

export const validateStep = (step: number, data: Partial<SurveyFormData>) => {
    try {
        switch (step) {
            case 1:
                step1Schema.parse(data);
                return { success: true, errors: null };
            case 2:
                step2Schema.parse(data);
                return { success: true, errors: null };
            case 3:
                step3Schema.parse(data);
                return { success: true, errors: null };
            case 4:
                step4Schema.parse(data);
                return { success: true, errors: null };
            default:
                return { success: true, errors: null };
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                }))
            };
        }
        return { success: false, errors: [{ path: 'unknown', message: 'Validation failed' }] };
    }
};

/* ═══════════════════════════════════════════════════════════
   Helper Function: Validate Full Survey
   ═══════════════════════════════════════════════════════════ */

export const validateSurvey = (data: Partial<SurveyFormData>) => {
    try {
        surveySchema.parse(data);
        return { success: true, errors: null };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                }))
            };
        }
        return { success: false, errors: [{ path: 'unknown', message: 'Validation failed' }] };
    }
};