// src/shared/components/SearchableSelect/ClassifierSelect.tsx

import { forwardRef } from 'react';
import { SearchableSelect, SearchableSelectProps, SearchableSelectOption } from '../searcheble/SearchableSelect.tsx';
import { useClassifier } from '@/shared/packages/classifiers';

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
 * // Return CODE instead of ID
 * <ClassifierSelect
 *   classifierKey={CLASSIFIER_KEYS.CATEGORIES}
 *   value={categoryCode}
 *   onChange={(value) => setCategoryCode(value)}
 *   valueField="code"
 *   placeholder="აირჩიეთ კატეგორია"
 * />
 *
 * @example
 * // With React Hook Form
 * <ClassifierSelect
 *   classifierKey={CLASSIFIER_KEYS.POSITIONS}
 *   {...register('position')}
 *   error={errors.position?.message}
 *   valueField="code"
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