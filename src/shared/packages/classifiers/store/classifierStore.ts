// src/features/classifiers/store/classifierStore.ts

import { create } from 'zustand';
import { classifierStorage } from '../storage/classifiersStorage';
import { classifierCache } from '../cache/classifierCache';
import { classifiersApi } from '../api/classifiersApi';
import { CLASSIFIER_CONFIGS } from '../constants/classifierKeys';
import type { ClassifierItem, ClassifierConfig } from '../types/classifier.types';

interface ClassifierStoreState {
    // Data storage
    data: Map<string, ClassifierItem[]>;

    // Loading states
    loading: Map<string, boolean>;

    // Error states
    errors: Map<string, Error | null>;

    // Pending requests (deduplication)
    pendingRequests: Map<string, Promise<ClassifierItem[]>>;

    // Actions
    loadClassifier: (key: string, force?: boolean) => Promise<ClassifierItem[]>;
    loadMultiple: (keys: string[]) => Promise<void>;
    clearClassifier: (key: string) => void;
    clearAll: () => void;

    // Getters (no re-render)
    getData: (key: string) => ClassifierItem[] | null;
    isLoading: (key: string) => boolean;
    getError: (key: string) => Error | null;
}

/**
 * Global Zustand store for classifiers
 *
 * Performance features:
 * - Selective subscriptions (no unnecessary re-renders)
 * - Request deduplication
 * - 3-tier caching (Memory → LocalStorage → API)
 * - Parallel loading
 */
export const useClassifierStore = create<ClassifierStoreState>((set, get) => ({
    data: new Map(),
    loading: new Map(),
    errors: new Map(),
    pendingRequests: new Map(),

    /**
     * Get data without subscribing (no re-render)
     */
    getData: (key: string) => {
        return get().data.get(key) || null;
    },

    /**
     * Check loading state without subscribing
     */
    isLoading: (key: string) => {
        return get().loading.get(key) || false;
    },

    /**
     * Get error without subscribing
     */
    getError: (key: string) => {
        return get().errors.get(key) || null;
    },

    /**
     * Load single classifier with full caching strategy
     */
    loadClassifier: async (key: string, force: boolean = false) => {
        const state = get();
        const config = CLASSIFIER_CONFIGS[key];

        if (!config) {
            throw new Error(`Unknown classifier: ${key}`);
        }

        // ✅ 1. Check if already loaded (no fetch needed)
        if (!force && state.data.has(key)) {
            console.log(`⚡ Using existing data for: ${key}`);
            return state.data.get(key)!;
        }

        // ✅ 2. Check pending request (deduplication)
        const pending = state.pendingRequests.get(key);
        if (pending) {
            console.log(`⏳ Waiting for pending request: ${key}`);
            return pending;
        }

        // ✅ 3. Check memory cache
        if (!force) {
            const memoryData = classifierCache.get(key);
            if (memoryData) {
                console.log(`⚡ Using memory cache for: ${key}`);
                set((state) => ({
                    data: new Map(state.data).set(key, memoryData),
                }));
                return memoryData;
            }

            // ✅ 4. Check localStorage
            const storageEntry = classifierStorage.load(key, config.version);
            if (storageEntry) {
                console.log(`💾 Using localStorage for: ${key}`);
                classifierCache.set(key, storageEntry.data);
                set((state) => ({
                    data: new Map(state.data).set(key, storageEntry.data),
                }));
                return storageEntry.data;
            }
        }

        // ✅ 5. Fetch from API
        console.log(`🌐 Fetching from API: ${key}`);

        // Set loading state
        set((state) => ({
            loading: new Map(state.loading).set(key, true),
            errors: new Map(state.errors).set(key, null),
        }));

        try {
            // Create fetch promise
            const fetchPromise = classifiersApi.fetchClassifier(config);

            // Store pending request
            set((state) => ({
                pendingRequests: new Map(state.pendingRequests).set(key, fetchPromise),
            }));

            const data = await fetchPromise;

            // Save to all caches
            classifierCache.set(key, data);
            classifierStorage.save(
                key,
                data,
                config.version || '1.0.0',
                config.ttl || 24 * 60 * 60 * 1000
            );

            // Update store
            set((state) => {
                const newData = new Map(state.data).set(key, data);
                const newLoading = new Map(state.loading).set(key, false);
                const newPending = new Map(state.pendingRequests);
                newPending.delete(key);

                return {
                    data: newData,
                    loading: newLoading,
                    pendingRequests: newPending,
                };
            });

            console.log(`✅ Loaded classifier: ${key} (${data.length} items)`);

            return data;
        } catch (error) {
            console.error(`❌ Failed to load classifier ${key}:`, error);

            set((state) => {
                const newLoading = new Map(state.loading).set(key, false);
                const newErrors = new Map(state.errors).set(key, error as Error);
                const newPending = new Map(state.pendingRequests);
                newPending.delete(key);

                return {
                    loading: newLoading,
                    errors: newErrors,
                    pendingRequests: newPending,
                };
            });

            throw error;
        }
    },

    /**
     * Load multiple classifiers in parallel
     */
    loadMultiple: async (keys: string[]) => {
        console.log(`🚀 Loading ${keys.length} classifiers in parallel`);

        try {
            await Promise.all(
                keys.map((key) => get().loadClassifier(key).catch((error) => {
                    console.error(`Failed to load ${key}:`, error);
                    // Don't throw - continue loading others
                }))
            );

            console.log(`✅ Finished loading classifiers`);
        } catch (error) {
            console.error('Failed to load multiple classifiers:', error);
        }
    },

    /**
     * Clear single classifier
     */
    clearClassifier: (key: string) => {
        classifierCache.remove(key);
        classifierStorage.remove(key);

        set((state) => {
            const newData = new Map(state.data);
            newData.delete(key);

            return { data: newData };
        });

        console.log(`🗑️ Cleared classifier: ${key}`);
    },

    /**
     * Clear all classifiers
     */
    clearAll: () => {
        classifierCache.clear();
        classifierStorage.clearAll();

        set({
            data: new Map(),
            loading: new Map(),
            errors: new Map(),
            pendingRequests: new Map(),
        });

        console.log('🗑️ Cleared all classifiers');
    },
}));