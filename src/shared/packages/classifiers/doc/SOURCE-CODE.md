# 📦 Classifiers System - Complete Source Code

Copy-paste ready implementation files. Create the folder structure and copy each file.

---

## 📁 File Structure

```
src/features/classifiers/
├── types/
│   └── classifier.types.ts
├── constants/
│   └── classifierKeys.ts
├── utils/
│   └── validation.ts
├── api/
│   ├── apiClient.ts
│   └── classifiersApi.ts
├── storage/
│   ├── storageKeys.ts
│   └── classifiersStorage.ts
├── cache/
│   └── classifierCache.ts
├── store/
│   └── classifierStore.ts
├── provider/
│   ├── prefetchConfig.ts
│   └── ClassifierProvider.tsx
├── hooks/
│   ├── useClassifier.ts
│   ├── useClassifierValue.ts
│   └── useClassifierPrefetch.ts
└── index.ts
```

---

## 📄 File Contents

### 1. types/classifier.types.ts

```typescript
/**
 * Classifier item structure
 */
export interface ClassifierItem {
    id: string | number;
    name: string;
    code?: string;
    parentId?: string | number;
    isActive?: boolean;
    metadata?: Record<string, any>;
}

/**
 * Classifier data with metadata
 */
export interface ClassifierData {
    items: ClassifierItem[];
    version: string;
    fetchedAt: number;
    expiresAt: number;
}

/**
 * Classifier fetch state
 */
export interface ClassifierState {
    data: ClassifierItem[] | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isStale: boolean;
}

/**
 * Classifier configuration
 */
export interface ClassifierConfig {
    key: string;
    endpoint: string;
    ttl?: number;
    version?: string;
    transform?: (data: any) => ClassifierItem[];
}

/**
 * Storage entry
 */
export interface StorageEntry {
    data: ClassifierItem[];
    version: string;
    fetchedAt: number;
    expiresAt: number;
}
```

---

### 2. constants/classifierKeys.ts

```typescript
import type { ClassifierConfig } from '../types/classifier.types';

/**
 * Classifier identifiers
 */
export const CLASSIFIER_KEYS = {
    CATEGORIES: 'categories',
    POSITIONS: 'positions',
    DEPARTMENTS: 'departments',
    EDUCATION_LEVELS: 'education_levels',
    EMPLOYMENT_TYPES: 'employment_types',
    REGIONS: 'regions',
    INDUSTRIES: 'industries',
} as const;

export type ClassifierKey = typeof CLASSIFIER_KEYS[keyof typeof CLASSIFIER_KEYS];

/**
 * Classifier configurations
 */
export const CLASSIFIER_CONFIGS: Record<string, ClassifierConfig> = {
    [CLASSIFIER_KEYS.CATEGORIES]: {
        key: CLASSIFIER_KEYS.CATEGORIES,
        endpoint: '/api/classifiers/categories',
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        version: '1.0.0',
    },
    [CLASSIFIER_KEYS.POSITIONS]: {
        key: CLASSIFIER_KEYS.POSITIONS,
        endpoint: '/api/classifiers/positions',
        ttl: 24 * 60 * 60 * 1000,
        version: '1.0.0',
    },
    [CLASSIFIER_KEYS.DEPARTMENTS]: {
        key: CLASSIFIER_KEYS.DEPARTMENTS,
        endpoint: '/api/classifiers/departments',
        ttl: 12 * 60 * 60 * 1000, // 12 hours
        version: '1.0.0',
    },
    [CLASSIFIER_KEYS.EDUCATION_LEVELS]: {
        key: CLASSIFIER_KEYS.EDUCATION_LEVELS,
        endpoint: '/api/classifiers/education-levels',
        ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
        version: '1.0.0',
    },
    [CLASSIFIER_KEYS.EMPLOYMENT_TYPES]: {
        key: CLASSIFIER_KEYS.EMPLOYMENT_TYPES,
        endpoint: '/api/classifiers/employment-types',
        ttl: 7 * 24 * 60 * 60 * 1000,
        version: '1.0.0',
    },
    [CLASSIFIER_KEYS.REGIONS]: {
        key: CLASSIFIER_KEYS.REGIONS,
        endpoint: '/api/classifiers/regions',
        ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
        version: '1.0.0',
    },
    [CLASSIFIER_KEYS.INDUSTRIES]: {
        key: CLASSIFIER_KEYS.INDUSTRIES,
        endpoint: '/api/classifiers/industries',
        ttl: 24 * 60 * 60 * 1000,
        version: '1.0.0',
    },
};
```

