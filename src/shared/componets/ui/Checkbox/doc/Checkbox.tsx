// components/Checkbox/Checkbox.tsx

import React from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
    /** Checkbox ID */
    id?: string;
    /** Field name */
    name?: string;
    /** Controlled checked state */
    checked?: boolean;
    /** Uncontrolled default state */
    defaultChecked?: boolean;
    /** Label text or JSX */
    label?: React.ReactNode;
    /** Required indicator */
    required?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
    /** Additional CSS class */
    className?: string;
    /** Change handler */
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Blur handler */
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Base Checkbox Component
 * 
 * A professional checkbox component with custom styling using native HTML input.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms"
 *   checked={isChecked}
 *   onChange={(checked) => setIsChecked(checked)}
 * />
 * ```
 */
export const Checkbox: React.FC<CheckboxProps> = ({
    id,
    name,
    checked,
    defaultChecked,
    label,
    required = false,
    disabled = false,
    error,
    helperText,
    className,
    onChange,
    onBlur,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked, e);
    };

    const checkboxId = id || `checkbox-${name || Math.random()}`;
    const isControlled = checked !== undefined;
    const checkedValue = checked ?? false;

    return (
        <div className={`${styles.checkboxWrapper} ${className || ''}`}>
            <div 
                className={`${styles.checkboxSection} ${disabled ? styles.disabled : ''} ${error ? styles.hasError : ''}`}
            >
                <label 
                    htmlFor={checkboxId}
                    className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''}`}
                >
                    <input
                        id={checkboxId}
                        type="checkbox"
                        name={name}
                        className={styles.checkbox}
                        {...(isControlled 
                            ? { checked: checkedValue } 
                            : { defaultChecked }
                        )}
                        required={required}
                        disabled={disabled}
                        onChange={handleChange}
                        onBlur={onBlur}
                    />
                    
                    {label && (
                        <span className={styles.labelText}>
                            {label}
                            {required && <span className={styles.required}>*</span>}
                        </span>
                    )}
                </label>

                {helperText && !error && (
                    <div className={styles.helperText}>{helperText}</div>
                )}
            </div>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}
        </div>
    );
};
