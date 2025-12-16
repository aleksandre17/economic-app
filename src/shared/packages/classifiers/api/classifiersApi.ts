// src/features/classifiers/api/classifiersApi.ts

import { apiClient } from './apiClient';
import type { ClassifierItem, ClassifierConfig } from '../types/classifier.types';

/**
 * API layer for classifier requests
 */
class ClassifiersApi {
    /**
     * Fetch classifier data from API
     */
    async fetchClassifier(config: ClassifierConfig): Promise<ClassifierItem[]> {
        try {
            console.log(`🌐 Fetching classifier: ${config.key}`);

            const response = await apiClient.get<any>(config.endpoint);

            // Transform if needed
            const data = config.transform ? config.transform(response.data) : response;

            console.log(`✅ Fetched classifier: ${config.key} (${data.length} items)`);

            return data;
        } catch (error) {
            console.error(`❌ Failed to fetch classifier ${config.key}:`, error);
            throw error;
        }
    }

    /**
     * Fetch multiple classifiers in parallel
     */
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

// ✅ Singleton instance
export const classifiersApi = new ClassifiersApi();