---

### 3. utils/validation.ts

```typescript
import type { ClassifierItem, StorageEntry } from '../types/classifier.types';

/**
 * Validation utilities for classifier data and cache
 */

/**
 * Validate if classifier item has required fields
 */
export function isValidClassifierItem(item: any): item is ClassifierItem {
    if (!item || typeof item !== 'object') {
        return false;
    }

    // Required fields
    if (!item.id || (!item.name && item.name !== '')) {
        return false;
    }

    // Validate types
    if (typeof item.name !== 'string') {
        return false;
    }

    if (typeof item.id !== 'string' && typeof item.id !== 'number') {
        return false;
    }

    // Validate optional fields
    if (item.code !== undefined && typeof item.code !== 'string') {
        return false;
    }

    if (item.parentId !== undefined && typeof item.parentId !== 'string' && typeof item.parentId !== 'number') {
        return false;
    }

    if (item.isActive !== undefined && typeof item.isActive !== 'boolean') {
        return false;
    }

    return true;
}

/**
 * Validate array of classifier items
 */
export function isValidClassifierArray(data: any): data is ClassifierItem[] {
    if (!Array.isArray(data)) {
        return false;
    }

    return data.every(item => isValidClassifierItem(item));
}

/**
 * Validate storage entry structure
 */
export function isValidStorageEntry(entry: any): entry is StorageEntry {
    if (!entry || typeof entry !== 'object') {
        return false;
    }

    // Check required fields
    if (!Array.isArray(entry.data) ||
        typeof entry.version !== 'string' ||
        typeof entry.fetchedAt !== 'number' ||
        typeof entry.expiresAt !== 'number') {
        return false;
    }

    // Validate data array
    if (!isValidClassifierArray(entry.data)) {
        return false;
    }

    return true;
}

/**
 * Check if cache entry is expired
 */
export function isCacheExpired(entry: StorageEntry): boolean {
    return Date.now() > entry.expiresAt;
}

/**
 * Check if cache entry version matches expected version
 */
export function isCacheVersionValid(entry: StorageEntry, expectedVersion?: string): boolean {
    if (!expectedVersion) {
        return true;
    }

    return entry.version === expectedVersion;
}

/**
 * Check if cache entry is stale (needs refresh)
 */
export function isCacheStale(entry: StorageEntry): boolean {
    const now = Date.now();
    const ttl = entry.expiresAt - entry.fetchedAt;
    const elapsed = now - entry.fetchedAt;
    
    // Stale if 80% of TTL has elapsed
    return elapsed > (ttl * 0.8);
}

/**
 * Validate and clean classifier data
 */
export function cleanClassifierData(data: any[]): ClassifierItem[] {
    if (!Array.isArray(data)) {
        console.warn('⚠️ Invalid classifier data: not an array');
        return [];
    }

    const cleaned = data.filter((item, index) => {
        if (!isValidClassifierItem(item)) {
            console.warn(`⚠️ Invalid classifier item at index ${index}:`, item);
            return false;
        }
        return true;
    });

    if (cleaned.length < data.length) {
        console.warn(`⚠️ Removed ${data.length - cleaned.length} invalid items`);
    }

    return cleaned;
}

/**
 * Sanitize classifier item
 */
export function sanitizeClassifierItem(item: ClassifierItem): ClassifierItem {
    return {
        id: item.id,
        name: String(item.name).trim(),
        code: item.code ? String(item.code).trim() : undefined,
        parentId: item.parentId || undefined,
        isActive: item.isActive !== undefined ? Boolean(item.isActive) : undefined,
        metadata: item.metadata || undefined,
    };
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
    try {
        const testKey = '__classifier_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.warn('⚠️ LocalStorage not available:', error);
        return false;
    }
}

/**
 * Get remaining TTL in milliseconds
 */
export function getRemainingTTL(entry: StorageEntry): number {
    const remaining = entry.expiresAt - Date.now();
    return Math.max(0, remaining);
}

/**
 * Format TTL for human reading
 */
export function formatTTL(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

/**
 * Validate cache health
 */
export function validateCacheHealth(entry: StorageEntry): {
    isValid: boolean;
    isExpired: boolean;
    isStale: boolean;
    age: number;
    remainingTTL: number;
    issues: string[];
} {
    const issues: string[] = [];

    if (!isValidStorageEntry(entry)) {
        issues.push('Invalid storage entry structure');
    }

    const isExpired = isCacheExpired(entry);
    if (isExpired) {
        issues.push('Cache expired');
    }

    const isStale = isCacheStale(entry);
    if (isStale && !isExpired) {
        issues.push('Cache is stale');
    }

    if (entry.data.length === 0) {
        issues.push('Empty data array');
    }

    return {
        isValid: issues.length === 0,
        isExpired,
        isStale,
        age: Date.now() - entry.fetchedAt,
        remainingTTL: getRemainingTTL(entry),
        issues,
    };
}

/**
 * Deduplicate classifiers by id
 */
export function deduplicateClassifiers(data: ClassifierItem[]): ClassifierItem[] {
    const seen = new Set<string | number>();
    const deduplicated: ClassifierItem[] = [];

    for (const item of data) {
        if (!seen.has(item.id)) {
            seen.add(item.id);
            deduplicated.push(item);
        }
    }

    if (deduplicated.length < data.length) {
        console.warn(`⚠️ Removed ${data.length - deduplicated.length} duplicates`);
    }

    return deduplicated;
}
```

