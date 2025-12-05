import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    progress: number;
    currentStep: number;
    totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
                                                            progress,
                                                            currentStep,
                                                            totalSteps,
                                                        }) => {
    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <span className={styles.label}>პროგრესი</span>
                <span className={styles.percentage}>{progress}%</span>
            </div>

            <div className={styles.barContainer}>
                <div
                    className={styles.barFill}
                    style={{ width: `${progress}%` }}
                >
                    <div className={styles.barShimmer} />
                </div>
            </div>

            <div className={styles.stepInfo}>
                ნაბიჯი {currentStep} / {totalSteps}
            </div>
        </div>
    );
};