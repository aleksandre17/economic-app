import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/shared/componets/ui/Card/Card';
import { Button } from '@/shared/componets/ui/Button/Button';
import { EntriesTable } from './components/EntriesTable/EntriesTable';
import { useSurvey } from '@features/survey/context/surveyContext.tsx';
import {Step1Data, step1Schema} from '@features/survey/schemas';
import {HREntry} from '@features/survey/types/survey.types';
import styles from './Step1Personal.module.css';
import { StepProps } from "@features/survey/config";


/**
 * Step1Personal - For Option B (Global Navigation)
 *
 * ✅ No navigation inside
 * ✅ Clean component
 * ✅ Receives onOpenModal from parent
 * ✅ Updates context on every change
 */
export const Step1Personal: FC<StepProps<Step1Data, HREntry>> = ({
   onOpenModal,
   onSubmit,
   onError
}) => {
    // ═══════════════════════════════════════════════════════════
    const { formData, updateFormData } = useSurvey();
    const {
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        values: formData
    });

    // ═══════════════════════════════════════════════════════════
    // Handlers
    // ═══════════════════════════════════════════════════════════

    const handleEdit = (entry: HREntry) => {
        onOpenModal(entry);
    };

    const handleDelete = (id: string | number) => {
        if (!confirm('ნამდვილად გსურთ წაშლა?')) return;
        const filtered = formData.hrEntries?.filter((e) => e.id !== id);
        setValue('hrEntries', filtered);
        // ✅ Update context immediately
        updateFormData({ hrEntries: filtered });
    };

    // ═══════════════════════════════════════════════════════════
    // Render
    // ═══════════════════════════════════════════════════════════
    return (
        <form onSubmit={handleSubmit(onSubmit!, onError)} id="step-form">
            <Card>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h2>დასაქმებულთა მონაცემები</h2>
                        <p>დაამატეთ დასაქმებულთა რაოდენობა კატეგორიების მიხედვით</p>
                    </div>

                    {/* Add Button */}
                    <Button variant="primary" onClick={() => onOpenModal()} type="button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M10 4v12M4 10h12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        დამატება
                    </Button>
                </div>

                {/* Validation Error */}
                {errors.hrEntries && (
                    <div className={styles.error}>{errors.hrEntries.message as string}</div>
                )}

                {/* Entries Table */}
                <div className={styles.tableSection}>
                    <EntriesTable
                        entries={formData.hrEntries}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Info */}
                {formData.hrEntries && formData.hrEntries.length > 0 && (
                    <div className={styles.info}>
                        ✓ {formData.hrEntries.length} ჩანაწერი დამატებულია
                    </div>
                )}

                {/* No navigation here - handled by global navigation */}
            </Card>
        </form>
    );
};