import React, { useState } from 'react';
import { useStepNavigation } from '../../../hooks/useStepNavigation.tsx';
import { Step1Provider, useStep1, type HREntry } from './context/Step1Context';
import { Card } from '../../../../../shared/componets/ui/Card/Card';
import { Button } from '../../../../../shared/componets/ui/Button/Button';
import { StepNavigation } from '../../navigation/StepNavigation/StepNavigation';
import { AddEntryModal } from './components/AddEntryModal/AddEntryModal';
import { EntriesTable } from './components/EntriesTable/EntriesTable';
import styles from './Step1Personal.module.css';

const Step1Content: React.FC = () => {
    const { goToNextStep, isFirstStep, isLastStep } = useStepNavigation();
    const { entries } = useStep1();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<HREntry | null>(null);

    const handleNext = () => {
        if (entries.length === 0) {
            alert('გთხოვთ დაამატოთ მინიმუმ ერთი ჩანაწერი');
            return;
        }
        goToNextStep();
    };

    const handleAdd = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (entry: HREntry) => {
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
                    <div>
                        <h2>დასაქმებულთა მონაცემები</h2>
                        <p>დაამატეთ დასაქმებულთა რაოდენობა კატეგორიების მიხედვით</p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleAdd}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M10 4v12M4 10h12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        დამატება
                    </Button>
                </div>

                <div className={styles.tableSection}>
                    <EntriesTable onEdit={handleEdit} />
                </div>

                <StepNavigation
                    onNext={handleNext}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    nextDisabled={entries.length === 0}
                />
            </Card>

            <AddEntryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editEntry={editingEntry}
            />
        </div>
    );
};

export const Step1Personal: React.FC = () => {
    return (
        <Step1Provider>
            <Step1Content />
        </Step1Provider>
    );
};