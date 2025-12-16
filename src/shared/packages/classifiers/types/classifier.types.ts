// src/features/classifiers/types/classifier.types.ts

/**
 * Classifier item structure
 */
export interface ClassifierItem {
    id: string | number;
    name: string;
    code?: string | number;
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
    ttl?: number; // Time to live in milliseconds
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