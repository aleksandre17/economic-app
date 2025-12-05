import React, { useState } from 'react';
import { useStepNavigation } from '../../../hooks/useStepNavigation.tsx';
import { Step3Provider, useStep3, type GrowthPlanEntry } from './context/Step3Context';
import { Card } from '../../../../../shared/componets/ui/Card/Card';
import { Button } from '../../../../../shared/componets/ui/Button/Button';
import { StepNavigation } from '../../navigation/StepNavigation/StepNavigation';
import { AddGrowthModal } from './components/AddGrowthModal/AddGrowthModal';
import { GrowthTable } from './components/GrowthTable/GrowthTable';
import styles from './Step3Additional.module.css';

const Step3Content: React.FC = () => {
    const { goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = useStepNavigation();
    const {
        planOneYearGrowth,
        planFiveYearGrowth,
        setPlanOneYearGrowth,
        setPlanFiveYearGrowth,
        entries,
    } = useStep3();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<GrowthPlanEntry | null>(null);

    const showGrowthSection = planOneYearGrowth || planFiveYearGrowth;

    const handleNext = () => {
        // თუ checkbox-ები checked-ია მაგრამ ჩანაწერები არ არის
        if (showGrowthSection && entries.length === 0) {
            alert('გთხოვთ დაამატოთ მინიმუმ ერთი ჩანაწერი');
            return;
        }
        goToNextStep();
    };

    const handleAdd = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (entry: GrowthPlanEntry) => {
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
                    <h2>დასაქმების გეგმები</h2>
                    <p>აირჩიეთ დასაქმების ზრდის გეგმის პერიოდი</p>
                </div>

                <div className={styles.form}>
                    {/* Checkbox 1 */}
                    <div className={styles.checkboxSection}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={planOneYearGrowth}
                                onChange={(e) => setPlanOneYearGrowth(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span>
                მომდევნო <strong>1 წლის</strong> განმავლობაში, აპირებთ თუ არა დასაქმებულთა
                რაოდენობის გაზრდას?
              </span>
                        </label>
                    </div>

                    {/* Checkbox 2 */}
                    <div className={styles.checkboxSection}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={planFiveYearGrowth}
                                onChange={(e) => setPlanFiveYearGrowth(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span>
                მომდევნო <strong>5 წლის</strong> განმავლობაში, აპირებთ თუ არა დასაქმებულთა
                რაოდენობის გაზრდას?
              </span>
                        </label>
                    </div>

                    {/* Conditional Section - თუ მინიმუმ ერთი checkbox checked-ია */}
                    {showGrowthSection && (
                        <>
                            <div className={styles.divider} />

                            <div className={styles.growthSection}>
                                <div className={styles.sectionHeader}>
                                    <div>
                                        <h3>პროფესიული ჯგუფები</h3>
                                        <p>
                                            დაასახელეთ პროფესიული ჯგუფი, რომელზეც მომდევნო{' '}
                                            {planOneYearGrowth && planFiveYearGrowth
                                                ? '1 და 5 წლის'
                                                : planOneYearGrowth
                                                    ? '1 წლის'
                                                    : '5 წლის'}{' '}
                                            განმავლობაში იგეგმება დასაქმების ზრდა
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
                                    <GrowthTable onEdit={handleEdit} />
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

            <AddGrowthModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editEntry={editingEntry}
            />
        </div>
    );
};

export const Step3Additional: React.FC = () => {
    return (
        <Step3Provider>
            <Step3Content />
        </Step3Provider>
    );
};