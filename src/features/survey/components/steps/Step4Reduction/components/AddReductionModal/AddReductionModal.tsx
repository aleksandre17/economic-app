// AddReductionModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/componets/ui/Button/Button';
import { Input } from '@/shared/componets/ui/Input/Input';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import type { ReductionPlanEntry } from '@features/survey/types/survey.types';
import styles from './AddReductionModal.module.css';
import {reductionPlanEntrySchema} from "@features/survey/schemas";
import {schemaToEmptyTypedObjectDeep} from "@features/survey/utils";
import {RHFControllerClassifierSelect} from "@/shared/packages/SearchableSelect";
import {CLASSIFIER_KEYS} from "@/shared/packages/classifiers";

interface AddReductionModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingEntry?: ReductionPlanEntry | null;
}

export const AddReductionModal: React.FC<AddReductionModalProps> = ({isOpen, onClose, editingEntry}) => {
    const { formData, updateFormData } = useSurvey();

    const planOneYearReduction = formData.planOneYearReduction;
    const planFiveYearReduction = formData.planFiveYearReduction;

    const { register, handleSubmit, control, formState: { errors } } = useForm<ReductionPlanEntry>({
        resolver: zodResolver(reductionPlanEntrySchema),
        defaultValues: editingEntry || {
            ...schemaToEmptyTypedObjectDeep(reductionPlanEntrySchema)
        },
    });

    const onSubmit = (data: ReductionPlanEntry) => {
        const currentEntries = formData.reductionPlanEntries || [];
        const updatedEntries = editingEntry?.id
            ? currentEntries.map((e) => (e.id === editingEntry.id ? data : e))
            : [...currentEntries, data];

        updateFormData({ reductionPlanEntries: updatedEntries });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}> {/* onClick={onClose} */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{editingEntry ? 'ჩანაწერის რედაქტირება' : 'შემცირების გეგმის დამატება'}</h2>
                    <button className={styles.closeButton} onClick={onClose} type="button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 6l12 12M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <input type="hidden" {...register('id')} />

                    <div className={styles.field}>
                        <RHFControllerClassifierSelect
                            control={control}
                            name="category"
                            classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                            rules={{ required: 'აუცილებელია' }}
                            label="პროფესიული ჯგუფი"
                            error={errors.category?.message}
                            required
                            valueField="code"
                        />
                    </div>

                    {planOneYearReduction && (
                        <Input
                            label="მომდევნო 1 წლის განმავლობაში თანამშრომელთა შემცირების მოსალოდნელი რაოდენობა"
                            type="number"
                            error={errors.oneYearReduction?.message}
                            fullWidth
                            {...register('oneYearReduction', { valueAsNumber: true })}
                        />
                    )}

                    {planFiveYearReduction && (
                        <Input
                            label="მომდევნო 5 წლის განმავლობაში თანამშრომელთა შემცირების მოსალოდნელი რაოდენობა"
                            type="number"
                            error={errors.fiveYearReduction?.message}
                            fullWidth
                            {...register('fiveYearReduction', { valueAsNumber: true })}
                        />
                    )}

                    <div className={styles.actions}>
                        <Button variant="outline" onClick={onClose} type="button">
                            გაუქმება
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingEntry ? 'შენახვა' : 'დამატება'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};