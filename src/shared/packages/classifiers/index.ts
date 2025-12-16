// src/features/classifiers/index.ts

/**
 * Public API for Classifiers feature
 */

// Provider
export { ClassifierProvider } from './provider/classifierProvider';
export { DEFAULT_PREFETCH_CONFIG } from './provider/prefetchConfig';
export type { PrefetchConfig } from './provider/prefetchConfig';

// Store
export { useClassifierStore } from './store/classifierStore';

// Hooks
export { useClassifier } from './hooks/useClassifier';
export { useClassifierValue } from './hooks/useClassifierValue';
export { useClassifierPrefetch } from './hooks/useClassifierPrefetch';

// Constants
export { CLASSIFIER_KEYS, CLASSIFIER_CONFIGS } from './constants/classifierKeys';

// Types
export type {
    ClassifierItem,
    ClassifierData,
    ClassifierState,
    ClassifierConfig,
} from './types/classifier.types';

// Utilities
export { classifierStorage } from './storage/classifiersStorage';
export { classifierCache } from './cache/classifierCache';
