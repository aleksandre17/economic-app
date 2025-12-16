// src/features/classifiers/hooks/useClassifiers.ts

import { useState, useEffect, useCallback } from 'react';
import { classifierStorage } from '../storage/classifiersStorage';
import { classifierCache } from '../cache/classifierCache';
import { classifiersApi } from '../api/classifiersApi';
import { CLASSIFIER_CONFIGS } from '../constants/classifierKeys';
import type { ClassifierItem } from '../types/classifier.types';

interface UseClassifiersState {
    data: Map<string, ClassifierItem[]>;
    isLoading: boolean;
    isError: boolean;
    errors: Map<string, Error>;
}

/**
 * Hook for loading multiple classifiers at once
 * More efficient than calling useClassifier multiple times
 *
 * @example
 * const { data, isLoading } = useClassifiers(['categories', 'positions', 'departments']);
 * const categories = data.get('categories');
 */
export function useClassifiers(classifierKeys: string[]) {
    const [state, setState] = useState<UseClassifiersState>({
        data: new Map(),
        isLoading: true,
        isError: false,
        errors: new Map(),
    });

    const loadClassifiers = useCallback(async () => {
        try {
            setState((prev) => ({ ...prev, isLoading: true }));

            const dataMap = new Map<string, ClassifierItem[]>();
            const toFetch: string[] = [];

            // Check caches first
            for (const key of classifierKeys) {
                const config = CLASSIFIER_CONFIGS[key];
                if (!config) {
                    console.warn(`Unknown classifier key: ${key}`);
                    continue;
                }

                // Try memory cache
                const memoryData = classifierCache.get(key);
                if (memoryData) {
                    dataMap.set(key, memoryData);
                    continue;
                }

                // Try localStorage
                const storageEntry = classifierStorage.load(key, config.version);
                if (storageEntry) {
                    dataMap.set(key, storageEntry.data);
                    classifierCache.set(key, storageEntry.data);
                    continue;
                }

                // Need to fetch
                toFetch.push(key);
            }

            // Fetch missing classifiers in parallel
            if (toFetch.length > 0) {
                const configs = toFetch.map((key) => CLASSIFIER_CONFIGS[key]);
                const fetchedData = await classifiersApi.fetchMultiple(configs);

                // Save to caches
                fetchedData.forEach((data, key) => {
                    const config = CLASSIFIER_CONFIGS[key];
                    dataMap.set(key, data);
                    classifierCache.set(key, data);
                    classifierStorage.save(
                        key,
                        data,
                        config.version || '1.0.0',
                        config.ttl || 24 * 60 * 60 * 1000
                    );
                });
            }

            setState({
                data: dataMap,
                isLoading: false,
                isError: false,
                errors: new Map(),
            });
        } catch (error) {
            console.error('Failed to load classifiers:', error);
            setState((prev) => ({
                ...prev,
                isLoading: false,
                isError: true,
            }));
        }
    }, [classifierKeys]);

    useEffect(() => {
        loadClassifiers();
    }, [loadClassifiers]);

    return {
        data: state.data,
        isLoading: state.isLoading,
        isError: state.isError,
        errors: state.errors,
        refetch: loadClassifiers,
    };
}