// features/survey/schemas/utils/errorHandler.ts

import { z } from 'zod';

export interface ValidationError {
    path: string;
    message: string;
}

export interface ValidationResult {
    success: boolean;
    errors: ValidationError[] | null;
}

/**
 * Format Zod error to validation result
 */
export const formatZodError = (error: z.ZodError): ValidationError[] => {
    return error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
    }));
};

/**
 * Handle validation error safely
 */
export const handleValidationError = (error: unknown): ValidationResult => {
    if (error instanceof z.ZodError) {
        return {
            success: false,
            errors: formatZodError(error),
        };
    }

    if (error instanceof Error) {
        return {
            success: false,
            errors: [
                {
                    path: 'unknown',
                    message: error.message,
                },
            ],
        };
    }

    return {
        success: false,
        errors: [
            {
                path: 'unknown',
                message: 'Validation failed',
            },
        ],
    };
};

/**
 * Safe validation wrapper
 */
export const safeValidate = <T>(
    validator: () => T
): ValidationResult & { data?: T } => {
    try {
        const data = validator();
        return { success: true, errors: null, data };
    } catch (error) {
        return handleValidationError(error);
    }
};