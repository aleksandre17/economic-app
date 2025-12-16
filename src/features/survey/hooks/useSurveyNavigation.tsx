import {TOTAL_STEPS, useSurveyStore} from '../store/SurveyFormStore.ts';
import { useStepValidation } from './useStepValidation';
import { useSurvey } from '../context/surveyContext.tsx';
import { useCallback } from 'react';
import { type StepNumber} from "@features/survey/config";

interface NavigationHandlers {
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (step: number) => void;
    canNavigateNext: boolean;
    canNavigatePrevious: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    currentStepValidation: { isValid: boolean; errors: string[] };
}

export const useSurveyNavigation = () => {
    const { currentStep, setCurrentStep, totalSteps = TOTAL_STEPS } = useSurvey();
    const currentStepValidation = useStepValidation(currentStep);
    const store = useSurveyStore();

    const isFirstStep = currentStep === 1;
    const goToNextStep = useCallback(() => {
        if (!currentStepValidation.isValid) {
            console.warn('Cannot navigate: current step is invalid');
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep, totalSteps, setCurrentStep, currentStepValidation.isValid]);

    const goToPreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep, setCurrentStep]);


    const goToStep = useCallback((step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [totalSteps, setCurrentStep]);


    return {
        currentStep: (store.currentStep as StepNumber),
        totalSteps: TOTAL_STEPS,
        setCurrentStep: store.setCurrentStep,
        goToNextStep: goToNextStep,
        goToPreviousStep: goToPreviousStep,
        goToStep: goToStep,
        canNavigateNext: true, // currentStepValidation.isValid, // && !isLastStep
        canNavigatePrevious: !isFirstStep,
        isFirstStep: () => store.currentStep === 1,
        isLastStep: () => store.currentStep === TOTAL_STEPS,
        getProgress: () => Math.round((store.currentStep / TOTAL_STEPS) * 100),
    };
};