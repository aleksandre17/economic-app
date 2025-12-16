import React from 'react';
import { Button } from '@/shared/componets/ui/Button/Button.tsx';
import styles from './StepNavigation.module.css';

interface StepNavigationProps {
    onBack?: () => void;
    onNext?: () => void;
    canNavigateNext: boolean;
    canNavigatePrevious: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    isSubmitting?: boolean;
    nextDisabled?: boolean;
    nextLabel?: string;
    // ✅ NEW: Optional features
    showStepCounter?: boolean;
    currentStep?: number;
    totalSteps?: number;
    fixed?: boolean; // Fixed at bottom
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
                                                                  onBack,
                                                                  onNext,
                                                                  canNavigateNext,
                                                                  canNavigatePrevious,
                                                                  isFirstStep,
                                                                  isLastStep,
                                                                  isSubmitting = false,
                                                                  nextDisabled = false,
                                                                  nextLabel,
                                                                  // ✅ NEW props with defaults
                                                                  showStepCounter = false,
                                                                  currentStep,
                                                                  totalSteps,
                                                                  fixed = false,
                                                              }) => {
    const containerClass = `${styles.container} ${fixed ? styles.fixed : ''}`;

    return (
        <div className={containerClass}>
            <div className={styles.buttons}>
                {/* Back Button */}
                {!isFirstStep && (
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onBack}
                        disabled={!canNavigatePrevious || isSubmitting}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: '4px' }}>
                            <path
                                d="M11 4.5l-4.5 4.5 4.5 4.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        უკან
                    </Button>
                )}

                {/* ✅ NEW: Step Counter (Optional) */}
                {showStepCounter && currentStep && totalSteps && (
                    <div className={styles.stepCounter}>
                        ნაბიჯი {currentStep} / {totalSteps}
                    </div>
                )}

                {/* Next Button */}
                <Button
                    onClick={onNext}
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={isSubmitting}
                    disabled={!canNavigateNext || isSubmitting}
                    fullWidth={isFirstStep}
                >
                    {nextLabel || (isLastStep ? (isSubmitting ? 'იტვირთება...' : 'გაგზავნა') : 'შემდეგი')}
                    {!isLastStep && (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginLeft: '4px' }}>
                            <path
                                d="M7 4.5l4.5 4.5L7 13.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </Button>
            </div>
        </div>
    );
};