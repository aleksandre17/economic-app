// src/features/classifiers/hooks/useClassifierPrefetch.ts

import { useEffect } from 'react';
import { useClassifierStore } from '../store/classifierStore';

/**
 * Hook for prefetching classifiers on component mount
 *
 * @example
 * // In a parent component
 * useClassifierPrefetch(['categories', 'positions', 'departments']);
 */
export function useClassifierPrefetch(keys: string[]) {
    const loadMultiple = useClassifierStore((state) => state.loadMultiple);

    useEffect(() => {
        if (keys.length > 0) {
            console.log(`🔄 Prefetching classifiers: ${keys.join(', ')}`);
            loadMultiple(keys);
        }
    }, [keys.join(','), loadMultiple]);
}