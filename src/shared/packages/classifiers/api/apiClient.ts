// src/features/classifiers/api/apiClient.ts

import axios from 'axios';
import { getValidToken } from '@/shared/utils/tokenUtils';

const rawBase = import.meta.env.VITE_API_URL as string | undefined;
// Classifier endpoints include /api/ prefix, so strip /api from the base URL
const BASE_URL = rawBase
    ? rawBase.replace(/\/api\/?$/, '')
    : 'https://survey-moesdapi.geostat.ge';

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use((config) => {
    const token = getValidToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const apiClient = {
    get: <T>(endpoint: string) => axiosInstance.get<T>(endpoint),
};