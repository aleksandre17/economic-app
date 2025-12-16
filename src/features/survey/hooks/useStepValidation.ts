// features/survey/hooks/useStepValidation.ts
import { useMemo } from 'react';
import { useSurvey } from '../context/surveyContext.tsx';
import {
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema, surveySchema
} from '../schemas';

interface StepValidationResult {
    isValid: boolean;
    errors: string[];
}

const STEP_SCHEMAS = {
    1: step1Schema,
    2: step2Schema,
    3: step3Schema,
    4: step4Schema,
    5: surveySchema
} as const;

/**
 * Hook for validating individual steps
 * Memoized for performance
 */
export const useStepValidation = (step: number): StepValidationResult => {
    const { formData } = useSurvey();

    return useMemo(() => {
        // Step 5 (Review) has no validation
        if (step === 5) {
            return { isValid: true, errors: [] };
        }

        const schema = STEP_SCHEMAS[step as keyof typeof STEP_SCHEMAS];

        if (!schema) {
            return { isValid: false, errors: ['Invalid step'] };
        }

        try {
            schema.parse(formData);
            return { isValid: true, errors: [] };
        } catch (error: any) {
            const errors = error.errors?.map((err: any) =>
                `${err.path.join('.')}: ${err.message}`
            ) || ['Validation failed'];

            return { isValid: false, errors };
        }
    }, [formData, step]);
};