---

### 4. storage/storageKeys.ts

```typescript
const STORAGE_PREFIX = 'classifier';
const VERSION_KEY = 'version';

export const getStorageKey = (classifierKey: string): string => {
    return `${STORAGE_PREFIX}:${classifierKey}`;
};

export const getVersionKey = (classifierKey: string): string => {
    return `${STORAGE_PREFIX}:${classifierKey}:${VERSION_KEY}`;
};
```

---

### 4. storage/classifiersStorage.ts

```typescript
import { getStorageKey } from './storageKeys';
import type { ClassifierItem, StorageEntry } from '../types/classifier.types';

/**
 * LocalStorage abstraction layer
 */
class ClassifierStorage {
    /**
     * Save classifier data to localStorage
     */
    save(key: string, data: ClassifierItem[], version: string, ttl: number): void {
        try {
            const now = Date.now();
            const entry: StorageEntry = {
                data,
                version,
                fetchedAt: now,
                expiresAt: now + ttl,
            };

            const storageKey = getStorageKey(key);
            localStorage.setItem(storageKey, JSON.stringify(entry));

            console.log(`💾 Saved classifier: ${key} (expires in ${ttl / 1000}s)`);
        } catch (error) {
            console.error(`❌ Failed to save classifier ${key}:`, error);
            
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                this.clearOldest();
                try {
                    localStorage.setItem(getStorageKey(key), JSON.stringify({
                        data,
                        version,
                        fetchedAt: Date.now(),
                        expiresAt: Date.now() + ttl,
                    }));
                } catch (retryError) {
                    console.error('❌ Retry failed:', retryError);
                }
            }
        }
    }

    /**
     * Load classifier data from localStorage
     */
    load(key: string, expectedVersion?: string): StorageEntry | null {
        try {
            const storageKey = getStorageKey(key);
            const stored = localStorage.getItem(storageKey);

            if (!stored) {
                console.log(`📭 No cached data for: ${key}`);
                return null;
            }

            const entry: StorageEntry = JSON.parse(stored);

            // Check version
            if (expectedVersion && entry.version !== expectedVersion) {
                console.log(`🔄 Version mismatch for ${key}: ${entry.version} → ${expectedVersion}`);
                this.remove(key);
                return null;
            }

            // Check expiration
            if (Date.now() > entry.expiresAt) {
                console.log(`⏰ Expired data for: ${key}`);
                this.remove(key);
                return null;
            }

            console.log(`✅ Loaded cached data for: ${key}`);
            return entry;
        } catch (error) {
            console.error(`❌ Failed to load classifier ${key}:`, error);
            this.remove(key);
            return null;
        }
    }

    /**
     * Remove classifier from storage
     */
    remove(key: string): void {
        try {
            const storageKey = getStorageKey(key);
            localStorage.removeItem(storageKey);
            console.log(`🗑️ Removed classifier: ${key}`);
        } catch (error) {
            console.error(`❌ Failed to remove classifier ${key}:`, error);
        }
    }

    /**
     * Clear all classifiers
     */
    clearAll(): void {
        try {
            const keys = Object.keys(localStorage);
            const classifierKeys = keys.filter((k) => k.startsWith('classifier:'));

            classifierKeys.forEach((key) => localStorage.removeItem(key));

            console.log(`🗑️ Cleared ${classifierKeys.length} classifiers`);
        } catch (error) {
            console.error('❌ Failed to clear classifiers:', error);
        }
    }

    /**
     * Clear oldest classifier
     */
    private clearOldest(): void {
        try {
            const keys = Object.keys(localStorage);
            const classifierKeys = keys.filter((k) => k.startsWith('classifier:'));

            let oldestKey: string | null = null;
            let oldestTime = Infinity;

            classifierKeys.forEach((key) => {
                try {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        const entry: StorageEntry = JSON.parse(stored);
                        if (entry.fetchedAt < oldestTime) {
                            oldestTime = entry.fetchedAt;
                            oldestKey = key;
                        }
                    }
                } catch {
                    // Skip invalid entries
                }
            });

            if (oldestKey) {
                localStorage.removeItem(oldestKey);
                console.log(`🗑️ Removed oldest classifier: ${oldestKey}`);
            }
        } catch (error) {
            console.error('❌ Failed to clear oldest:', error);
        }
    }

    /**
     * Get storage usage info
     */
    getStorageInfo(): { count: number; size: number } {
        try {
            const keys = Object.keys(localStorage);
            const classifierKeys = keys.filter((k) => k.startsWith('classifier:'));

            let totalSize = 0;
            classifierKeys.forEach((key) => {
                const value = localStorage.getItem(key);
                if (value) {
                    totalSize += new Blob([value]).size;
                }
            });

            return {
                count: classifierKeys.length,
                size: totalSize,
            };
        } catch {
            return { count: 0, size: 0 };
        }
    }
}

export const classifierStorage = new ClassifierStorage();
```

