import React, { useState, useEffect } from 'react';
import { useStep4, type ReductionPlanEntry } from '../../context/Step4Context';
import { CATEGORIES } from '../../../../../types/survey.types.ts';
import { Button } from '../../../../../../../shared/componets/ui/Button/Button';
import { Input } from '../../../../../../../shared/componets/ui/Input/Input';
import styles from './AddReductionModal.module.css';

interface AddReductionModalProps {
    isOpen: boolean;
    onClose: () => void;
    editEntry?: ReductionPlanEntry | null;
}

export const AddReductionModal: React.FC<AddReductionModalProps> = ({
                                                                        isOpen,
                                                                        onClose,
                                                                        editEntry,
                                                                    }) => {
    const { planOneYearReduction, planFiveYearReduction, addEntry, updateEntry } = useStep4();

    const [formData, setFormData] = useState({
        category: '',
        oneYearReduction: '',
        fiveYearReduction: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load edit data
    useEffect(() => {
        if (editEntry) {
            setFormData({
                category: editEntry.category,
                oneYearReduction: editEntry.oneYearReduction?.toString() || '',
                fiveYearReduction: editEntry.fiveYearReduction?.toString() || '',
            });
        } else {
            setFormData({
                category: '',
                oneYearReduction: '',
                fiveYearReduction: '',
            });
        }
        setErrors({});
    }, [editEntry, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.category) {
            newErrors.category = 'კატეგორია სავალდებულოა';
        }

        if (planOneYearReduction && !formData.oneYearReduction) {
            newErrors.oneYearReduction = 'გთხოვთ მიუთითოთ 1 წლის შემცირება';
        }

        if (planFiveYearReduction && !formData.fiveYearReduction) {
            newErrors.fiveYearReduction = 'გთხოვთ მიუთითოთ 5 წლის შემცირება';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const entryData: Omit<ReductionPlanEntry, 'id'> = {
            category: formData.category,
            oneYearReduction: planOneYearReduction && formData.oneYearReduction
                ? Number(formData.oneYearReduction)
                : undefined,
            fiveYearReduction: planFiveYearReduction && formData.fiveYearReduction
                ? Number(formData.fiveYearReduction)
                : undefined,
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
                        {editEntry ? 'ჩანაწერის რედაქტირება' : 'შემცირების გეგმის დამატება'}
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

                    {/* 1 წლის შემცირება - conditional */}
                    {planOneYearReduction && (
                        <Input
                            label="მომდევნო 1 წლის განმავლობაში თანამშრომელთა შემცირების მოსალოდნელი რაოდენობა"
                            type="number"
                            value={formData.oneYearReduction}
                            onChange={(e) =>
                                setFormData({ ...formData, oneYearReduction: e.target.value })
                            }
                            error={errors.oneYearReduction}
                            placeholder="0"
                            required
                            fullWidth
                        />
                    )}

                    {/* 5 წლის შემცირება - conditional */}
                    {planFiveYearReduction && (
                        <Input
                            label="მომდევნო 5 წლის განმავლობაში თანამშრომელთა შემცირების მოსალოდნელი რაოდენობა"
                            type="number"
                            value={formData.fiveYearReduction}
                            onChange={(e) =>
                                setFormData({ ...formData, fiveYearReduction: e.target.value })
                            }
                            error={errors.fiveYearReduction}
                            placeholder="0"
                            required
                            fullWidth
                        />
                    )}

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