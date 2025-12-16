// Step3Additional.tsx
import React from 'react';
import { Card } from '@/shared/componets/ui/Card/Card';
import { Button } from '@/shared/componets/ui/Button/Button';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Step3Data, step3Schema} from '@features/survey/schemas';
import { GrowthTable } from './components/GrowthTable/GrowthTable';
import type {GrowthPlanEntry} from '@features/survey/types/survey.types';
import styles from './Step3Additional.module.css';
import {StepProps} from "@features/survey/utils/typeHelpers.ts";
import {FormCheckboxList} from "@/shared/componets/ui/Checkbox";
import {GROWTH_PLAN_ITEMS} from "@features/survey/constants";


export const Step3Additional: React.FC<StepProps<Step3Data, GrowthPlanEntry>> = ({ onOpenModal, onSubmit, onError }) => {
    const { formData, updateFormData } = useSurvey();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        values: formData,
    });

    const planOneYearGrowth = formData.planOneYearGrowth;
    const planFiveYearGrowth = formData.planFiveYearGrowth;
    const entries = formData.growthPlanEntries || [];

    const showGrowthSection = planOneYearGrowth || planFiveYearGrowth;

    const handleEdit = (entry: GrowthPlanEntry) => {
        onOpenModal(entry);
    };

    const handleDelete = (id: string | number) => {
        if (!confirm('ნამდვილად გსურთ წაშლა?')) return;
        const filtered = entries.filter((e) => e.id !== id);
        updateFormData({ growthPlanEntries: filtered });
    };


    return (
        <form onSubmit={handleSubmit(onSubmit!, onError)} id="step-form">
            <Card>
                <div className={styles.header}>
                    <h2>დასაქმების გეგმები</h2>
                    <p>აირჩიეთ დასაქმების ზრდის გეგმის პერიოდი</p>
                </div>

                <div className={styles.form}>

                    <FormCheckboxList
                        control={control}
                        items={GROWTH_PLAN_ITEMS}
                        onChange={(name, checked) => {
                            updateFormData({ [name]: checked });
                        }}
                    />

                    {errors.growthPlanEntries && (
                        <div className={styles.error}>{errors.growthPlanEntries.message as string}</div>
                    )}

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
                                    <GrowthTable
                                        entries={entries}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        planOneYearGrowth={planOneYearGrowth}
                                        planFiveYearGrowth={planFiveYearGrowth}
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