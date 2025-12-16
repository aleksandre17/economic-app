// components/Checkbox/FormCheckboxGroup.tsx
import React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';
import { FormCheckbox } from './FormCheckbox';

export interface CheckboxItem<T = any> {
    /** Unique value/id */
    value: string | number;
    /** Label text or JSX */
    label: React.ReactNode;
    /** Helper text */
    helperText?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Custom data */
    data?: T;
}

export interface FormCheckboxGroupProps<TForm extends FieldValues, TItem = any>
    extends Omit<CheckboxGroupProps, 'children'> {
    /** React Hook Form control */
    control: Control<TForm>;
    /** Base name for checkboxes */
    name?: string;
    /** Array of checkbox items */
    items: CheckboxItem<TItem>[];
    /** Custom onChange handler */
    onChange?: (item: CheckboxItem<TItem>, checked: boolean) => void;
    /** Custom render for each checkbox */
    renderItem?: (item: CheckboxItem<TItem>, index: number) => React.ReactNode;
}

/**
 * ✅ Dynamic CheckboxGroup - generates FormCheckbox from items
 */
export function FormCheckboxGroup<TForm extends FieldValues, TItem = any>({
    control,
    name = '',
    items,
    onChange,
    renderItem,
    ...groupProps
}: FormCheckboxGroupProps<TForm, TItem>) {
    return (
        <CheckboxGroup {...groupProps}>
            {items.map((item, index) => {
                // Custom render
                if (renderItem) {
                    return <React.Fragment key={item.value}>{renderItem(item, index)}</React.Fragment>;
                }

                // Default render
                const fieldName = name
                    ? `${name}.${item.value}` as Path<TForm>
                    : item.value as Path<TForm>;

                return (
                    <FormCheckbox
                        key={item.value}
                        name={fieldName}
                        control={control}
                        label={item.label}
                        helperText={item.helperText}
                        disabled={item.disabled}
                        onChange={(checked) => onChange?.(item, checked)}
                    />
                );
            })}
        </CheckboxGroup>
    );
}