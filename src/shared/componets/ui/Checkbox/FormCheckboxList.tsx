// components/Checkbox/FormCheckboxList.tsx
import React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';
import { FormCheckbox } from './FormCheckbox';

export interface CheckboxListItem<TForm extends FieldValues> {
    /** Field name */
    name: Path<TForm>;
    /** Label */
    label: React.ReactNode;
    /** Helper text */
    helperText?: string;
    /** Disabled */
    disabled?: boolean;
}

export interface FormCheckboxListProps<TForm extends FieldValues>
    extends Omit<CheckboxGroupProps, 'children'> {
    /** React Hook Form control */
    control: Control<TForm>;
    /** Checkbox items with explicit names */
    items: CheckboxListItem<TForm>[];
    /** onChange handler */
    onChange?: (name: Path<TForm>, checked: boolean) => void;
}

/**
 * ✅ FormCheckboxList - for independent checkboxes
 * Each item has its own field name (no prefix)
 */
export function FormCheckboxList<TForm extends FieldValues>({
    control,
    items,
    onChange,
    ...groupProps
}: FormCheckboxListProps<TForm>) {
    return (
        <CheckboxGroup {...groupProps}>
            {items.map((item) => (
                <FormCheckbox
                    key={String(item.name)}
                    name={item.name}
                    control={control}
                    label={item.label}
                    helperText={item.helperText}
                    disabled={item.disabled}
                    onChange={(checked) => onChange?.(item.name, checked)}
                />
            ))}
        </CheckboxGroup>
    );
}