---

### 5. cache/classifierCache.ts

```typescript
import type { ClassifierItem } from '../types/classifier.types';

/**
 * In-memory cache for active classifiers
 */
class ClassifierCache {
    private cache: Map<string, ClassifierItem[]> = new Map();
    private pendingRequests: Map<string, Promise<ClassifierItem[]>> = new Map();

    get(key: string): ClassifierItem[] | null {
        return this.cache.get(key) || null;
    }

    set(key: string, data: ClassifierItem[]): void {
        this.cache.set(key, data);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    remove(key: string): void {
        this.cache.delete(key);
        this.pendingRequests.delete(key);
    }

    clear(): void {
        this.cache.clear();
        this.pendingRequests.clear();
    }

    getPendingRequest(key: string): Promise<ClassifierItem[]> | null {
        return this.pendingRequests.get(key) || null;
    }

    setPendingRequest(key: string, promise: Promise<ClassifierItem[]>): void {
        this.pendingRequests.set(key, promise);

        promise.finally(() => {
            this.pendingRequests.delete(key);
        });
    }

    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

export const classifierCache = new ClassifierCache();
```

---

### 6. api/apiClient.ts

```typescript
/**
 * HTTP client for API requests
 */
export class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = '') {
        this.baseURL = baseURL;
    }

    async get<T>(endpoint: string): Promise<T> {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ API Error: ${endpoint}`, error);
            throw error;
        }
    }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL || '');
