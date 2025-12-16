// features/survey/schemas/index.ts

/**
 * Survey Schemas - Complete Export
 *
 * Centralized export for all survey-related schemas, types, and validators.
 * This is the single entry point for consuming survey schema functionality.
 *
 * @example
 * ```typescript
 * import {
 *   step1Schema,
 *   validateStep,
 *   checkDuplicateCategories
 * } from '@features/survey/schemas';
 * ```
 */

// ============================================
// Primitives - Reusable field definitions
// ============================================
export {
    idField,
    categoryField,
    booleanField,
    nonNegativeInt,
    percentageField,
} from './primitives';

// ============================================
// Validators - Reusable validation functions
// ============================================
export {
    // Duplicate validation
    checkDuplicateCategories,
    validateUniqueCategories,

    // Sum validation
    validateSum,
    validateEducationSum,
    validateDurationSum,

    // Range validation
    validateNotExceeds,
    validateGreaterOrEqual,
} from './validators';

// ============================================
// Entry Schemas - Individual record types
// ============================================
export {
    hrEntrySchema,
    vacancyEntrySchema,
    growthPlanEntrySchema,
    reductionPlanEntrySchema,
    type HREntry,
    type VacancyEntry,
    type GrowthPlanEntry,
    type ReductionPlanEntry,
} from './entries';

// ============================================
// Step Schemas - Multi-step form validation
// ============================================
export {
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema,
    type Step1Data,
    type Step2Data,
    type Step3Data,
    type Step4Data,
} from './steps';

// ============================================
// Survey Schema - Complete form validation
// ============================================
export {
    surveySchema,
    validateStep,
    validateSurvey,
    type Survey,
} from './survey.schema';


export {
    formatZodError,
    handleValidationError,
    safeValidate,
    type ValidationError,
    type ValidationResult,
} from './utils';

// ============================================
// Error Handling
// ============================================
export { georgianErrorMap } from './errorMap';