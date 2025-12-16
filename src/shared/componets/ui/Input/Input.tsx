import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    variant?: 'small' | 'medium' | 'large';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
         label,
         error,
         helperText,
         fullWidth,
         variant = 'medium',
         className,
         required,
         ...props
     }, ref) => {
        const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

        const wrapperClasses = [
            styles.inputWrapper,
            fullWidth && styles.fullWidth,
            variant !== 'medium' && styles[variant],
        ].filter(Boolean).join(' ');

        const inputClasses = [
            styles.input,
            error && styles.error,
            className,
        ].filter(Boolean).join(' ');

        return (
            <div className={wrapperClasses}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={inputClasses}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : helperText
                                ? `${inputId}-helper`
                                : undefined
                    }
                    required={required}
                    {...props}
                />

                {error && (<span id={`${inputId}-error`} className={styles.errorText} role="alert">{error}</span>)}

                {!error && helperText && (<span id={`${inputId}-helper`} className={styles.helperText}>{helperText}</span>)}
            </div>
        );
    }
);

Input.displayName = 'Input';