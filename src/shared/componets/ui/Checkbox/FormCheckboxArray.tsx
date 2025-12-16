// components/Checkbox/FormCheckboxArray.tsx
import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';
import { Checkbox } from './Checkbox';

export interface CheckboxOption<T = any> {
    /** Option value */
    value: string | number;
    /** Option label */
    label: React.ReactNode;
    /** Helper text */
    helperText?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Custom data */
    data?: T;
}

export interface FormCheckboxArrayProps<TForm extends FieldValues, TOption = any>
    extends Omit<CheckboxGroupProps, 'children'> {
    /** React Hook Form control */
    control: Control<TForm>;
    /** Field name (array field) */
    name: Path<TForm>;
    /** Available options */
    options: CheckboxOption<TOption>[];
    /** Custom onChange */
    onChange?: (selectedValues: (string | number)[], option: CheckboxOption<TOption>, checked: boolean) => void;
}

/**
 * ✅ Checkbox Array - stores selected values in array
 * @example
 * // Form data: { skills: [1, 3, 5] }
 * <FormCheckboxArray
 *   name="skills"
 *   control={control}
 *   options={[
 *     { value: 1, label: 'JavaScript' },
 *     { value: 2, label: 'TypeScript' },
 *     { value: 3, label: 'React' }
 *   ]}
 * />
 */
export function FormCheckboxArray<TForm extends FieldValues, TOption = any>({
    control,
    name,
    options,
    onChange,
    ...groupProps
}: FormCheckboxArrayProps<TForm, TOption>) {
    const { field, fieldState } = useController({ control, name });

    const selectedValues = (field.value || []) as (string | number)[];

    const handleChange = (option: CheckboxOption<TOption>, checked: boolean) => {
        let newValues: (string | number)[];

        if (checked) {
            // Add value
            newValues = [...selectedValues, option.value];
        } else {
            // Remove value
            newValues = selectedValues.filter(v => v !== option.value);
        }

        field.onChange(newValues);
        onChange?.(newValues, option, checked);
    };

    return (
        <CheckboxGroup {...groupProps} error={fieldState.error?.message}>
            {options.map((option) => (
                <Checkbox
                    key={option.value}
                    name={`${name}.${option.value}`}
                    checked={selectedValues.includes(option.value)}
                    label={option.label}
                    helperText={option.helperText}
                    disabled={option.disabled}
                    onChange={(checked) => handleChange(option, checked)}
                    onBlur={field.onBlur}
                />
            ))}
        </CheckboxGroup>
    );
}