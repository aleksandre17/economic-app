export interface EducationLevels {
    average: number | null;
    professional: number | null;
    higher: number | null;
}

export interface HREntry {
    id: string | number;
    category: number;
    quantity2025: number | null;
    quantity2024: number | null;
    educationLevels: EducationLevels;
    retirementNextFiveYears: number | null;
    upcomingRetirements: number | null;
}

// ვაკანსიების ჩანაწერი (Step 2)
export interface VacancyEntry {
    id: string | number;
    category: number;
    totalVacancies: number | null;           // არსებული ვაკანსიების რაოდენობა
    announcedVacancies: number | null;       // გამოცხადებული ვაკანსიების რაოდენობა
    unfilledVacancies: number | null;        // შეუვსებელი ვაკანსიების რაოდენობა
    employmentDuration: {
        underSixMonths: number | null,
        fromSixMonthsToOneYear: number | null,
        overOneYear: number | null
    }
}

// დასაქმების ზრდის ჩანაწერი (Step 3)
export interface GrowthPlanEntry {
    id: string;
    category: number;
    oneYearGrowth: number | null;
    fiveYearGrowth: number | null;
}

// დასაქმების შემცირების ჩანაწერი (Step 4)
export interface ReductionPlanEntry {
    id: string;
    category: number;
    oneYearReduction: number | null;
    fiveYearReduction: number | null;
}

export interface SurveyFormData {
    // Step 1 - HR მონაცემები
    hrEntries: HREntry[];

    // Step 2 - ვაკანსიების ინფორმაცია (ახალი)
    hasVacancies2025: boolean;           // "გქონდათ ვაკანსიები?"
    vacancies2025Count: number | null;         // რაოდენობა (თუ hasVacancies2025 = true)
    vacancyEntries: VacancyEntry[];     // ვაკანსიების ჩანაწერები

    // Step 3 - დასაქმების ზრდის გეგმები
    planOneYearGrowth: boolean | null;
    planFiveYearGrowth: boolean | null;
    growthPlanEntries: GrowthPlanEntry[];

    // Step 4 - დასაქმების შემცირების გეგმები
    planOneYearReduction: boolean;
    planFiveYearReduction: boolean;
    reductionPlanEntries: ReductionPlanEntry[];
}

export interface StepConfig {
    id: number;
    title: string;
    description: string;
}

// export interface StepProps {
//     onNext: () => void;
//     onBack: () => void;
//     isFirstStep: boolean;
//     isLastStep: boolean;
// }

export interface SurveyContextValue {
    formData: SurveyFormData; //Partial<SurveyFormData>
    updateFormData: (data: Partial<SurveyFormData>) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    totalSteps: number;
    resetForm: () => void;
    updateField: <K extends keyof SurveyFormData>(field: K, value: SurveyFormData[K]) => void; // ✅
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    isLoading?: boolean; // ⭐ ახალი: API loading state
    surveyId?: string | number | null; // ⭐ ახალი: Survey ID from DB
}

//export type EmploymentDuration = typeof EMPLOYMENT_DURATION_OPTIONS[number]['value'];