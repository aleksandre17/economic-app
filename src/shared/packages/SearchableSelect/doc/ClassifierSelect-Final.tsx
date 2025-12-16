// src/shared/components/SearchableSelect/ClassifierSelect.tsx

import React, { forwardRef } from 'react';
import { SearchableSelect, SearchableSelectProps, SearchableSelectOption } from './SearchableSelect';
import { useClassifier, CLASSIFIER_KEYS } from '@/features/classifiers';

interface ClassifierSelectProps extends Omit<SearchableSelectProps, 'options'> {
    classifierKey: string;
    autoLoad?: boolean;
}

/**
 * SearchableSelect integrated with Classifiers System
 * 
 * Automatically loads classifier data and provides it to SearchableSelect
 * 
 * @example
 * // Simple usage (returns ID)
 * <ClassifierSelect
 *   classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *   value={category}
 *   onChange={(value) => setCategory(value)}
 *   placeholder="აირჩიეთ კატეგორია"
 * />
 * 
 * @example
 * // Auto-select first option when data loads
 * <ClassifierSelect
 *   classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *   value={category}
 *   onChange={(value) => setCategory(value)}
 *   autoSelectFirst={true}
 * />
 * 
 * @example
 * // Return CODE instead of ID with auto-select
 * <ClassifierSelect
 *   classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *   value={categoryCode}
 *   onChange={(value) => setCategoryCode(value)}
 *   valueField="code"
 *   autoSelectFirst={true}
 * />
 * 
 * @example
 * // With React Hook Form
 * <Controller
 *   name="category"
 *   control={control}
 *   render={({ field }) => (
 *     <ClassifierSelect
 *       classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *       {...field}
 *       autoSelectFirst={true}
 *       valueField="code"
 *     />
 *   )}
 * />
 */
export const ClassifierSelect = forwardRef<HTMLInputElement, ClassifierSelectProps>(
    ({ classifierKey, autoLoad = true, ...props }, ref) => {
        const classifier = useClassifier(classifierKey, { autoLoad });

        const data = classifier.getData();
        const isLoading = classifier.isLoading();

        // Convert classifier data to SearchableSelectOption format
        const options: SearchableSelectOption[] = data || [];

        // Show loading state
        if (isLoading) {
            return (
                <SearchableSelect
                    ref={ref}
                    options={[]}
                    disabled
                    placeholder="იტვირთება..."
                    {...props}
                />
            );
        }

        return (
            <SearchableSelect
                ref={ref}
                options={options}
                {...props}
            />
        );
    }
);

ClassifierSelect.displayName = 'ClassifierSelect';
