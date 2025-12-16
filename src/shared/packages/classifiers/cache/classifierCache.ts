// src/features/classifiers/cache/classifierCache.ts

import type { ClassifierItem } from '../types/classifier.types.ts';

/**
 * In-memory cache for active classifiers
 * Faster than localStorage, cleared on page refresh
 */
class ClassifierCache {
    private cache: Map<string, ClassifierItem[]> = new Map();
    private pendingRequests: Map<string, Promise<ClassifierItem[]>> = new Map();

    /**
     * Get classifier from memory cache
     */
    get(key: string): ClassifierItem[] | null {
        return this.cache.get(key) || null;
    }

    /**
     * Set classifier in memory cache
     */
    set(key: string, data: ClassifierItem[]): void {
        this.cache.set(key, data);
    }

    /**
     * Check if classifier exists in cache
     */
    has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Remove classifier from cache
     */
    remove(key: string): void {
        this.cache.delete(key);
        this.pendingRequests.delete(key);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        this.pendingRequests.clear();
    }

    /**
     * Get or set pending request (deduplication)
     */
    getPendingRequest(key: string): Promise<ClassifierItem[]> | null {
        return this.pendingRequests.get(key) || null;
    }

    /**
     * Set pending request
     */
    setPendingRequest(key: string, promise: Promise<ClassifierItem[]>): void {
        this.pendingRequests.set(key, promise);

        // Cleanup after resolution
        promise.finally(() => {
            this.pendingRequests.delete(key);
        });
    }

    /**
     * Get cache statistics
     */
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

// ✅ Singleton instance
export const classifierCache = new ClassifierCache();