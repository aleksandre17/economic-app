// src/features/classifiers/storage/storageKeys.ts

const STORAGE_PREFIX = 'classifier';
const VERSION_KEY = 'version';

export const getStorageKey = (classifierKey: string): string => {
    return `${STORAGE_PREFIX}:${classifierKey}`;
};

export const getVersionKey = (classifierKey: string): string => {
    return `${STORAGE_PREFIX}:${classifierKey}:${VERSION_KEY}`;
};