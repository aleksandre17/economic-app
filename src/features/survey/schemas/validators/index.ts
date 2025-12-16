// features/survey/schemas/validators/index.ts

/**
 * Validation utilities for survey schemas
 *
 * This module exports reusable validation functions that can be used
 * across different schema definitions to ensure consistency and DRY principle.
 */

// ✅ Duplicate category validation
export {
    checkDuplicateCategories,
    validateUniqueCategories,
} from './duplicateCategories';

// ✅ Sum validation utilities
export {
    validateSum,
    validateEducationSum,
    validateDurationSum,
} from './sumValidation';

// ✅ Range and comparison validation
export {
    validateNotExceeds,
    validateGreaterOrEqual,
} from './rangeValidation';