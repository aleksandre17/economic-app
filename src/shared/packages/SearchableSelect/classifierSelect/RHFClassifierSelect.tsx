// src/shared/components/SearchableSelect/RHFClassifierSelect.tsx

import React, { forwardRef } from 'react';
import { RHFSearchableSelect } from '../searcheble/RHFSearchableSelect.tsx';
import { useClassifier } from '@/shared/packages/classifiers';
import { SearchableSelectOption } from '../searcheble/SearchableSelect.tsx';

interface RHFClassifierSelectProps extends Omit<React.ComponentProps<typeof RHFSearchableSelect>, 'options'> {
    classifierKey: string;
    autoLoad?: boolean;
}

/**
 * React Hook Form compatible classifierSelect
 *
 * Works with {...register('fieldName')}
 * Automatically loads classifier data
 *
 * @example
 * // With register
 * <RHFClassifierSelect
 *   {...register('category', { required: 'Required' })}
 *   classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *   error={errors.category?.message}
 *   label="კატეგორია"
 * />
 *
 * @example
 * // Better: Use Controller with classifierSelect (recommended)
 * <Controller
 *   name="category"
 *   control={control}
 *   render={({ field }) => (
 *     <classifierSelect
 *       classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *       {...field}
 *     />
 *   )}
 * />
 */
export const RHFClassifierSelect = forwardRef<HTMLInputElement, RHFClassifierSelectProps>(
    ({ classifierKey, autoLoad = true, ...props }, ref) => {
        const classifier = useClassifier(classifierKey, { autoLoad });

        const data = classifier.getData();
        const isLoading = classifier.isLoading();

        const options: SearchableSelectOption[] = data || [];

        // Show loading state
        if (isLoading) {
            return (
                <RHFSearchableSelect
                    ref={ref}
                    options={[]}
                    disabled
                    placeholder="იტვირთება..."
                    {...props}
                />
            );
        }

        return (
            <RHFSearchableSelect
                ref={ref}
                options={options}
                {...props}
            />
        );
    }
);

RHFClassifierSelect.displayName = 'RHFClassifierSelect';