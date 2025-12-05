import React, { useState, useEffect } from 'react';
import { useStep2, type VacancyEntry } from '../../context/Step2Context';
import { CATEGORIES, EMPLOYMENT_DURATION_OPTIONS } from '../../../../../types/survey.types';
import { Button } from '../../../../../../../shared/componets/ui/Button/Button';
import { Input } from '../../../../../../../shared/componets/ui/Input/Input';
import styles from './AddVacancyModal.module.css';

interface AddVacancyModalProps {
    isOpen: boolean;
    onClose: () => void;
    editEntry?: VacancyEntry | null;
}

export const AddVacancyModal: React.FC<AddVacancyModalProps> = ({
                                                                    isOpen,
                                                                    onClose,
                                                                    editEntry,
                                                                }) => {
    const { addEntry, updateEntry } = useStep2();

    const [formData, setFormData] = useState({
        category: '',
        totalVacancies: '',
        announcedVacancies: '',
        unfilledVacancies: '',
        employmentDuration: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load edit data
    useEffect(() => {
        if (editEntry) {
            setFormData({
                category: editEntry.category,
                totalVacancies: editEntry.totalVacancies.toString(),
                announcedVacancies: editEntry.announcedVacancies.toString(),
                unfilledVacancies: editEntry.unfilledVacancies.toString(),
                employmentDuration: editEntry.employmentDuration,
            });
        } else {
            setFormData({
                category: '',
                totalVacancies: '',
                announcedVacancies: '',
                unfilledVacancies: '',
                employmentDuration: '',
            });
        }
        setErrors({});
    }, [editEntry, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.category) {
            newErrors.category = 'კატეგორია სავალდებულოა';
        }

        if (!formData.totalVacancies) {
            newErrors.totalVacancies = 'არსებული ვაკანსიების რაოდენობა სავალდებულოა';
        }

        if (!formData.announcedVacancies) {
            newErrors.announcedVacancies = 'გამოცხადებული ვაკანსიების რაოდენობა სავალდებულოა';
        }

        if (!formData.unfilledVacancies) {
            newErrors.unfilledVacancies = 'შეუვსებელი ვაკანსიების რაოდენობა სავალდებულოა';
        }

        if (!formData.employmentDuration) {
            newErrors.employmentDuration = 'დასაქმების ხანგრძლივობა სავალდებულოა';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const entryData: Omit<VacancyEntry, 'id'> = {
            category: formData.category,
            totalVacancies: Number(formData.totalVacancies),
            announcedVacancies: Number(formData.announcedVacancies),
            unfilledVacancies: Number(formData.unfilledVacancies),
            employmentDuration: formData.employmentDuration as any,
        };

        if (editEntry) {
            updateEntry(editEntry.id, entryData);
        } else {
            addEntry(entryData);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>
                        {editEntry ? 'ჩანაწერის რედაქტირება' : 'ვაკანსიის დამატება'}
                    </h2>
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

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* კატეგორია */}
                    <div className={styles.field}>
                        <label htmlFor="category" className={styles.label}>
                            პროფესიული ჯგუფი <span className={styles.required}>*</span>
                        </label>
                        <select
                            id="category"
                            className={styles.select}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="">აირჩიეთ კატეგორია</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category && <span className={styles.error}>{errors.category}</span>}
                    </div>

                    {/* არსებული ვაკანსიების რაოდენობა */}
                    <Input
                        label="არსებული ვაკანსიების რაოდენობა"
                        type="number"
                        value={formData.totalVacancies}
                        onChange={(e) => setFormData({ ...formData, totalVacancies: e.target.value })}
                        error={errors.totalVacancies}
                        placeholder="0"
                        required
                        fullWidth
                    />

                    {/* გამოცხადებული ვაკანსიების რაოდენობა */}
                    <Input
                        label="გამოცხადებული ვაკანსიების რაოდენობა"
                        type="number"
                        value={formData.announcedVacancies}
                        onChange={(e) =>
                            setFormData({ ...formData, announcedVacancies: e.target.value })
                        }
                        error={errors.announcedVacancies}
                        placeholder="0"
                        required
                        fullWidth
                    />

                    {/* შეუვსებელი ვაკანსიების რაოდენობა */}
                    <Input
                        label="გამოცხადებული ვაკანსიებიდან შეუვსებელი ვაკანსიების რაოდენობა"
                        type="number"
                        value={formData.unfilledVacancies}
                        onChange={(e) =>
                            setFormData({ ...formData, unfilledVacancies: e.target.value })
                        }
                        error={errors.unfilledVacancies}
                        placeholder="0"
                        required
                        fullWidth
                    />

                    {/* დასაქმების ხანგრძლივობა */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            გამოცხადებულ ვაკანსიებზე დასაქმების სავარაუდო ხანგრძლივობა{' '}
                            <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.radioGroup}>
                            {EMPLOYMENT_DURATION_OPTIONS.map((option) => (
                                <label key={option.value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="employmentDuration"
                                        value={option.value}
                                        checked={formData.employmentDuration === option.value}
                                        onChange={(e) =>
                                            setFormData({ ...formData, employmentDuration: e.target.value })
                                        }
                                        className={styles.radio}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.employmentDuration && (
                            <span className={styles.error}>{errors.employmentDuration}</span>
                        )}
                    </div>

                    {/* ღილაკები */}
                    <div className={styles.actions}>
                        <Button variant="outline" onClick={onClose} type="button">
                            გაუქმება
                        </Button>
                        <Button variant="primary" type="submit">
                            {editEntry ? 'შენახვა' : 'დამატება'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};