// components/Checkbox/CheckboxGroup.tsx

import React from 'react';
import styles from './CheckboxGroup.module.css';

export interface CheckboxGroupProps {
    /** Group title */
    title?: string;
    /** Group description */
    description?: string;
    /** Required indicator on title */
    required?: boolean;
    /** Group-level error */
    error?: string;
    /** Child checkboxes */
    children: React.ReactNode;
    /** Additional CSS class */
    className?: string;
}

/**
 * Checkbox Group Container
 * 
 * Visual container for grouping related checkboxes with title and description.
 * 
 * @example
 * ```tsx
 * <CheckboxGroup
 *   title="Notification Settings"
 *   description="Choose your preferences"
 * >
 *   <FormCheckbox name="email" control={control} label="Email" />
 *   <FormCheckbox name="sms" control={control} label="SMS" />
 * </CheckboxGroup>
 * ```
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
