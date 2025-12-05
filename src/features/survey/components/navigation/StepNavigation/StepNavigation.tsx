import React from 'react';
import { Button } from '../../../../../shared/componets/ui/Button/Button';
import styles from './StepNavigation.module.css';

interface StepNavigationProps {
    onBack?: () => void;
    onNext?: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    isSubmitting?: boolean;
    nextDisabled?: boolean;
    nextLabel?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
                                                                  onBack,
                                                                  onNext,
                                                                  isFirstStep,
                                                                  isLastStep,
                                                                  isSubmitting = false,
                                                                  nextDisabled = false,
                                                                  nextLabel,
                                                              }) => {
    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                {!isFirstStep && (
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onBack}
                        disabled={isSubmitting}
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

                <Button
                    variant="primary"
                    size="md"
                    onClick={onNext}
                    loading={isSubmitting}
                    disabled={nextDisabled || isSubmitting}
                    fullWidth={isFirstStep}
                >
                    {nextLabel || (isLastStep ? 'გაგზავნა' : 'შემდეგი')}
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