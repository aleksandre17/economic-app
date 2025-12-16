import { Controller } from "react-hook-form";
import styles from "./TrueFalseRadio.module.css";
import {useCallback} from "react";

interface Props {
    name: string;
    control: any;

    // Label
    label?: string;
    required?: boolean;

    // Radio options
    labelTrue?: string;
    labelFalse?: string;

    // Callbacks
    onValueChange?: (value: boolean | null) => void;
    onUncheckConfirm?: () => Promise<boolean>;
    uncheckMessage?: string;

    // Validation
    error?: string;

    // Styling
    className?: string;
    disabled?: boolean;
}

export default function TrueFalseRadio({
   name,
   control,
   label,
   required = false,
   labelTrue = "დიახ",
   labelFalse = "არა",
   onValueChange,
   onUncheckConfirm,
   uncheckMessage = "ნამდვილად გინდათ გაუქმება? შესაძლოა წაიშალოს მონაცემები.",
   error,
   className,
   disabled = false,
}: Props) {
    const handleRadioClick = useCallback(async (
        currentValue: boolean | null,
        clickedValue: boolean,
        onChange: (value: boolean | null) => void
    ) => {
        if (currentValue && !clickedValue) {
            const confirmed = onUncheckConfirm ? await onUncheckConfirm() : window.confirm(uncheckMessage);
            if (confirmed) {
                // გაუქმება - დააყენე null
                onChange(clickedValue);
                onValueChange?.(clickedValue);
            }
        } else {
            onChange(clickedValue);
            onValueChange?.(clickedValue);
        }
    }, [onUncheckConfirm, uncheckMessage, onValueChange]);

    return (
        <div className={`${styles.questionSection} ${className || ''}`}>
            {/* Label */}
            {label && (
                <label className={styles.questionLabel}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            {/* Radio Group */}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className={styles.radioGroup}>
                        {/* TRUE */}
                        <label className={`${styles.radioLabel} ${disabled ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                value="true"
                                className={styles.radio}
                                checked={field.value === true}
                                disabled={disabled}
                                onChange={() => handleRadioClick(field.value, true, field.onChange)}
                            />
                            <span>{labelTrue}</span>
                        </label>

                        {/* FALSE */}
                        <label className={`${styles.radioLabel} ${disabled ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                value="false"
                                className={styles.radio}
                                checked={field.value === false}
                                disabled={disabled}
                                onChange={() => handleRadioClick(field.value, false, field.onChange)}
                            />
                            <span>{labelFalse}</span>
                        </label>
                    </div>
                )}
            />

            {/* Error Message */}
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
}
