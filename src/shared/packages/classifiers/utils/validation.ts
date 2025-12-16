// src/features/classifiers/utils/validation.ts

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
        return true; // No version check needed
    }

    return entry.version === expectedVersion;
}

/**
 * Check if cache entry is stale (needs refresh)
 * Considered stale if it's 80% through its TTL
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
 * Removes invalid items and returns cleaned array
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
        console.warn(`⚠️ Removed ${data.length - cleaned.length} invalid items from classifier data`);
    }

    return cleaned;
}

/**
 * Sanitize classifier item
 * Ensures all fields are properly typed and safe
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
 * Check if localStorage is available and working
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
 * Get cache age in milliseconds
 */
export function getCacheAge(entry: StorageEntry): number {
    return Date.now() - entry.fetchedAt;
}

/**
 * Format TTL for human reading
 */
export function formatTTL(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}

/**
 * Check if two classifier arrays are equal
 */
export function areClassifiersEqual(a: ClassifierItem[], b: ClassifierItem[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    return a.every((itemA, index) => {
        const itemB = b[index];
        return (
            itemA.id === itemB.id &&
            itemA.name === itemB.name &&
            itemA.code === itemB.code &&
            itemA.parentId === itemB.parentId &&
            itemA.isActive === itemB.isActive
        );
    });
}

/**
 * Validate classifier key
 */
export function isValidClassifierKey(key: string): boolean {
    if (!key || typeof key !== 'string') {
        return false;
    }

    // Key should be alphanumeric with underscores
    const keyPattern = /^[a-z0-9_]+$/;
    return keyPattern.test(key);
}

/**
 * Calculate total size of classifier data in bytes
 */
export function calculateDataSize(data: ClassifierItem[]): number {
    try {
        const jsonString = JSON.stringify(data);
        return new Blob([jsonString]).size;
    } catch (error) {
        console.error('Failed to calculate data size:', error);
        return 0;
    }
}

/**
 * Check if data size exceeds recommended limit
 */
export function isDataSizeTooLarge(data: ClassifierItem[], maxSizeKB: number = 100): boolean {
    const sizeBytes = calculateDataSize(data);
    const sizeKB = sizeBytes / 1024;
    return sizeKB > maxSizeKB;
}

/**
 * Validate cache health
 * Returns health report
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
        issues.push('Cache is stale (>80% of TTL elapsed)');
    }

    if (entry.data.length === 0) {
        issues.push('Empty data array');
    }

    const dataSize = calculateDataSize(entry.data);
    if (dataSize > 200 * 1024) { // 200KB
        issues.push(`Large data size: ${(dataSize / 1024).toFixed(2)}KB`);
    }

    return {
        isValid: issues.length === 0,
        isExpired,
        isStale,
        age: getCacheAge(entry),
        remainingTTL: getRemainingTTL(entry),
        issues,
    };
}

/**
 * Deduplicate classifier items by id
 * Keeps the first occurrence
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
        console.warn(`⚠️ Removed ${data.length - deduplicated.length} duplicate classifiers`);
    }

    return deduplicated;
}

/**
 * Sort classifiers by name (case-insensitive)
 */
export function sortClassifiersByName(data: ClassifierItem[]): ClassifierItem[] {
    return [...data].sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}

/**
 * Filter active classifiers only
 */
export function filterActiveClassifiers(data: ClassifierItem[]): ClassifierItem[] {
    return data.filter(item => item.isActive !== false);
}