export interface EducationLevels {
    average: number;
    professional: number;
    higher: number;
}

export interface HREntry {
    id: string;
    category: string;
    quantity2025: number;
    quantity2024: number;
    educationLevels: EducationLevels;
    retirementNextFiveYears: number;
    upcomingRetirements: number;
}

// ვაკანსიების ჩანაწერი (Step 2)
export interface VacancyEntry {
    id: string;
    category: string;
    totalVacancies: number;           // არსებული ვაკანსიების რაოდენობა
    announcedVacancies: number;       // გამოცხადებული ვაკანსიების რაოდენობა
    unfilledVacancies: number;        // შეუვსებელი ვაკანსიების რაოდენობა
    employmentDuration: 'under_6_months' | '6_months_to_1_year' | 'over_1_year';
}

// დასაქმების ზრდის ჩანაწერი (Step 3)
export interface GrowthPlanEntry {
    id: string;
    category: string;
    oneYearGrowth?: number;
    fiveYearGrowth?: number;
}

// დასაქმების შემცირების ჩანაწერი (Step 4)
export interface ReductionPlanEntry {
    id: string;
    category: string;
    oneYearReduction?: number;
    fiveYearReduction?: number;
}

export interface SurveyFormData {
    // Step 1 - HR მონაცემები
    hrEntries?: HREntry[];

    // Step 2 - ვაკანსიების ინფორმაცია (ახალი)
    hasVacancies2025: boolean;           // "გქონდათ ვაკანსიები?"
    vacancies2025Count?: number;         // რაოდენობა (თუ hasVacancies2025 = true)
    vacancyEntries?: VacancyEntry[];     // ვაკანსიების ჩანაწერები

    // Step 3 - დასაქმების ზრდის გეგმები
    planOneYearGrowth: boolean;
    planFiveYearGrowth: boolean;
    growthPlanEntries?: GrowthPlanEntry[];

    // Step 4 - დასაქმების შემცირების გეგმები
    planOneYearReduction: boolean;
    planFiveYearReduction: boolean;
    reductionPlanEntries?: ReductionPlanEntry[];
}

export interface StepConfig {
    id: number;
    title: string;
    description: string;
}

export interface StepProps {
    onNext: () => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

export interface SurveyContextValue {
    formData: Partial<SurveyFormData>;
    updateFormData: (data: Partial<SurveyFormData>) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    totalSteps: number;
    resetForm: () => void;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    isLoading?: boolean; // ⭐ ახალი: API loading state
    surveyId?: string | null; // ⭐ ახალი: Survey ID from DB
}

// კატეგორიები
export const CATEGORIES = [
    'აღმასრულებელი დირექტორი',
    'ფინანსური დირექტორი',
    'HR მენეჯერი',
    'IT მენეჯერი',
    'მარკეტინგის მენეჯერი',
    'გაყიდვების მენეჯერი',
    'ოპერაციების მენეჯერი',
    'ადმინისტრაციული პერსონალი',
    'ტექნიკური პერსონალი',
    'სხვა',
];

// დასაქმების ხანგრძლივობა
export const EMPLOYMENT_DURATION_OPTIONS = [
    { value: 'under_6_months', label: '6 თვემდე' },
    { value: '6_months_to_1_year', label: '6 თვიდან 1 წლამდე' },
    { value: 'over_1_year', label: '1 წელი და მეტი' },
] as const;

export type EmploymentDuration = typeof EMPLOYMENT_DURATION_OPTIONS[number]['value'];