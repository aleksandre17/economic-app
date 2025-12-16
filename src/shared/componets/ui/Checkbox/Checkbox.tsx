// components/Checkbox/Checkbox.tsx
import React from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
    /** Unique identifier */
    id?: string;
    /** Checkbox name */
    name?: string;
    /** Checked state */
    checked?: boolean;
    /** Default checked (uncontrolled) */
    defaultChecked?: boolean;
    /** Label text or JSX */
    label?: React.ReactNode;
    /** Required field */
    required?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
    /** Custom className */
    className?: string;
    /** Change handler */
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Blur handler */
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * ✅ Base Checkbox Component
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

    const checkboxId = id || `checkbox-${name}`;

    return (
        <div className={`${styles.checkboxWrapper} ${className || ''}`}>
            <label
                htmlFor={checkboxId}
                className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''} ${error ? styles.hasError : ''}`}
            >
                <input
                    id={checkboxId}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    required={required}
                    disabled={disabled}
                    className={styles.checkbox}
                    onChange={handleChange}
                    onBlur={onBlur}
                />

                {/* Custom checkbox visual */}
                <span className={styles.checkboxIcon}>
                    <svg viewBox="0 0 16 16" className={styles.checkmark}>
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </span>

                {label && (
                    <span className={styles.labelText}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </span>
                )}
            </label>

            {/* Helper text */}
            {helperText && !error && (
                <div className={styles.helperText}>{helperText}</div>
            )}

            {/* Error message */}
            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}
        </div>
    );
};