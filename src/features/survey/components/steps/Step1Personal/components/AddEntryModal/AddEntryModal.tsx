import React, { useState, useEffect } from 'react';
import { useStep1, type HREntry } from '../../context/Step1Context';
import { CATEGORIES } from '../../../../../types/survey.types';
import { Button } from '../../../../../../../shared/componets/ui/Button/Button';
import { Input } from '../../../../../../../shared/componets/ui/Input/Input';
import styles from './AddEntryModal.module.css';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    editEntry?: HREntry | null;
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, editEntry }) => {
    const { addEntry, updateEntry } = useStep1();

    const [formData, setFormData] = useState({
        category: '',
        quantity2025: '',
        average: '',
        professional: '',
        higher: '',
        quantity2024: '',
        retirementNextFiveYears: '',
        upcomingRetirements: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load edit data
    useEffect(() => {
        if (editEntry) {
            setFormData({
                category: editEntry.category,
                quantity2025: editEntry.quantity2025.toString(),
                average: editEntry.educationLevels.average.toString(),
                professional: editEntry.educationLevels.professional.toString(),
                higher: editEntry.educationLevels.higher.toString(),
                quantity2024: editEntry.quantity2024.toString(),
                retirementNextFiveYears: editEntry.retirementNextFiveYears.toString(),
                upcomingRetirements: editEntry.upcomingRetirements.toString(),
            });
        } else {
            setFormData({
                category: '',
                quantity2025: '',
                average: '',
                professional: '',
                higher: '',
                quantity2024: '',
                retirementNextFiveYears: '',
                upcomingRetirements: ''
            });
        }
        setErrors({});
    }, [editEntry, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.category) {
            newErrors.category = 'კატეგორია სავალდებულოა';
        }

        if (!formData.quantity2025) {
            newErrors.quantity2025 = 'რაოდენობა სავალდებულოა';
        }

        if (!formData.average || !formData.professional || !formData.higher) {
            newErrors.educationLevels = 'ყველა განათლების დონე სავალდებულოა';
        }

        if (!formData.quantity2024) {
            newErrors.quantity2024 = 'რაოდენობა სავალდებულოა';
        }

        if (!formData.retirementNextFiveYears) {
            newErrors.retirementNextFiveYears = 'საპენსიო მონაცემები სავალდებულოა';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const entryData = {
            category: formData.category,
            quantity2025: Number(formData.quantity2025),
            educationLevels: {
                average: Number(formData.average),
                professional: Number(formData.professional),
                higher: Number(formData.higher),
            },
            quantity2024: Number(formData.quantity2024),
            retirementNextFiveYears: Number(formData.retirementNextFiveYears),
            upcomingRetirements: Number(formData.upcomingRetirements),
        };

        if (editEntry) {
            // Update existing entry
            updateEntry(editEntry.id, entryData);
        } else {
            // Add new entry
            addEntry(entryData);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{editEntry ? 'ჩანაწერის რედაქტირება' : 'ახალი ჩანაწერის დამატება'}</h2>
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
                            კატეგორია <span className={styles.required}>*</span>
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

                    {/* რაოდენობა 2025 */}
                    <Input
                        label="რაოდენობა 01.12.2025 მდგომარეობით"
                        type="number"
                        value={formData.quantity2025}
                        onChange={(e) => setFormData({ ...formData, quantity2025: e.target.value })}
                        error={errors.quantity2025}
                        placeholder="0"
                        required
                        fullWidth
                    />

                    {/* განათლების დონეები */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.groupLabel}>
                            განათლების დონე 01.12.2025 მდგომარეობით <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.row}>
                            <Input
                                label="საშუალო"
                                type="number"
                                value={formData.average}
                                onChange={(e) => setFormData({ ...formData, average: e.target.value })}
                                placeholder="0"
                                fullWidth
                            />
                            <Input
                                label="პროფესიული"
                                type="number"
                                value={formData.professional}
                                onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
                                placeholder="0"
                                fullWidth
                            />
                            <Input
                                label="უმაღლესი"
                                type="number"
                                value={formData.higher}
                                onChange={(e) => setFormData({ ...formData, higher: e.target.value })}
                                placeholder="0"
                                fullWidth
                            />
                        </div>
                        {errors.educationLevels && (
                            <span className={styles.error}>{errors.educationLevels}</span>
                        )}
                    </div>

                    {/* რაოდენობა 2024 */}
                    <Input
                        label="რაოდენობა 01.12.2024 მდგომარეობით"
                        type="number"
                        value={formData.quantity2024}
                        onChange={(e) => setFormData({ ...formData, quantity2024: e.target.value })}
                        error={errors.quantity2024}
                        placeholder="0"
                        required
                        fullWidth
                    />

                    {/* საპენსიო ასაკი */}
                    <Input
                        label="მომდევნო 5 წლის განმავლობაში საპენსიო ასაკის მქონე დასაქმებულთა რაოდენობა"
                        type="number"
                        value={formData.retirementNextFiveYears}
                        onChange={(e) =>
                            setFormData({ ...formData, retirementNextFiveYears: e.target.value })
                        }
                        error={errors.retirementNextFiveYears}
                        placeholder="0"
                        required
                        fullWidth
                    />

                    <Input
                        label="მომდევნო 5 წლის განმავლობაში პენსიაზე გამსვლელთა სავარაუდო რაოდენობა"
                        type="number"
                        value={formData.upcomingRetirements}
                        onChange={(e) =>
                            setFormData({ ...formData, upcomingRetirements: e.target.value })
                        }
                        error={errors.upcomingRetirements}
                        placeholder="0"
                        required
                        fullWidth
                    />

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