import axios, {type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import {
    getValidToken,
    saveTokenWithExpiry,
    removeToken,
    isTokenExpired,
    getTimeUntilExpiry
} from '../utils/tokenUtils';

interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
}

interface QueryParams {
    [key: string]: string | number | boolean | null | undefined;
}

class ApiClient {
    private instance: AxiosInstance;
    private tokenCheckInterval: any = null;

    constructor(config: ApiClientConfig) {
        this.instance = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });

        this.setupInterceptors();
        this.startTokenExpiryCheck();
    }

    /**
     * ⭐ Setup Request & Response Interceptors
     */
    private setupInterceptors(): void {
        // ═══════════════════════════════════════════════════════════
        // REQUEST INTERCEPTOR - Add Token
        // ═══════════════════════════════════════════════════════════
        this.instance.interceptors.request.use(
            (config) => {
                const token = getValidToken();

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;

                    const remaining = getTimeUntilExpiry(token);
                    if (remaining !== null) {
                        console.log(`🔑 Token valid for ${remaining}s - Request:`, config.url);
                    }
                } else {
                    console.log('⚠️ No token found for request:', config.url);
                }

                // Log request details (development only)
                if (import.meta.env.DEV) {
                    console.log('📤 API Request:', {
                        method: config.method?.toUpperCase(),
                        url: config.url,
                        params: config.params,
                        data: config.data,
                    });
                }

                return config;
            },
            (error: AxiosError) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // ═══════════════════════════════════════════════════════════
        // RESPONSE INTERCEPTOR - Handle Errors
        // ═══════════════════════════════════════════════════════════
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Log response details (development only)
                if (import.meta.env.DEV) {
                    console.log('📥 API Response:', {
                        status: response.status,
                        url: response.config.url,
                        data: response.data,
                    });
                }

                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config;

                // Handle different error types
                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data as any;

                    console.error('❌ API Error:', {
                        status,
                        url: originalRequest?.url,
                        message: data?.message || error.message,
                    });

                    // 401 Unauthorized - Token expired or invalid
                    if (status === 401) {
                        console.log('🔐 Unauthorized - Redirecting to login...');
                        this.handleUnauthorized();
                    }

                    // 403 Forbidden
                    if (status === 403) {
                        console.log('⛔ Forbidden - Access denied');
                    }

                    // 404 Not Found
                    if (status === 404) {
                        console.log('🔍 Not Found:', originalRequest?.url);
                    }

                    // 500 Server Error
                    if (status >= 500) {
                        console.log('🔥 Server Error:', status);
                    }
                } else if (error.request) {
                    // Network error - no response received
                    console.error('🌐 Network Error - No response received');
                } else {
                    // Something else happened
                    console.error('❌ Error:', error.message);
                }

                return Promise.reject(error);
            }
        );
    }


    /**
     * ⭐ Start periodic token expiry check (every 30 seconds)
     */
    private startTokenExpiryCheck(): void {
        // Clear existing interval
        if (this.tokenCheckInterval) {
            clearInterval(this.tokenCheckInterval);
        }

        // Check every 30 seconds
        this.tokenCheckInterval = setInterval(() => {
            const token = localStorage.getItem('auth-token');

            if (token && isTokenExpired(token)) {
                console.log('🔴 Token expired - logout');
                this.handleUnauthorized();
            }
        }, 30000); // 30 seconds

        console.log('⏰ Token expiry check started');
    }

    /**
     * ⭐ Stop token expiry check
     */
    public stopTokenExpiryCheck(): void {
        if (this.tokenCheckInterval) {
            clearInterval(this.tokenCheckInterval);
            this.tokenCheckInterval = null;
            console.log('⏰ Token expiry check stopped');
        }
    }

    /**
     * ⭐ Set Token to localStorage
     */
    public setToken(token: string): void {
        try {
            if (isTokenExpired(token)) {
                console.error('❌ Cannot save expired token');
                return;
            }
            saveTokenWithExpiry(token);
            console.log('✅ Token saved');
        } catch (error) {
            console.error('❌ Error saving token:', error);
        }
    }

    /**
     * ⭐ Get Token (validated)
     */
    public getToken(): string | null {
        return getValidToken();
    }

    /**
     * ⭐ Remove Token
     */
    public removeToken(): void {
        removeToken();
    }

    /**
     * ⭐ Check if token is valid
     */
    public isTokenValid(): boolean {
        const token = getValidToken();
        return token !== null;
    }

    public isLoginPageAll() {
        // check pathname (handles /login and /app/.../login and trailing slash)
        const path = (window.location.pathname || "").replace(/\/+$/, "");
        if (path === "/login" || path.endsWith("/login")) return true;

        // check hash (for hash routers)
        const hash = (window.location.hash || "").replace(/^#+/, "").replace(/\/+$/, "");
        if (hash === "/login" || hash.endsWith("/login")) return true;

        // check href fallback (covers login appearing in query or weird setups)
        if (window.location.href.includes("/login")) return true;

        return false;
    }

    /**
     * ⭐ Handle Unauthorized (401) - Logout and redirect
     */
    private handleUnauthorized(): void {
        removeToken();
        this.stopTokenExpiryCheck();

        if (!this.isLoginPageAll()) {
            // Dispatch custom event for logout
            window.dispatchEvent(new CustomEvent('auth:logout', {
                detail: { reason: 'token_expired' }
            }));

            // Redirect to login
            if (typeof window !== 'undefined') {
                console.log('🚪 Redirecting to login...');
                window.location.href = '/login';
            }
        }
    }

    /**
     * ⭐ Build Query String from params object
     */
    public buildQueryString(params: QueryParams): string {
        const filtered = Object.entries(params).filter(
            ([_, value]) => value !== null && value !== undefined && value !== ''
        );

        if (filtered.length === 0) return '';

        const queryString = filtered
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');

        return `?${queryString}`;
    }

    /**
     * ⭐ Add Query Params to URL
     * Example: addQueryParams('/users', { page: 1, limit: 10 }) → "/users?page=1&limit=10"
     */
    public addQueryParams(url: string, params: QueryParams): string {
        const queryString = this.buildQueryString(params);
        return queryString ? `${url}${queryString}` : url;
    }

    // ═══════════════════════════════════════════════════════════
    // HTTP Methods
    // ═══════════════════════════════════════════════════════════

    /**
     * GET Request
     */
    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.get<T>(url, config);
    }

    /**
     * GET Request with Query Params
     */
    public async getWithParams<T = any>(
        url: string,
        params: QueryParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const fullUrl = this.addQueryParams(url, params);
        return this.instance.get<T>(fullUrl, config);
    }

    /**
     * POST Request
     */
    public async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.instance.post<T>(url, data, config);
    }

    /**
     * PUT Request
     */
    public async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.instance.put<T>(url, data, config);
    }

    /**
     * PATCH Request
     */
    public async patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.instance.patch<T>(url, data, config);
    }

    /**
     * DELETE Request
     */
    public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.delete<T>(url, config);
    }

    /**
     * Get the raw Axios instance (for advanced usage)
     */
    public getAxiosInstance(): AxiosInstance {
        return this.instance;
    }
}

// ═══════════════════════════════════════════════════════════
// Create and Export API Client Instance
// ═══════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://survey-moesdapi.geostat.ge/api';

export const apiClient = new ApiClient({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

export default apiClient;