```

---

### 7. api/classifiersApi.ts

```typescript
import { apiClient } from './apiClient';
import type { ClassifierItem, ClassifierConfig } from '../types/classifier.types';

/**
 * API layer for classifier requests
 */
class ClassifiersApi {
    async fetchClassifier(config: ClassifierConfig): Promise<ClassifierItem[]> {
        try {
            console.log(`🌐 Fetching classifier: ${config.key}`);

            const response = await apiClient.get<any>(config.endpoint);

            const data = config.transform ? config.transform(response) : response;

            console.log(`✅ Fetched classifier: ${config.key} (${data.length} items)`);

            return data;
        } catch (error) {
            console.error(`❌ Failed to fetch classifier ${config.key}:`, error);
            throw error;
        }
    }

    async fetchMultiple(configs: ClassifierConfig[]): Promise<Map<string, ClassifierItem[]>> {
        try {
            console.log(`🌐 Fetching ${configs.length} classifiers in parallel`);

            const promises = configs.map((config) =>
                this.fetchClassifier(config)
                    .then((data) => ({ key: config.key, data }))
                    .catch((error) => ({ key: config.key, error }))
            );

            const results = await Promise.all(promises);

            const dataMap = new Map<string, ClassifierItem[]>();

            results.forEach((result) => {
                if ('data' in result) {
                    dataMap.set(result.key, result.data);
                } else {
                    console.error(`❌ Failed to fetch ${result.key}:`, result.error);
                }
            });

            console.log(`✅ Fetched ${dataMap.size}/${configs.length} classifiers`);

            return dataMap;
        } catch (error) {
            console.error('❌ Failed to fetch multiple classifiers:', error);
            throw error;
        }
    }
}

export const classifiersApi = new ClassifiersApi();
```

---

### 8. store/classifierStore.ts

```typescript
import { create } from 'zustand';
import { classifierStorage } from '../storage/classifiersStorage';
import { classifierCache } from '../cache/classifierCache';
import { classifiersApi } from '../api/classifiersApi';
import { CLASSIFIER_CONFIGS } from '../constants/classifierKeys';
import type { ClassifierItem, ClassifierConfig } from '../types/classifier.types';

interface ClassifierStoreState {
    data: Map<string, ClassifierItem[]>;
    loading: Map<string, boolean>;
    errors: Map<string, Error | null>;
    pendingRequests: Map<string, Promise<ClassifierItem[]>>;
    
    loadClassifier: (key: string, force?: boolean) => Promise<ClassifierItem[]>;
    loadMultiple: (keys: string[]) => Promise<void>;
    clearClassifier: (key: string) => void;
    clearAll: () => void;
    
    getData: (key: string) => ClassifierItem[] | null;
    isLoading: (key: string) => boolean;
    getError: (key: string) => Error | null;
}

