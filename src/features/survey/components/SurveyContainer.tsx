import React from 'react';
import { useSurvey } from '../context/surveyContext.tsx';
import { useSurveyNavigation } from '../hooks/useSurveyNavigation';
import { ProgressBar } from './navigation/ProgressBar/ProgressBar';
import { StepIndicator } from './navigation/StepIndicator/StepIndicator';
import { StepNavigation } from './navigation/StepNavigation/StepNavigation';
import { getStepConfig, type StepNumber} from '../config';
import { useModalManager } from '../hooks/useModalManager.tsx';
import {NotificationType, useNotificationStore} from "@/shared/packages/notifications";
import styles from './SurveyContainer.module.css';
import {collectErrorMessages} from "@features/survey/utils";
import {STEP_METADATA_ARRAY} from "@features/survey/config/stepMetadata.ts";


/**
 * Option B: Global Navigation at Bottom
 *
 * ✅ Consistent navigation
 * ✅ Always visible (fixed)
 * ✅ Cleaner step components
 * ✅ Better UX on mobile
 */
export const SurveyContainer: React.FC = () => {

    // ═══════════════════════════════════════════════════════════
    // Context & Navigation
    // ═══════════════════════════════════════════════════════════
    const { isLoading, isSubmitting } = useSurvey();
    const navigation = useSurveyNavigation();
    const notifications = useNotificationStore((state) => state.showNotifications);
    const modal = useModalManager();

    const stepConfig = getStepConfig(navigation.currentStep);
    const StepComponent = stepConfig.component;
    const StepModal = stepConfig.modal;

    if (!stepConfig) { return <div>Invalid step</div>;}

    // ═══════════════════════════════════════════════════════════
    // Event Handlers
    // ═══════════════════════════════════════════════════════════
    // Trigger form validation and navigate
    const handleNavigateNext = () => {
        const form = document.getElementById('step-form') as HTMLFormElement;

        if (form) {
            // Let form validation handle it
            form.requestSubmit();
        } else {
            // Direct navigation (no form)
            navigation.goToNextStep();
        }
    };

    // Generic submit handler
    const handleStepSubmit = (_: any) => {
        navigation.goToNextStep();
    };

    const handleStepError  = (errors: any) => {
        const allMessages = collectErrorMessages(errors);
        console.log('Form Errors:', allMessages);

        if (allMessages.length > 0) {
            notifications(allMessages, NotificationType.ERROR, 6000);
        }
    };

    if (!stepConfig) {
        return <div>Invalid step</div>;
    }

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

            {/* Progress & Step Indicator */}
            <div className={styles.controlsSection}>
                <div className={styles.container}>
                    <ProgressBar
                        progress={navigation.getProgress()}
                        currentStep={navigation.currentStep}
                        totalSteps={navigation.totalSteps}
                    />

                    <StepIndicator
                        steps={STEP_METADATA_ARRAY}
                        currentStep={navigation.currentStep}
                        onStepClick={navigation.goToStep}
                    />
                </div>
            </div>

            {/* Steps */}
            <div className={styles.content}>
                <div className={styles.container}>
                    <StepComponent onOpenModal={modal.openModal} onSubmit={handleStepSubmit} onError={handleStepError} />
                </div>
            </div>

            {/* Global Navigation */}
            <div className={styles.navigationWrapper}>
                <div className={styles.container}>
                    <StepNavigation
                        onBack={navigation.goToPreviousStep}
                        onNext={handleNavigateNext}
                        canNavigateNext={navigation.canNavigateNext}
                        canNavigatePrevious={navigation.canNavigatePrevious}
                        isFirstStep={navigation.isFirstStep()}
                        isLastStep={navigation.isLastStep()}
                        showStepCounter
                        isSubmitting={isSubmitting} // Disable during submission
                        currentStep={navigation.currentStep}
                        totalSteps={navigation.totalSteps}
                        fixed // ✅ Fixed at bottom
                    />
                </div>
            </div>

            {/* ✅ Modal - Render directly in JSX */}
            {modal.isOpen && StepModal && (
                <StepModal
                    isOpen={modal.isOpen}
                    onClose={modal.closeModal}
                    entry={modal.entry}
                />
            )}
        </div>
    );
};