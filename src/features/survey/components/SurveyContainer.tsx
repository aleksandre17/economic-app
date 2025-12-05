import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import { useStepNavigation } from '../hooks/useStepNavigation.tsx';
import { ProgressBar } from './navigation/ProgressBar/ProgressBar';
import { StepIndicator } from './navigation/StepIndicator/StepIndicator';
import { Step1Personal } from './steps/Step1Personal/Step1Personal';
import { Step2Vacancies } from './steps/Step2Vacancies/Step2Vacancies';
import { Step3Additional } from './steps/Step3Additional/Step3Additional';
import { Step4Reduction } from './steps/Step4Reduction/Step4Reduction';
import { Step5Review } from './steps/Step5Review/Step5Review';
import styles from './SurveyContainer.module.css';

const STEPS = [
    { id: 1, title: 'HR მონაცემები', description: 'დასაქმებულთა რაოდენობა' },
    { id: 2, title: 'ვაკანსიები', description: 'ვაკანსიების ინფორმაცია' },
    { id: 3, title: 'ზრდის გეგმები', description: 'დასაქმების ზრდა' },
    { id: 4, title: 'შემცირების გეგმები', description: 'დასაქმების შემცირება' },
    { id: 5, title: 'გადახედვა', description: 'საბოლოო შემოწმება' },
];

export const SurveyContainer: React.FC = () => {


    const { currentStep, isLoading } = useSurvey();
    const { progress, totalSteps, goToStep } = useStepNavigation();

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Personal />;
            case 2:
                return <Step2Vacancies />;
            case 3:
                return <Step3Additional />;
            case 4:
                return <Step4Reduction />;
            case 5:
                return <Step5Review />;
            default:
                return <Step1Personal />;
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>იტვირთება...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.surveyWrapper}>
            {/* Blue Gradient Banner - Short */}


            {/* White Controls Section - Progress & Steps */}
            <div className={styles.controlsSection}>
                <div className={styles.container}>
                    <ProgressBar
                        progress={progress}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />

                    <StepIndicator
                        steps={STEPS}
                        currentStep={currentStep}
                        onStepClick={goToStep}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className={styles.content}>
                <div className={styles.container}>
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};