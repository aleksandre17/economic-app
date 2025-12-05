import React from 'react';
import { useStep2, type VacancyEntry } from '../../context/Step2Context';
import { EMPLOYMENT_DURATION_OPTIONS } from '../../../../../types/survey.types';
import styles from './VacanciesTable.module.css';

interface VacanciesTableProps {
    onEdit: (entry: VacancyEntry) => void;
}

export const VacanciesTable: React.FC<VacanciesTableProps> = ({ onEdit }) => {
    const { entries, deleteEntry } = useStep2();

    if (entries.length === 0) {
        return (
            <div className={styles.empty}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect x="8" y="16" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                    <path d="M8 24h48M20 16v8M44 16v8" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                </svg>
                <h3>ჯერ არ არის დამატებული ჩანაწერები</h3>
                <p>დააჭირეთ "დამატება" ღილაკს ჩანაწერის დასამატებლად</p>
            </div>
        );
    }

    const handleDelete = (id: string) => {
        if (window.confirm('დარწმუნებული ხართ რომ გსურთ ჩანაწერის წაშლა?')) {
            deleteEntry(id);
        }
    };

    const getDurationLabel = (value: string) => {
        const option = EMPLOYMENT_DURATION_OPTIONS.find((opt) => opt.value === value);
        return option?.label || value;
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>პროფესიული ჯგუფი</th>
                        <th>არსებული</th>
                        <th>გამოცხადებული</th>
                        <th>შეუვსებელი</th>
                        <th>ხანგრძლივობა</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {entries.map((entry) => (
                        <tr key={entry.id}>
                            <td className={styles.category}>{entry.category}</td>
                            <td className={styles.number}>{entry.totalVacancies}</td>
                            <td className={styles.number}>{entry.announcedVacancies}</td>
                            <td className={styles.number}>{entry.unfilledVacancies}</td>
                            <td className={styles.duration}>
                                {getDurationLabel(entry.employmentDuration)}
                            </td>
                            <td className={styles.actions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => onEdit(entry)}
                                    title="რედაქტირება"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M11.333 2A1.886 1.886 0 0114 4.667l-9 9-3.667.666.667-3.666 9-9z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(entry.id)}
                                    title="წაშლა"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M2 4h12M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1m2 0v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4h8z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>სულ ჩანაწერები:</span>
                    <span className={styles.summaryValue}>{entries.length}</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>სულ არსებული ვაკანსიები:</span>
                    <span className={styles.summaryValue}>
            {entries.reduce((sum, e) => sum + e.totalVacancies, 0)}
          </span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>სულ შეუვსებელი:</span>
                    <span className={styles.summaryValue}>
            {entries.reduce((sum, e) => sum + e.unfilledVacancies, 0)}
          </span>
                </div>
            </div>
        </div>
    );
};