// src/features/classifiers/hooks/useClassifier.ts

import { useCallback } from 'react';
import { useClassifierStore } from '../store/classifierStore';

/**
 * Hook for accessing classifier WITHOUT subscribing to changes
 *
 * ✅ NO RE-RENDERS when data changes
 * ✅ Perfect for one-time data access
 * ✅ Use in modals, forms, etc.
 *
 * @example
 * const classifier = useClassifier('categories');
 * const data = classifier.getData(); // No re-render
 *
 * // Or with auto-load
 * const { getData, load } = useClassifier('categories', { autoLoad: true });
 */
export function useClassifier(
    key: string,
    options: { autoLoad?: boolean } = {}
) {
    const store = useClassifierStore;

    // ✅ Auto-load on first call (if enabled)
    if (options.autoLoad) {
        const hasData = store.getState().data.has(key);
        const isLoading = store.getState().loading.get(key);

        if (!hasData && !isLoading) {
            store.getState().loadClassifier(key).then(() => {});
        }
    }

    // ✅ Return stable functions (no re-render)
    return {
        /**
         * Get data without subscribing
         */
        getData: () => store.getState().getData(key),

        /**
         * Check if loading
         */
        isLoading: () => store.getState().isLoading(key),

        /**
         * Get error
         */
        getError: () => store.getState().getError(key),

        /**
         * Load/reload classifier
         */
        load: useCallback((force = false) => {
            return store.getState().loadClassifier(key, force);
        }, [key, store]),

        /**
         * Clear cache
         */
        clear: useCallback(() => {
            store.getState().clearClassifier(key);
        }, [key, store]),
    };
}