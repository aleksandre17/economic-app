// AddVacancyModal.tsx
import React, {useMemo, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/componets/ui/Button/Button';
import { Input } from '@/shared/componets/ui/Input/Input';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import type { VacancyEntry } from '@features/survey/types/survey.types';
import styles from './AddVacancyModal.module.css';
import {vacancyEntrySchema} from "@features/survey/schemas";
import {schemaToEmptyTypedObjectDeep} from "@features/survey/utils";
import { useNotificationStore, NotificationType } from '@/shared/packages/notifications';
import {RHFControllerClassifierSelect} from "@/shared/packages/SearchableSelect";
import {CLASSIFIER_KEYS} from "@/shared/packages/classifiers";
import {v4 as uuid} from "uuid"; // ✅ Import

interface AddVacancyModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingEntry?: VacancyEntry | null;
}


const AddVacancyModalComponent: React.FC<AddVacancyModalProps> = ({ isOpen, onClose, editingEntry }) => {
    const { formData, updateFormData } = useSurvey();
    const generatedId = useMemo(() => editingEntry?.id || uuid().toString(), [editingEntry]);

    const showNotifications = useNotificationStore((state) => state.showNotifications);

    const { register, control, handleSubmit, formState: { errors } } = useForm<VacancyEntry>({
        resolver: zodResolver(vacancyEntrySchema),
        defaultValues: editingEntry || {...schemaToEmptyTypedObjectDeep(vacancyEntrySchema), id: generatedId }
    });

    const onSubmit = (data: VacancyEntry) => {
        const currentEntries = formData.vacancyEntries || [];
        const updatedEntries = editingEntry?.id
            ? currentEntries.map((e) => (e.id === editingEntry.id ? data : e))
            : [...currentEntries, data];

        updateFormData({ vacancyEntries: updatedEntries });
        showNotifications(editingEntry ? 'ჩანაწერი განახლდა' : 'ჩანაწერი დაემატა', NotificationType.SUCCESS, 3000);
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

    return (
        <div className={styles.overlay} > {/* onClick={onClose} */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{editingEntry ? 'ჩანაწერის რედაქტირება' : 'ვაკანსიის დამატება'}</h2>
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

                <form onSubmit={handleSubmit(onSubmit, onError)} className={styles.form}>

                    <div className={styles.field}>
                        <RHFControllerClassifierSelect
                            control={control}
                            name="category"
                            classifierKey={CLASSIFIER_KEYS.CATEGORIES}
                            rules={{ required: 'აუცილებელია' }}
                            label="კატეგორია"
                            error={errors.category?.message}
                            required
                            valueField="code"
                        />
                    </div>

                    <Input
                        label="არსებული ვაკანსიების რაოდენობა"
                        type="number"
                        error={errors.totalVacancies?.message}
                        {...register('totalVacancies', { valueAsNumber: true })}
                    />

                    <Input
                        label="გამოცხადებული ვაკანსიების რაოდენობა"
                        type="number"
                        error={errors.announcedVacancies?.message}
                        {...register('announcedVacancies', { valueAsNumber: true })}
                    />

                    <Input
                        label="გამოცხადებული ვაკანსიებიდან შეუვსებელი ვაკანსიების რაოდენობა"
                        type="number"
                        error={errors.unfilledVacancies?.message}
                        {...register('unfilledVacancies', { valueAsNumber: true })}
                    />

                    {/* ✅ NEW: დასაქმების ხანგრძლივობის breakdown */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            გამოცხადებულ ვაკანსიებზე დასაქმების სავარაუდო ხანგრძლივობა
                        </h3>

                        <Input
                            label="6 თვემდე"
                            type="number"
                            error={errors.employmentDuration?.underSixMonths?.message}
                            {...register('employmentDuration.underSixMonths', { valueAsNumber: true })}
                        />

                        <Input
                            label="6 თვიდან 1 წლამდე"
                            type="number"
                            error={errors.employmentDuration?.fromSixMonthsToOneYear?.message}
                            {...register('employmentDuration.fromSixMonthsToOneYear', { valueAsNumber: true })}
                        />

                        <Input
                            label="1 წელი და მეტი"
                            type="number"
                            error={errors.employmentDuration?.overOneYear?.message}
                            {...register('employmentDuration.overOneYear', { valueAsNumber: true })}
                        />

                        {/* Error for sum mismatch */}
                        {errors.employmentDuration?.root && (
                            <span className={styles.error}>
                                {errors.employmentDuration.root.message}
                            </span>
                        )}
                    </div>

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

// ✅ Export memoized component
export const AddVacancyModal = memo(AddVacancyModalComponent);