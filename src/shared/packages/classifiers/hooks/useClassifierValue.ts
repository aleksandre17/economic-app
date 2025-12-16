// src/features/classifiers/hooks/useClassifierValue.ts

import { useClassifierStore } from '../store/classifierStore';

/**
 * Hook for accessing classifier WITH subscription
 *
 * ⚠️ CAUSES RE-RENDERS when data changes
 * ✅ Use in lists, selects that need to update automatically
 *
 * @example
 * const { data, isLoading } = useClassifierValue('categories');
 *
 * return (
 *   <select>
 *     {data?.map(item => <option key={item.id}>{item.name}</option>)}
 *   </select>
 * );
 */
export function useClassifierValue(key: string, options: { autoLoad?: boolean } = {}) {
    // ✅ Selective subscription - only to this classifier
    const data = useClassifierStore((state) => state.data.get(key) || null);
    const isLoading = useClassifierStore((state) => state.loading.get(key) || false);
    const error = useClassifierStore((state) => state.errors.get(key) || null);

    // Auto-load
    if (options.autoLoad && !data && !isLoading) {
        useClassifierStore.getState().loadClassifier(key).then(() => {});
    }

    return {
        data,
        isLoading,
        isError: error !== null,
        error,
    };
}