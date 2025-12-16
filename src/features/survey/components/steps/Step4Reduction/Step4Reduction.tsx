// Step4Reduction.tsx
import React from 'react';

import { Card } from '@/shared/componets/ui/Card/Card';
import { Button } from '@/shared/componets/ui/Button/Button';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import { useForm } from 'react-hook-form';
import { ReductionTable } from './components/ReductionTable/ReductionTable';

import { zodResolver } from '@hookform/resolvers/zod';
import {Step4Data, step4Schema} from '@features/survey/schemas';
import type {ReductionPlanEntry} from '@features/survey/types/survey.types';
import {StepProps} from "@features/survey/utils/typeHelpers.ts";
import {REDUCTION_PLAN_ITEMS} from "@features/survey/constants";
import {FormCheckboxList} from "@/shared/componets/ui/Checkbox";

import styles from './Step4Reduction.module.css';

export const Step4Reduction: React.FC<StepProps<Step4Data, ReductionPlanEntry>> = ({ onOpenModal, onSubmit, onError }) => {

    const { formData, updateFormData } = useSurvey();
    const { handleSubmit, control, formState: { errors } } = useForm<Step4Data>({
        resolver: zodResolver(step4Schema),
        values: formData,
    });

    const planOneYearReduction = formData.planOneYearReduction;
    const planFiveYearReduction = formData.planFiveYearReduction;
    const entries = formData.reductionPlanEntries || [];

    const showReductionSection = planOneYearReduction || planFiveYearReduction;

    const handleEdit = (entry: ReductionPlanEntry) => {
        onOpenModal(entry);
    };

    const handleDelete = (id: string | number) => {
        if (!confirm('ნამდვილად გსურთ წაშლა?')) return;
        const filtered = entries.filter((e) => e.id !== id);
        updateFormData({ reductionPlanEntries: filtered });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit!, onError)} id="step-form">
            <Card>
                <div className={styles.header}>
                    <h2>დასაქმების შემცირების გეგმები</h2>
                    <p>აირჩიეთ დასაქმების შემცირების გეგმის პერიოდი</p>
                </div>

                <div className={styles.form}>

                    <FormCheckboxList
                        control={control}
                        items={REDUCTION_PLAN_ITEMS}
                        onChange={(name, checked) => {
                            updateFormData({ [name]: checked });
                        }}
                    />

                    {errors.reductionPlanEntries && (
                        <div className={styles.error}>{errors.reductionPlanEntries.message as string}</div>
                    )}

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
                                    <ReductionTable
                                        entries={entries}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        planOneYearReduction={planOneYearReduction}
                                        planFiveYearReduction={planFiveYearReduction}
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
                </div>
            </Card>
        </form>
    );
};