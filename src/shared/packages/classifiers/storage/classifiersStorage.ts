// src/features/classifiers/storage/classifiersStorage.ts

import { getStorageKey } from './storageKeys';
import type { ClassifierItem, StorageEntry } from '../types/classifier.types';

/**
 * LocalStorage abstraction layer
 * Handles serialization, versioning, and TTL
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
            // Handle quota exceeded error
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                this.clearOldest();
                // Retry
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
     * Clear oldest classifier (used when quota exceeded)
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

// ✅ Singleton instance
export const classifierStorage = new ClassifierStorage();