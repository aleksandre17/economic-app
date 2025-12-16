// hooks/useCheckboxItems.ts

import { useMemo } from 'react';

export interface UseCheckboxItemsOptions<T> {
    /** Source data array */
    data: T[];
    /** Extract value from item */
    getValue: (item: T) => string | number;
    /** Extract label from item */
    getLabel: (item: T) => React.ReactNode;
    /** Extract helper text */
    getHelperText?: (item: T) => string | undefined;
    /** Check if disabled */
    isDisabled?: (item: T) => boolean;
    /** Filter function */
    filter?: (item: T) => boolean;
}

/**
 * Hook for converting data array to checkbox items
 * 
 * @example
 * ```tsx
 * const items = useCheckboxItems({
 *   data: categories,
 *   getValue: (cat) => cat.id,
 *   getLabel: (cat) => cat.name,
 *   getHelperText: (cat) => cat.description,
 * });
 * 
 * <FormCheckboxGroup
 *   control={control}
 *   name="categories"
 *   items={items}
 * />
 * ```
 */
export function useCheckboxItems<T>(options: UseCheckboxItemsOptions<T>) {
    return useMemo(() => {
        const { data, getValue, getLabel, getHelperText, isDisabled, filter } = options;

        let filtered = data;
        if (filter) {
            filtered = data.filter(filter);
        }

        return filtered.map(item => ({
            value: getValue(item),
            label: getLabel(item),
            helperText: getHelperText?.(item),
            disabled: isDisabled?.(item),
            data: item,
        }));
    }, [options.data, options.getValue, options.getLabel, options.getHelperText, options.isDisabled, options.filter]);
}
