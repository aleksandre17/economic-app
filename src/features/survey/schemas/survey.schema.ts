// features/survey/schemas/survey.schema.ts

import { z } from 'zod';
import { step1Schema } from './steps/step1.schema';
import { step2Schema } from './steps/step2.schema';
import { step3Schema } from './steps/step3.schema';
import { step4Schema } from './steps/step4.schema';

import {georgianErrorMap} from "@features/survey/schemas/errorMap.ts";
import {safeValidate, ValidationResult} from "@features/survey/schemas/utils/errorHandler.ts";

z.setErrorMap(georgianErrorMap)

/**
 * Full Survey Schema
 *
 * Combines all step schemas with comprehensive validation
 */
/**
 * Full Survey Schema
 *
 * Combines all step schemas using .extend() (merge is deprecated)
 */
export const surveySchema = step1Schema
    .safeExtend(step2Schema.shape)
    .safeExtend(step3Schema.shape)
    .safeExtend(step4Schema.shape);

export type Survey = z.infer<typeof surveySchema>;

/**
 * Validate specific step
 */
export const validateStep = (step: number, data: Partial<Survey>): ValidationResult => {
    const schemas = [step1Schema, step2Schema, step3Schema, step4Schema];
    const schema = schemas[step - 1];

    if (!schema) {
        return { success: true, errors: null };
    }

    return safeValidate(() => schema.parse(data));
};

/**
 * Validate full survey
 */
export const validateSurvey = (data: Partial<Survey>) => {
    return safeValidate(() => surveySchema.parse(data));
};

/**
 * Validate step and return typed data
 */
export const validateStepWithData = <T>(
    schema: z.ZodSchema<T>,
    data: unknown
): ValidationResult & { data?: T } => {
    return safeValidate(() => schema.parse(data));
};