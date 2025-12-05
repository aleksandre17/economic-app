import React, { useState } from 'react';
import { useStepNavigation } from '../../../hooks/useStepNavigation.tsx';
import { Step4Provider, useStep4, type ReductionPlanEntry } from './context/Step4Context';
import { Card } from '../../../../../shared/componets/ui/Card/Card';
import { Button } from '../../../../../shared/componets/ui/Button/Button';
import { StepNavigation } from '../../navigation/StepNavigation/StepNavigation';
import { AddReductionModal } from './components/AddReductionModal/AddReductionModal';
import { ReductionTable } from './components/ReductionTable/ReductionTable';
import styles from './Step4Reduction.module.css';

const Step4Content: React.FC = () => {
    const { goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = useStepNavigation();
    const {
        planOneYearReduction,
        planFiveYearReduction,
        setPlanOneYearReduction,
        setPlanFiveYearReduction,
        entries,
    } = useStep4();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<ReductionPlanEntry | null>(null);

    const showReductionSection = planOneYearReduction || planFiveYearReduction;

    const handleNext = () => {
        // თუ checkbox-ები checked-ია მაგრამ ჩანაწერები არ არის
        if (showReductionSection && entries.length === 0) {
            alert('გთხოვთ დაამატოთ მინიმუმ ერთი ჩანაწერი');
            return;
        }
        goToNextStep();
    };

    const handleAdd = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (entry: ReductionPlanEntry) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEntry(null);
    };

    return (
        <div className={styles.container}>
            <Card>
                <div className={styles.header}>
                    <h2>დასაქმების შემცირების გეგმები</h2>
                    <p>აირჩიეთ დასაქმების შემცირების გეგმის პერიოდი</p>
                </div>

                <div className={styles.form}>
                    {/* Checkbox 1 */}
                    <div className={styles.checkboxSection}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={planOneYearReduction}
                                onChange={(e) => setPlanOneYearReduction(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span>
                მომდევნო <strong>1 წლის</strong> განმავლობაში, აპირებთ თუ არა დასაქმებულთა
                რაოდენობის შემცირებას?
              </span>
                        </label>
                    </div>

                    {/* Checkbox 2 */}
                    <div className={styles.checkboxSection}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={planFiveYearReduction}
                                onChange={(e) => setPlanFiveYearReduction(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span>
                მომდევნო <strong>5 წლის</strong> განმავლობაში, აპირებთ თუ არა დასაქმებულთა
                რაოდენობის შემცირებას?
              </span>
                        </label>
                    </div>

                    {/* Conditional Section - თუ მინიმუმ ერთი checkbox checked-ია */}
                    {showReductionSection && (
                        <>
                            <div className={styles.divider} />

                            <div className={styles.reductionSection}>
                                <div className={styles.sectionHeader}>
                                    <div>
                                        <h3>პროფესიული ჯგუფები</h3>
                                        <p>
                                            დაასახელეთ პროფესიული ჯგუფი, რომელზეც მომდევნო{' '}
                                            {planOneYearReduction && planFiveYearReduction
                                                ? '1 და 5 წლის'
                                                : planOneYearReduction
                                                    ? '1 წლის'
                                                    : '5 წლის'}{' '}
                                            განმავლობაში იგეგმება დასაქმების შემცირება
                                        </p>
                                    </div>

                                    <Button variant="primary" onClick={handleAdd}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path
                                                d="M9 3.5v11M3.5 9h11"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        დამატება
                                    </Button>
                                </div>

                                <div className={styles.tableSection}>
                                    <ReductionTable onEdit={handleEdit} />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <StepNavigation
                    onBack={goToPreviousStep}
                    onNext={handleNext}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                />
            </Card>

            <AddReductionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editEntry={editingEntry}
            />
        </div>
    );
};

export const Step4Reduction: React.FC = () => {
    return (
        <Step4Provider>
            <Step4Content />
        </Step4Provider>
    );
};