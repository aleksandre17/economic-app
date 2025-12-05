import React, { useState, useEffect } from 'react';
import { useStep3, type GrowthPlanEntry } from '../../context/Step3Context';
import { CATEGORIES } from '../../../../../types/survey.types';
import { Button } from '../../../../../../../shared/componets/ui/Button/Button';
import { Input } from '../../../../../../../shared/componets/ui/Input/Input';
import styles from './AddGrowthModal.module.css';

interface AddGrowthModalProps {
    isOpen: boolean;
    onClose: () => void;
    editEntry?: GrowthPlanEntry | null;
}

export const AddGrowthModal: React.FC<AddGrowthModalProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  editEntry,
                                                              }) => {
    const { planOneYearGrowth, planFiveYearGrowth, addEntry, updateEntry } = useStep3();

    const [formData, setFormData] = useState({
        category: '',
        oneYearGrowth: '',
        fiveYearGrowth: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load edit data
    useEffect(() => {
        if (editEntry) {
            setFormData({
                category: editEntry.category,
                oneYearGrowth: editEntry.oneYearGrowth?.toString() || '',
                fiveYearGrowth: editEntry.fiveYearGrowth?.toString() || '',
            });
        } else {
            setFormData({
                category: '',
                oneYearGrowth: '',
                fiveYearGrowth: '',
            });
        }
        setErrors({});
    }, [editEntry, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.category) {
            newErrors.category = 'კატეგორია სავალდებულოა';
        }

        if (planOneYearGrowth && !formData.oneYearGrowth) {
            newErrors.oneYearGrowth = 'გთხოვთ მიუთითოთ 1 წლის ზრდა';
        }

        if (planFiveYearGrowth && !formData.fiveYearGrowth) {
            newErrors.fiveYearGrowth = 'გთხოვთ მიუთითოთ 5 წლის ზრდა';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const entryData: Omit<GrowthPlanEntry, 'id'> = {
            category: formData.category,
            oneYearGrowth: planOneYearGrowth && formData.oneYearGrowth
                ? Number(formData.oneYearGrowth)
                : undefined,
            fiveYearGrowth: planFiveYearGrowth && formData.fiveYearGrowth
                ? Number(formData.fiveYearGrowth)
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
                        {editEntry ? 'ჩანაწერის რედაქტირება' : 'დასაქმების გეგმის დამატება'}
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

                    {/* 1 წლის ზრდა - conditional */}
                    {planOneYearGrowth && (
                        <Input
                            label="მომდევნო 1 წლის განმავლობაში თანამშრომელთა ზრდის მოსალოდნელი რაოდენობა"
                            type="number"
                            value={formData.oneYearGrowth}
                            onChange={(e) =>
                                setFormData({ ...formData, oneYearGrowth: e.target.value })
                            }
                            error={errors.oneYearGrowth}
                            placeholder="0"
                            required
                            fullWidth
                        />
                    )}

                    {/* 5 წლის ზრდა - conditional */}
                    {planFiveYearGrowth && (
                        <Input
                            label="მომდევნო 5 წლის განმავლობაში თანამშრომელთა ზრდის მოსალოდნელი რაოდენობა"
                            type="number"
                            value={formData.fiveYearGrowth}
                            onChange={(e) =>
                                setFormData({ ...formData, fiveYearGrowth: e.target.value })
                            }
                            error={errors.fiveYearGrowth}
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