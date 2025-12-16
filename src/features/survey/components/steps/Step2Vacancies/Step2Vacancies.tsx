// Step2Vacancies.tsx
import React from 'react';
import { Card } from '@/shared/componets/ui/Card/Card';
import { Button } from '@/shared/componets/ui/Button/Button';
import { Input } from '@/shared/componets/ui/Input/Input';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import { useForm  } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Step2Data, step2Schema} from '@features/survey/schemas';
import { VacanciesTable } from './components/VacanciesTable/VacanciesTable';
import type {VacancyEntry} from '@features/survey/types/survey.types';
import TrueFalseRadio from "@/shared/componets/ui/TrueFalseRadio/TrueFalseRadio.tsx";
import {StepProps} from "@features/survey/config";

import styles from './Step2Vacancies.module.css';


export const Step2Vacancies: React.FC<StepProps<Step2Data, VacancyEntry>> = ({
    onOpenModal,
    onSubmit,
    onError
}) => {
    const { formData, updateFormData, updateField } = useSurvey();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        values: formData,
    });

    const hasVacancies2025 = formData.hasVacancies2025;
    const vacancies2025Count = formData.vacancies2025Count;
    const entries = formData.vacancyEntries || [];

    const showVacanciesSection = hasVacancies2025 && vacancies2025Count && vacancies2025Count > 0;

    const handleEdit = (entry: VacancyEntry) => {
        onOpenModal(entry);
    };

    const handleDelete = (id: string | number) => {
        if (!confirm('ნამდვილად გსურთ წაშლა?')) return;
        const filtered = entries.filter((e) => e.id !== id);
        updateFormData({ vacancyEntries: filtered });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit!, onError)} id="step-form">
            <Card>
                <div className={styles.header}>
                    <h2>ინფორმაცია ვაკანსიების შესახებ</h2>
                    <p>გთხოვთ უპასუხოთ კითხვებს 2025 წლის ვაკანსიებთან დაკავშირებით</p>
                </div>

                <div className={styles.form}>

                    <TrueFalseRadio
                        name="hasVacancies2025"
                        control={control}
                        label="2025 წლის პერიოდში გქონდათ თუ არა ვაკანსიები?"
                        required={true}
                        error={errors.hasVacancies2025?.message}
                        onValueChange={(v) => {
                            updateField('hasVacancies2025', v!);
                        }}
                    />

                    {formData.hasVacancies2025 && (
                        <div className={styles.countSection}>
                            <Input
                                label="მიუთითეთ ვაკანსიების რაოდენობა"
                                type="number"
                                fullWidth
                                error={errors.vacancies2025Count?.message}
                                {...register('vacancies2025Count', {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                        const value = e.target.value ? Number(e.target.value) : undefined;
                                        updateFormData({ vacancies2025Count: value });
                                    }
                                })}
                            />
                        </div>
                    )}

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

                                    <Button variant="primary" onClick={() => onOpenModal()} type="button">
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
                                    <VacanciesTable
                                        entries={entries}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                </div>

                                {entries.length > 0 && (
                                    <div className={styles.info}>
                                        ✓ {entries.length} ჩანაწერი დამატებულია
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {errors.vacancyEntries && (
                        <div className={styles.error}>{errors.vacancyEntries.message as string}</div>
                    )}

                </div>
            </Card>
        </form>
    );
};