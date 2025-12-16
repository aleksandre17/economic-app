// src/features/classifiers/constants/classifierKeys.ts

import {ClassifierConfig, ClassifierItem} from "@/shared/packages/classifiers";

/**
 * Classifier identifiers
 * Single source of truth for all classifiers
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
        endpoint: '/api/v1/classifiers/professions',
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        version: '1.0.0',
        transform: (data: ClassifierItem[]) => {
            return data.map(item => {
                const codeStr = typeof item.code === 'number' ? item.code.toString() : String(item.code ?? '');
                return {
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    ...(codeStr.length <= 2 ? { isActive: true } : {})
                };
            });
        }
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