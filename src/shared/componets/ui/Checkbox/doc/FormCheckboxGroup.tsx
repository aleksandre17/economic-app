// components/Checkbox/FormCheckboxGroup.tsx

import React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';
import { FormCheckbox } from './FormCheckbox';

export interface CheckboxItem<T = any> {
    /** Field value/name */
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
    /** Base name (empty string for root-level fields) */
    name?: string;
    /** Checkbox items */
    items: CheckboxItem<TItem>[];
    /** Custom change handler */
    onChange?: (item: CheckboxItem<TItem>, checked: boolean) => void;
    /** Custom render function */
    renderItem?: (item: CheckboxItem<TItem>, index: number) => React.ReactNode;
}

/**
 * Dynamic Checkbox Group with React Hook Form
 * 
 * Generates checkboxes from an array of items.
 * 
 * @example
 * ```tsx
 * const items = [
 *   { value: 'opt1', label: 'Option 1' },
 *   { value: 'opt2', label: 'Option 2' },
 * ];
 * 
 * <FormCheckboxGroup
 *   control={control}
 *   name=""
 *   items={items}
 *   title="Select Options"
 * />
 * ```
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
                if (renderItem) {
                    return <React.Fragment key={item.value}>{renderItem(item, index)}</React.Fragment>;
                }

                const fieldName = name 
                    ? `${name}.${item.value}` as Path<TForm>
                    : String(item.value) as Path<TForm>;

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
