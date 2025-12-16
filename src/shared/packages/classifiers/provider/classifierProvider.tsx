// src/features/classifiers/provider/ClassifierProvider.tsx

import React, { useEffect, useRef, ReactNode } from 'react';
import { useClassifierStore } from '../store/classifierStore';
import { DEFAULT_PREFETCH_CONFIG, type PrefetchConfig } from './prefetchConfig';

interface ClassifierProviderProps {
    children: ReactNode;
    config?: Partial<PrefetchConfig>;
}

/**
 * Global classifier provider with auto-prefetch
 *
 * Features:
 * - Loads critical classifiers immediately on mount
 * - Loads non-critical classifiers after delay
 * - Only fetches if not in cache
 * - No unnecessary re-renders
 * - Request deduplication
 *
 * @example
 * <ClassifierProvider>
 *   <App />
 * </ClassifierProvider>
 */
export const ClassifierProvider: React.FC<ClassifierProviderProps> = ({ children, config: customConfig }) => {
    const loadMultiple = useClassifierStore((state) => state.loadMultiple);
    const hasInitialized = useRef(false);

    useEffect(() => {

        const config = { ...DEFAULT_PREFETCH_CONFIG, ...customConfig };
        
        // ✅ Run only once
        if (hasInitialized.current || !config.enabled) {
            return;
        }

        hasInitialized.current = true;

        console.log('🚀 ClassifierProvider: Starting prefetch');

        // ✅ Load immediate classifiers
        if (config.immediate.length > 0) {
            console.log(`⚡ Loading immediate classifiers: ${config.immediate.join(', ')}`);
            loadMultiple(config.immediate).catch((error) => {
                console.error('Failed to load immediate classifiers:', error);
            });
        }

        // ✅ Load deferred classifiers after delay
        if (config.deferred.length > 0) {
            const timer = setTimeout(() => {
                console.log(`⏰ Loading deferred classifiers: ${config.deferred.join(', ')}`);
                loadMultiple(config.deferred).catch((error) => {
                    console.error('Failed to load deferred classifiers:', error);
                });
            }, config.deferredDelay);

            return () => clearTimeout(timer);
        }
    }, [loadMultiple, customConfig]);

    // ✅ No wrapper div - just children
    return <>{children}</>;
};