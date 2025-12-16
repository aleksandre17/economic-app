// components/Checkbox/FormCheckbox.tsx

import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Checkbox, CheckboxProps } from './Checkbox';

export interface FormCheckboxProps<T extends FieldValues> 
    extends Omit<CheckboxProps, 'name' | 'checked' | 'onChange' | 'onBlur' | 'error'> {
    /** Field name (type-safe) */
    name: Path<T>;
    /** React Hook Form control */
    control: Control<T>;
    /** Custom change handler */
    onChange?: (checked: boolean) => void;
}

/**
 * React Hook Form Integrated Checkbox
 * 
 * Automatically handles form state, validation, and errors.
 * 
 * @example
 * ```tsx
 * <FormCheckbox
 *   name="acceptTerms"
 *   control={control}
 *   label="Accept terms and conditions"
 *   required
 * />
 * ```
 */
export function FormCheckbox<T extends FieldValues>({
    name,
    control,
    onChange: customOnChange,
    ...checkboxProps
}: FormCheckboxProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Checkbox
                    {...checkboxProps}
                    name={field.name}
                    checked={field.value ?? false}
                    error={fieldState.error?.message}
                    onChange={(checked) => {
                        field.onChange(checked);
                        customOnChange?.(checked);
                    }}
                    onBlur={field.onBlur}
                />
            )}
        />
    );
}
