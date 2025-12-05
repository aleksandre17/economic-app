import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';

export const useStepNavigation = () => {
    const { currentStep, setCurrentStep, totalSteps } = useSurvey();
    const navigate = useNavigate();

    const goToNextStep = useCallback(() => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/survey/success');
        }
    }, [currentStep, totalSteps, setCurrentStep, navigate]);

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

    const progress = Math.round((currentStep / totalSteps) * 100);

    return {
        currentStep,
        totalSteps,
        progress,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        isFirstStep: currentStep === 1,
        isLastStep: currentStep === totalSteps,
    };
};