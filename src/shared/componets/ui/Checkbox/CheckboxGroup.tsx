// components/Checkbox/CheckboxGroup.tsx
import React from 'react';
import styles from './CheckboxGroup.module.css';

export interface CheckboxGroupProps {
    /** Group title */
    title?: string;
    /** Group description */
    description?: string;
    /** Required indicator */
    required?: boolean;
    /** Error message for entire group */
    error?: string;
    /** Children (Checkbox components) */
    children: React.ReactNode;
    /** Custom className */
    className?: string;
}

/**
 * ✅ Checkbox Group Component
 */
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    title,
    description,
    required,
    error,
    children,
    className,
}) => {
    return (
        <div className={`${styles.checkboxGroup} ${className || ''}`}>
            {(title || description) && (
                <div className={styles.groupHeader}>
                    {title && (
                        <h3 className={styles.groupTitle}>
                            {title}
                            {required && <span className={styles.required}>*</span>}
                        </h3>
                    )}
                    {description && (
                        <p className={styles.groupDescription}>{description}</p>
                    )}
                </div>
            )}

            <div className={styles.groupContent}>
                {children}
            </div>

            {error && (
                <div className={styles.groupError}>{error}</div>
            )}
        </div>
    );
};