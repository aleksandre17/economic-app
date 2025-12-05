import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, fullWidth, className, required, ...props }, ref) => {
        const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
                    aria-invalid={error ? 'true' : 'false'}
                    required={required}
                    {...props}
                />

                {error && (
                    <span className={styles.errorText}>{error}</span>
                )}

                {!error && helperText && (
                    <span className={styles.helperText}>{helperText}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';