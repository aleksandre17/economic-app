import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/componets/ui/Button/Button';
import { Input } from '@/shared/componets/ui/Input/Input';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import { hrEntrySchema } from '@features/survey/schemas';
import type { HREntry } from '@features/survey/types/survey.types';
import { useNotificationStore, NotificationType } from '@/shared/packages/notifications';
import {RHFControllerClassifierSelect} from "@/shared/packages/SearchableSelect";
import {CLASSIFIER_KEYS} from "@/shared/packages/classifiers";
import styles from './AddEntryModal.module.css';
import {schemaToEmptyTypedObjectDeep} from "@features/survey/utils";

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingEntry?: HREntry | null;
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, editingEntry }) => {
    const { formData, updateFormData } = useSurvey();
    const showNotifications = useNotificationStore((state) => state.showNotifications);

    const { register, handleSubmit, control, formState: { errors } } = useForm<HREntry>({
        resolver: zodResolver(hrEntrySchema),
        defaultValues: editingEntry || {...schemaToEmptyTypedObjectDeep(hrEntrySchema) }
    });


    const onSubmit = (data: HREntry) => {
        const currentEntries = formData.hrEntries || [];
        const updatedEntries = editingEntry?.id
            ? currentEntries.map((e) => (e.id === editingEntry.id ? data : e))
            : [...currentEntries, data];

        updateFormData({ hrEntries: updatedEntries });
        onClose();
    };

    const onError = (errors: any) => {
        const errorMessages: string[] = [];

        Object.keys(errors).forEach((key) => {
            const error = errors[key];
            if (error?.message) {
                errorMessages.push(error.message);
            }
        });

        if (errorMessages.length > 0) { showNotifications(errorMessages, NotificationType.ERROR, 6000);}
    };


    if (!isOpen) return null;

    // ═══════════════════════════════════════════════════════════
    // Render
    // ═══════════════════════════════════════════════════════════
    return (
        <div className={styles.overlay}> {/* onClick={onClose} */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>{editingEntry ? 'ჩანაწერის რედაქტირება' : 'ახალი ჩანაწერის დამატება'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
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

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit, onError)} className={styles.form}>
                    {/* კატეგორია */}
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

                    {/* რაოდენობა 2025 */}
                    <Input
                        type="number"
                        label="რაოდენობა 01.12.2025 მდგომარეობით"
                        error={errors.quantity2025?.message}
                        {...register('quantity2025', { valueAsNumber: true })}
                    />

                    {/* განათლების დონეები */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.groupLabel}>
                            განათლების დონე 01.12.2025 მდგომარეობით{' '}
                            <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.row}>
                            <Input
                                type="number"
                                label="საშუალო"

                                error={errors.educationLevels?.average?.message}
                                {...register('educationLevels.average', { valueAsNumber: true })}
                            />
                            <Input
                                type="number"
                                label="პროფესიული"

                                error={errors.educationLevels?.professional?.message}
                                {...register('educationLevels.professional', { valueAsNumber: true })}
                            />
                            <Input
                                type="number"
                                label="უმაღლესი"

                                error={errors.educationLevels?.higher?.message}
                                {...register('educationLevels.higher', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    {/* რაოდენობა 2024 */}
                    <Input
                        type="number"
                        label="რაოდენობა 01.12.2024 მდგომარეობით"

                        error={errors.quantity2024?.message}
                        placeholder="0"
                        fullWidth
                        {...register('quantity2024', { valueAsNumber: true })}
                    />

                    {/* საპენსიო ასაკი */}
                    <Input
                        type="number"
                        label="მომდევნო 5 წლის განმავლობაში საპენსიო ასაკის მქონე დასაქმებულთა რაოდენობა"
                        error={errors.retirementNextFiveYears?.message}
                        placeholder="0"
                        fullWidth

                        {...register('retirementNextFiveYears', { valueAsNumber: true })}
                    />

                    <Input
                        type="number"
                        label="მომდევნო 5 წლის განმავლობაში პენსიაზე გამსვლელთა სავარაუდო რაოდენობა"
                        error={errors.upcomingRetirements?.message}
                        placeholder="0"
                        fullWidth

                        {...register('upcomingRetirements', { valueAsNumber: true })}
                    />

                    {/* ღილაკები */}
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