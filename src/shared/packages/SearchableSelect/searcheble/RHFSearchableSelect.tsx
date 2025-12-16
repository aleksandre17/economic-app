// src/shared/components/SearchableSelect/RHFSearchableSelect.tsx

import React, { forwardRef } from 'react';
import { SearchableSelect, SearchableSelectProps, SearchableSelectOption } from './SearchableSelect.tsx';

interface RHFSearchableSelectProps extends Omit<SearchableSelectProps, 'onChange' | 'value'> {
    value?: string | number;
    onChange?: (event: { target: { name?: string; value: string | number } }) => void;
}

/**
 * React Hook Form compatible wrapper for SearchableSelect
 *
 * Works with {...register('fieldName')}
 * Converts SearchableSelect's onChange(value, option) to RHF's onChange(event)
 *
 * @example
 * // With register
 * <RHFSearchableSelect
 *   {...register('category', { required: 'Required' })}
 *   options={categories}
 *   error={errors.category?.message}
 * />
 *
 * @example
 * // Better: Use Controller instead (recommended)
 * <Controller
 *   name="category"
 *   control={control}
 *   render={({ field }) => (
 *     <SearchableSelect {...field} options={categories} />
 *   )}
 * />
 */
export const RHFSearchableSelect = forwardRef<HTMLInputElement, RHFSearchableSelectProps>(
    ({ onChange, value, name, onBlur, ...props }, ref) => {
        const handleChange = (newValue: string | number, option: SearchableSelectOption) => {
            // Convert to React Hook Form event format
            if (onChange) {
                onChange({
                    target: {
                        name,
                        value: newValue,
                    },
                });
            }
        };

        return (
            <SearchableSelect
                ref={ref}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                {...props}
            />
        );
    }
);

RHFSearchableSelect.displayName = 'RHFSearchableSelect';