export const useClassifierStore = create<ClassifierStoreState>((set, get) => ({
    data: new Map(),
    loading: new Map(),
    errors: new Map(),
    pendingRequests: new Map(),

    getData: (key: string) => {
        return get().data.get(key) || null;
    },

    isLoading: (key: string) => {
        return get().loading.get(key) || false;
    },

    getError: (key: string) => {
        return get().errors.get(key) || null;
    },

    loadClassifier: async (key: string, force: boolean = false) => {
        const state = get();
        const config = CLASSIFIER_CONFIGS[key];

        if (!config) {
            throw new Error(`Unknown classifier: ${key}`);
        }

        if (!force && state.data.has(key)) {
            console.log(`⚡ Using existing data for: ${key}`);
            return state.data.get(key)!;
        }

        const pending = state.pendingRequests.get(key);
        if (pending) {
            console.log(`⏳ Waiting for pending request: ${key}`);
            return pending;
        }

        if (!force) {
            const memoryData = classifierCache.get(key);
            if (memoryData) {
                console.log(`⚡ Using memory cache for: ${key}`);
                set((state) => ({
                    data: new Map(state.data).set(key, memoryData),
                }));
                return memoryData;
            }

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

        console.log(`🌐 Fetching from API: ${key}`);

        set((state) => ({
            loading: new Map(state.loading).set(key, true),
            errors: new Map(state.errors).set(key, null),
        }));

        try {
            const fetchPromise = classifiersApi.fetchClassifier(config);

            set((state) => ({
                pendingRequests: new Map(state.pendingRequests).set(key, fetchPromise),
            }));

            const data = await fetchPromise;

            classifierCache.set(key, data);
            classifierStorage.save(
                key,
                data,
                config.version || '1.0.0',
                config.ttl || 24 * 60 * 60 * 1000
            );

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

    loadMultiple: async (keys: string[]) => {
        console.log(`🚀 Loading ${keys.length} classifiers in parallel`);

        try {
            await Promise.all(
                keys.map((key) => get().loadClassifier(key).catch((error) => {
                    console.error(`Failed to load ${key}:`, error);
                }))
            );

            console.log(`✅ Finished loading classifiers`);
        } catch (error) {
            console.error('Failed to load multiple classifiers:', error);
        }
    },

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
```

---

### 9. provider/prefetchConfig.ts

```typescript
import { CLASSIFIER_KEYS } from '../constants/classifierKeys';

export interface PrefetchConfig {
    immediate: string[];
    deferred: string[];
    deferredDelay: number;
    enabled: boolean;
}

export const DEFAULT_PREFETCH_CONFIG: PrefetchConfig = {
    immediate: [
        CLASSIFIER_KEYS.CATEGORIES,
        CLASSIFIER_KEYS.POSITIONS,
    ],
    deferred: [
        CLASSIFIER_KEYS.DEPARTMENTS,
        CLASSIFIER_KEYS.EDUCATION_LEVELS,
        CLASSIFIER_KEYS.EMPLOYMENT_TYPES,
        CLASSIFIER_KEYS.REGIONS,
        CLASSIFIER_KEYS.INDUSTRIES,
    ],
    deferredDelay: 2000,
    enabled: true,
};
```

---

### 10. provider/ClassifierProvider.tsx

```typescript
import React, { useEffect, useRef, ReactNode } from 'react';
import { useClassifierStore } from '../store/classifierStore';
import { DEFAULT_PREFETCH_CONFIG, type PrefetchConfig } from './prefetchConfig';

interface ClassifierProviderProps {
    children: ReactNode;
    config?: Partial<PrefetchConfig>;
}

export const ClassifierProvider: React.FC<ClassifierProviderProps> = ({
    children,
    config: customConfig,
}) => {
    const loadMultiple = useClassifierStore((state) => state.loadMultiple);
    const hasInitialized = useRef(false);

    const config = { ...DEFAULT_PREFETCH_CONFIG, ...customConfig };

    useEffect(() => {
        if (hasInitialized.current || !config.enabled) {
            return;
        }

        hasInitialized.current = true;

        console.log('🚀 ClassifierProvider: Starting prefetch');

        if (config.immediate.length > 0) {
            console.log(`⚡ Loading immediate classifiers: ${config.immediate.join(', ')}`);
            loadMultiple(config.immediate).catch((error) => {
                console.error('Failed to load immediate classifiers:', error);
            });
        }

        if (config.deferred.length > 0) {
            const timer = setTimeout(() => {
                console.log(`⏰ Loading deferred classifiers: ${config.deferred.join(', ')}`);
                loadMultiple(config.deferred).catch((error) => {
                    console.error('Failed to load deferred classifiers:', error);
                });
            }, config.deferredDelay);

            return () => clearTimeout(timer);
        }
    }, [loadMultiple, config]);

    return <>{children}</>;
};
```

---

### 11. hooks/useClassifier.ts

```typescript
import { useCallback } from 'react';
import { useClassifierStore } from '../store/classifierStore';

export function useClassifier(
    key: string,
    options: { autoLoad?: boolean } = {}
) {
    const store = useClassifierStore;

    if (options.autoLoad) {
        const hasData = store.getState().data.has(key);
        const isLoading = store.getState().loading.get(key);

        if (!hasData && !isLoading) {
            store.getState().loadClassifier(key);
        }
    }

    return {
        getData: () => store.getState().getData(key),
        isLoading: () => store.getState().isLoading(key),
        getError: () => store.getState().getError(key),
        load: useCallback((force = false) => {
            return store.getState().loadClassifier(key, force);
        }, [key]),
        clear: useCallback(() => {
            store.getState().clearClassifier(key);
        }, [key]),
    };
}
```

---

### 12. hooks/useClassifierValue.ts

```typescript
import { useClassifierStore } from '../store/classifierStore';
import type { ClassifierItem } from '../types/classifier.types';

export function useClassifierValue(key: string, options: { autoLoad?: boolean } = {}) {
    const data = useClassifierStore((state) => state.data.get(key) || null);
    const isLoading = useClassifierStore((state) => state.loading.get(key) || false);
    const error = useClassifierStore((state) => state.errors.get(key) || null);

    if (options.autoLoad && !data && !isLoading) {
        useClassifierStore.getState().loadClassifier(key);
    }

    return {
        data,
        isLoading,
        isError: error !== null,
        error,
    };
}
```

---

### 13. hooks/useClassifierPrefetch.ts

```typescript
import { useEffect } from 'react';
import { useClassifierStore } from '../store/classifierStore';

export function useClassifierPrefetch(keys: string[]) {
    const loadMultiple = useClassifierStore((state) => state.loadMultiple);

    useEffect(() => {
        if (keys.length > 0) {
            console.log(`🔄 Prefetching classifiers: ${keys.join(', ')}`);
            loadMultiple(keys);
        }
    }, [keys.join(','), loadMultiple]);
}
```

---

### 14. index.ts (Public API)

```typescript
// Provider
export { ClassifierProvider } from './provider/ClassifierProvider';
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
```

---

## 🎯 Quick Setup Commands

```bash
# 1. Create directory structure
cd src/features
mkdir -p classifiers/{types,constants,api,storage,cache,store,provider,hooks}

# 2. Install dependencies
npm install zustand

# 3. Create .env file
echo "VITE_API_BASE_URL=https://api.yourapp.com" > .env

# 4. Copy files from above
# Copy each section to corresponding file

# 5. Update App.tsx
# Wrap your app with ClassifierProvider
```

---

## ✅ Verification

After setup, verify with this test component:

```tsx
import React from 'react';
import { useClassifierValue, CLASSIFIER_KEYS } from '@/features/classifiers';

export const TestClassifier: React.FC = () => {
  const { data, isLoading, isError } = useClassifierValue(
    CLASSIFIER_KEYS.CATEGORIES,
    { autoLoad: true }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <h3>Classifiers Work! ✅</h3>
      <p>Loaded {data?.length || 0} items</p>
    </div>
  );
};
```

---

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Step-by-step setup
- [EXAMPLES.md](./EXAMPLES.md) - Usage examples

---

**Ready to use! 🚀**
