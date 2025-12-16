// components/Checkbox/FormCheckbox.tsx
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Checkbox, CheckboxProps } from './Checkbox';

export interface FormCheckboxProps<T extends FieldValues> extends Omit<CheckboxProps, 'name' | 'checked' | 'onChange' | 'onBlur' | 'error'> {
    /** Field name (type-safe) */
    name: Path<T>;
    /** React Hook Form control */
    control: Control<T>;
    /** Custom onChange (receives checked value) */
    onChange?: (checked: boolean) => void;
}

/**
 * ✅ Form-integrated Checkbox Component
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
                    checked={field.value}
                    error={fieldState.error?.message}
                    onChange={(checked, event) => {
                        field.onChange(checked);
                        customOnChange?.(checked);
                    }}
                    onBlur={field.onBlur}
                />
            )}
        />
    );
}