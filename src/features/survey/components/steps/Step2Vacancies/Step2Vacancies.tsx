import React, { useState } from 'react';
import { useStepNavigation } from '../../../hooks/useStepNavigation.tsx';
import { Step2Provider, useStep2, type VacancyEntry } from './context/Step2Context';
import { Card } from '../../../../../shared/componets/ui/Card/Card';
import { Button } from '../../../../../shared/componets/ui/Button/Button';
import { Input } from '../../../../../shared/componets/ui/Input/Input';
import { StepNavigation } from '../../navigation/StepNavigation/StepNavigation';
import { AddVacancyModal } from './components/AddVacancyModal/AddVacancyModal';
import { VacanciesTable } from './components/VacanciesTable/VacanciesTable';
import styles from './Step2Vacancies.module.css';

const Step2Content: React.FC = () => {
    const { goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = useStepNavigation();
    const {
        hasVacancies2025,
        vacancies2025Count,
        setHasVacancies2025,
        setVacancies2025Count,
        entries,
    } = useStep2();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<VacancyEntry | null>(null);

    // გამოჩნდება თუ დიახ + რაოდენობა მითითებული
    const showVacanciesSection = hasVacancies2025 && vacancies2025Count && vacancies2025Count > 0;

    const handleNext = () => {
        // თუ "დიახ" მაგრამ რაოდენობა არ არის
        if (hasVacancies2025 && !vacancies2025Count) {
            alert('გთხოვთ მიუთითოთ ვაკანსიების რაოდენობა');
            return;
        }

        // თუ რაოდენობა მითითებული მაგრამ ჩანაწერები არ არის
        if (showVacanciesSection && entries.length === 0) {
            alert('გთხოვთ დაამატოთ მინიმუმ ერთი ჩანაწერი');
            return;
        }

        goToNextStep();
    };

    const handleAdd = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (entry: VacancyEntry) => {
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
                    <h2>ინფორმაცია ვაკანსიების შესახებ</h2>
                    <p>გთხოვთ უპასუხოთ კითხვებს 2025 წლის ვაკანსიებთან დაკავშირებით</p>
                </div>

                <div className={styles.form}>
                    {/* კითხვა + რადიო ღილაკები */}
                    <div className={styles.questionSection}>
                        <label className={styles.questionLabel}>
                            2025 წლის პერიოდში გქონდათ თუ არა ვაკანსიები?{' '}
                            <span className={styles.required}>*</span>
                        </label>

                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="hasVacancies"
                                    value="yes"
                                    checked={hasVacancies2025 === true}
                                    onChange={() => setHasVacancies2025(true)}
                                    className={styles.radio}
                                />
                                <span>დიახ</span>
                            </label>

                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="hasVacancies"
                                    value="no"
                                    checked={hasVacancies2025 === false}
                                    onChange={() => setHasVacancies2025(false)}
                                    className={styles.radio}
                                />
                                <span>არა</span>
                            </label>
                        </div>
                    </div>

                    {/* თუ "დიახ" - რაოდენობის input */}
                    {hasVacancies2025 && (
                        <div className={styles.countSection}>
                            <Input
                                label="მიუთითეთ ვაკანსიების რაოდენობა"
                                type="number"
                                value={vacancies2025Count?.toString() || ''}
                                onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : undefined;
                                    setVacancies2025Count(value);
                                }}
                                placeholder="0"
                                required
                                fullWidth
                            />
                        </div>
                    )}

                    {/* თუ რაოდენობა მითითებული - დამატების სექცია */}
                    {showVacanciesSection && (
                        <>
                            <div className={styles.divider} />

                            <div className={styles.vacanciesSection}>
                                <div className={styles.sectionHeader}>
                                    <div>
                                        <h3>ვაკანსიების დეტალური ინფორმაცია</h3>
                                        <p>
                                            გთხოვთ 2025 წლის პერიოდში არსებულ ვაკანსიებთან დაკავშირებით
                                            მიუთითოთ ინფორმაცია
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
                                    <VacanciesTable onEdit={handleEdit} />
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

            <AddVacancyModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editEntry={editingEntry}
            />
        </div>
    );
};

export const Step2Vacancies: React.FC = () => {
    return (
        <Step2Provider>
            <Step2Content />
        </Step2Provider>
    );
};