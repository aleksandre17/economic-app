// src/shared/components/SearchableSelect/RHFControllerSearchableSelect.tsx

import React from 'react';
import { useFormContext, Controller, FieldValues, Path } from 'react-hook-form';
import { SearchableSelect, SearchableSelectProps, SearchableSelectOption } from './SearchableSelect.tsx';

interface RHFControllerSearchableSelectProps<T extends FieldValues>
    extends Omit<SearchableSelectProps, 'value' | 'onChange' | 'name'> {
    name: Path<T>;
    rules?: Parameters<typeof Controller>[0]['rules'];
}

/**
 * SearchableSelect with built-in Controller
 *
 * No need to wrap with <Controller> - it's already integrated!
 * Automatically gets form context from nearest FormProvider
 *
 * @example
 * // Just use it directly - no Controller needed!
 * <RHFControllerSearchableSelect
 *   name="category"
 *   options={categories}
 *   label="კატეგორია"
 *   rules={{ required: 'აუცილებელია' }}
 * />
 *
 * @example
 * // Full form example
 * function MyForm() {
 *   const methods = useForm();
 *
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <RHFControllerSearchableSelect
 *           name="category"
 *           options={categories}
 *           rules={{ required: true }}
 *         />
 *       </form>
 *     </FormProvider>
 *   );
 * }
 */
export function RHFControllerSearchableSelect<T extends FieldValues>({
                                                                         name,
                                                                         rules,
                                                                         ...props
                                                                     }: RHFControllerSearchableSelectProps<T>) {
    const { control } = useFormContext<T>();

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <SearchableSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    error={fieldState.error?.message}
                    {...props}
                />
            )}
        />
    );
}