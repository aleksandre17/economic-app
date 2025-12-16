// src/pages/ClassifierDebug.tsx

import React, { useState, useEffect } from 'react';
import { useClassifierStore } from '../store/classifierStore.ts';
import { classifierStorage, classifierCache } from '../index.ts';

export const ClassifierDebugPanel: React.FC = () => {
    const [stats, setStats] = useState({
        storeCount: 0,
        memoryCount: 0,
        storageCount: 0,
        storageSize: 0,
    });

    const refreshStats = () => {
        const storeData = useClassifierStore.getState().data;
        const cacheStats = classifierCache.getStats();
        const storageInfo = classifierStorage.getStorageInfo();

        setStats({
            storeCount: storeData.size,
            memoryCount: cacheStats.size,
            storageCount: storageInfo.count,
            storageSize: storageInfo.size,
        });
    };

    useEffect(() => {
        refreshStats();
        const interval = setInterval(refreshStats, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleClearAll = () => {
        useClassifierStore.getState().clearAll();
        refreshStats();
    };

    const handleReload = () => {
        const keys = Array.from(useClassifierStore.getState().data.keys());
        useClassifierStore.getState().loadMultiple(keys);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>🔍 Classifier Debug Panel</h2>

            <div style={{ marginTop: '20px' }}>
                <h3>📊 Statistics</h3>
                <p>Zustand Store: {stats.storeCount} classifiers</p>
                <p>Memory Cache: {stats.memoryCount} classifiers</p>
                <p>LocalStorage: {stats.storageCount} classifiers ({(stats.storageSize / 1024).toFixed(2)} KB)</p>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>🎛️ Actions</h3>
                <button onClick={handleReload} style={{ marginRight: '10px' }}>
                    🔄 Reload All
                </button>
                <button onClick={handleClearAll} style={{ marginRight: '10px' }}>
                    🗑️ Clear All
                </button>
                <button onClick={refreshStats}>
                    📈 Refresh Stats
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>📋 Loaded Classifiers</h3>
                <ul>
                    {Array.from(useClassifierStore.getState().data.keys()).map((key) => {
                        const data = useClassifierStore.getState().getData(key);
                        const isLoading = useClassifierStore.getState().isLoading(key);
                        const error = useClassifierStore.getState().getError(key);

                        return (
                            <li key={key}>
                                <strong>{key}</strong>: {data?.length || 0} items
                                {isLoading && ' (loading...)'}
                                {error && ` (error: ${error.message})`}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};