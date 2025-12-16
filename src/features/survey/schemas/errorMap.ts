// schemas/errorMap.ts
import { z } from 'zod';

/**
 * ✅ Field labels mapping
 */
const fieldLabels: Record<string, string> = {
    // HR Entry
    'category': 'კატეგორია',
    'quantity2025': '2025 წლის რაოდენობა',
    'quantity2024': '2024 წლის რაოდენობა',
    'educationLevels': 'განათლების დონეები',
    'educationLevels.average': 'საშუალო განათლება',
    'educationLevels.professional': 'პროფესიონალური განათლება',
    'educationLevels.higher': 'მაღალი განათლება',
    'retirementNextFiveYears': 'პენსიაზე გასვლა',
    'upcomingRetirements': 'მომავალი პენსიონერები',

    // Vacancy Entry
    'vacancyEntries': 'ვაკანსიები',
    'totalVacancies': 'საერთო ვაკანსიები',
    'announcedVacancies': 'გამოცხადებული ვაკანსიები',
    'unfilledVacancies': 'შეუვსებელი ვაკანსიები',
    'employmentDuration': 'დასაქმების ხანგრძლივობა',
    'employmentDuration.underSixMonths': '6 თვემდე',
    'employmentDuration.fromSixMonthsToOneYear': '6 თვიდან 1 წლამდე',
    'employmentDuration.overOneYear': '1 წელზე მეტი',

    // Growth Plan
    'growthPlanEntries': 'ზრდის გეგმები',
    'oneYearGrowth': '1 წლის ზრდა',
    'fiveYearGrowth': '5 წლის ზრდა',

    // Reduction Plan
    'reductionPlanEntries': 'შემცირების გეგმები',
    'oneYearReduction': '1 წლის შემცირება',
    'fiveYearReduction': '5 წლის შემცირება',

    // Common
    'hrEntries': 'HR ჩანაწერები',
    'hasVacancies2025': 'ვაკანსიები 2025 წელს',
    'vacancies2025Count': 'ვაკანსიების რაოდენობა',
};

/**
 * ✅ Get clean field label from path (removes array indices)
 */
/**
 * ✅ Enhanced with item numbers
 */
const getFieldLabel = (path: (string | number)[]): string => {
    // Extract array index if exists
    let itemNumber: number | null = null;
    const cleanPath: string[] = [];

    for (const segment of path) {
        if (typeof segment === 'number') {
            itemNumber = segment + 1; // 0-indexed → 1-indexed
        } else {
            cleanPath.push(segment);
        }
    }

    // Try to find label
    for (let i = cleanPath.length; i > 0; i--) {
        const testPath = cleanPath.slice(-i).join('.');
        if (fieldLabels[testPath]) {
            const label = fieldLabels[testPath];
            // Add item number if in array
            return itemNumber !== null ? `${label} (#${itemNumber})` : label;
        }
    }

    const lastSegment = cleanPath[cleanPath.length - 1];
    const label = lastSegment && fieldLabels[lastSegment] ? fieldLabels[lastSegment] : lastSegment || 'ველი';
    return itemNumber !== null ? `${label} (#${itemNumber})` : label;
};

/**
 * ✅ Georgian error map
 */
export const georgianErrorMap: z.ZodErrorMap = (issue, ctx) => {
    const fieldLabel = getFieldLabel(issue.path);

    if (issue.code === z.ZodIssueCode.invalid_type) {
        if (issue.received === 'undefined' || issue.received === 'null') {
            return { message: `აუცილებელია: ${fieldLabel}` };
        }

        const typeMap: Record<string, string> = {
            string: 'ტექსტი',
            number: 'რიცხვი',
            boolean: 'ჭეშმარიტი/მცდარი',
            date: 'თარიღი',
            array: 'მასივი',
            object: 'ობიექტი',
        };

        const expectedType = typeMap[issue.expected] || issue.expected;
        return { message: `${fieldLabel}: უნდა იყოს ${expectedType}` };
    }

    if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.type === 'string') {
            if (issue.minimum === 1) {
                return { message: `აუცილებელია: ${fieldLabel}` };
            }
            return { message: `${fieldLabel}: მინიმუმ ${issue.minimum} სიმბოლო` };
        }

        if (issue.type === 'number') {
            return { message: `${fieldLabel}: უნდა იყოს ${issue.minimum} ან მეტი` };
        }

        if (issue.type === 'array') {
            return { message: `${fieldLabel}: მინიმუმ ${issue.minimum} ელემენტი` };
        }
    }

    if (issue.code === z.ZodIssueCode.too_big) {
        if (issue.type === 'string') {
            return { message: `${fieldLabel}: მაქსიმუმ ${issue.maximum} სიმბოლო` };
        }

        if (issue.type === 'number') {
            return { message: `${fieldLabel}: უნდა იყოს ${issue.maximum} ან ნაკლები` };
        }

        if (issue.type === 'array') {
            return { message: `${fieldLabel}: მაქსიმუმ ${issue.maximum} ელემენტი` };
        }
    }

    if (issue.code === z.ZodIssueCode.invalid_string) {
        const validationMap: Record<string, string> = {
            email: 'არასწორი ელ-ფოსტის ფორმატი',
            url: 'არასწორი URL',
            uuid: 'არასწორი UUID',
        };
        return {
            message: `${fieldLabel}: ${validationMap[issue.validation] || 'არასწორი ფორმატი'}`
        };
    }

    if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return {
            message: `${fieldLabel}: დასაშვები მნიშვნელობები - ${issue.options.join(', ')}`
        };
    }

    return { message: `${fieldLabel}: ${ctx.defaultError}` };
};
