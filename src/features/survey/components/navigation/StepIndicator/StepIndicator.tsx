import React from 'react';
import type {StepConfig} from '../../../types/survey.types';
import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
    steps: StepConfig[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
                                                                steps,
                                                                currentStep,
                                                                onStepClick,
                                                            }) => {
    return (
        <div className={styles.container}>
            {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isClickable = onStepClick && currentStep >= step.id;

                return (
                    <React.Fragment key={step.id}>
                        <div
                            className={`${styles.step} ${isActive ? styles.active : ''} ${
                                isCompleted ? styles.completed : ''
                            } ${isClickable ? styles.clickable : ''}`}
                            onClick={() => isClickable && onStepClick(step.id)}
                        >
                            <div className={styles.circle}>
                                {isCompleted ? (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M3 8l3 3 7-7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <span>{step.id}</span>
                                )}
                            </div>
                            <div className={styles.info}>
                                <div className={styles.title}>{step.title}</div>
                                <div className={styles.description}>{step.description}</div>
                            </div>
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={`${styles.connector} ${
                                    isCompleted ? styles.connectorCompleted : ''
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};