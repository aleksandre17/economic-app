// src/features/classifiers/provider/prefetchConfig.ts

import { CLASSIFIER_KEYS } from '../constants/classifierKeys';

/**
 * Prefetch strategy configuration
 */
export interface PrefetchConfig {
    /**
     * Classifiers to load immediately on app start
     */
    immediate: string[];

    /**
     * Classifiers to load after immediate ones (lower priority)
     */
    deferred: string[];

    /**
     * Delay for deferred loading (ms)
     */
    deferredDelay: number;

    /**
     * Enable prefetching
     */
    enabled: boolean;
}

/**
 * Default prefetch configuration
 * Customize based on your app's needs
 */
export const DEFAULT_PREFETCH_CONFIG: PrefetchConfig = {
    // ✅ Load immediately (critical for app)
    immediate: [
        CLASSIFIER_KEYS.CATEGORIES,
        //CLASSIFIER_KEYS.POSITIONS,
    ],

    // ✅ Load after 2 seconds (less critical)
    deferred: [
        // CLASSIFIER_KEYS.DEPARTMENTS,
        // CLASSIFIER_KEYS.EDUCATION_LEVELS,
        // CLASSIFIER_KEYS.EMPLOYMENT_TYPES,
        // CLASSIFIER_KEYS.REGIONS,
        // CLASSIFIER_KEYS.INDUSTRIES,
    ],

    deferredDelay: 2000, // 2 seconds

    enabled: true,
};