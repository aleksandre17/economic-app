import type {LoginCredentials, AuthResponse, User} from '../types/auth.types';
import { apiClient } from '../../../shared/api';
import {STORAGE_KEY} from "../../survey/context/surveyContext.tsx";


/**
 * ═══════════════════════════════════════════════════════════
 * Auth API - Spring Boot Integration
 * ═══════════════════════════════════════════════════════════
 *
 * Backend Endpoints:
 * - POST   /api/auth/login      → Get JWT token
 * - POST   /api/auth/logout     → Logout (optional)
 * - GET    /api/auth/me         → Get current user
 * - POST   /api/auth/refresh    → Refresh token
 * - GET    /api/auth/validate   → Validate token
 */

export const authApi = {

    /**
     * ⭐ Login user
     *
     * Spring Boot: POST /api/auth/login
     * Request: { email: string, password: string }
     * Response: { token, refreshToken, user, expiresIn }
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {


            const response = await apiClient.post<AuthResponse>('/auth/login', {
                email: credentials.email,
                password: credentials.password,
            });

            // if (!response.status || response.status !== 200) {
            //     throw new Error('არასწორი ელ. ფოსტა ან პაროლი');
            // }

            // Save token after successful login
            if (response.data.token) {
                apiClient.setToken(response.data.token);
                console.log('✅ Login successful, token saved');

                // Optional: Save refresh token separately
                if (response.data.refreshToken) {
                    localStorage.setItem('refresh-token', response.data.refreshToken);
                }
            }

            return {...response.data, success: true};
        } catch (error) {
            console.error('❌ Login failed:', error.response?.data || error.message);
            throw error;
        }
    },


    /**
     * ⭐ Get current authenticated user
     *
     * Spring Boot: GET /api/auth/me
     * Headers: Authorization: Bearer {token}
     * Response: { id, name, email, role, ... }
     */
    getCurrentUser: async (): Promise<User> => {
        try {
            console.log('👤 Fetching current user');

            const response = await apiClient.get<User>('/auth/user');

            console.log('✅ User fetched:', response.data.email);
            return response.data;
        } catch (error: any) {
            console.error('❌ Get current user failed:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * ⭐ Logout user
     *
     * Spring Boot: POST /api/auth/logout (optional)
     * Note: JWT is stateless, so logout is primarily client-side
     */

    logout: async (): Promise<void> => {
        try {
            console.log('🚪 Logging out...');

            // Optional: Call backend logout endpoint (for logging/analytics)
            try {
                //await apiClient.post('/auth/logout');
            } catch (error) {
                // Backend logout is optional, don't fail if it errors
                console.warn('⚠️ Backend logout failed (continuing anyway):', error);
            }

            // Remove tokens from client
            apiClient.removeToken();
            localStorage.removeItem('refresh-token');
            localStorage.removeItem(STORAGE_KEY)

            console.log('✅ Logged out successfully');
        } catch (error: any) {
            console.error('❌ Logout error:', error);
            // Still remove tokens even if backend call fails
            apiClient.removeToken();
            localStorage.removeItem('refresh-token');
            throw error;
        }
    },


    /**
     * ⭐ Refresh access token
     *
     * Spring Boot: POST /api/auth/refresh
     * Request: { refreshToken: string }
     * Response: { token: string }
     */
    refreshToken: async (): Promise<{ token: string }> => {
        try {
            const refreshToken = localStorage.getItem('refresh-token');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            console.log('🔄 Refreshing token...');

            const response = await apiClient.post<{ token: string }>('/auth/refresh', {
                refreshToken,
            });

            if (response.data.token) {
                // Save new access token
                apiClient.setToken(response.data.token);
                console.log('✅ Token refreshed successfully');
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ Token refresh failed:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * ⭐ Validate current token
     *
     * Spring Boot: GET /api/auth/validate
     * Response: { valid: boolean, email: string }
     */
    validateToken: async (): Promise<{ valid: boolean; email: string }> => {
        try {
            console.log('🔍 Validating token...');

            const response = await apiClient.get<{ valid: boolean; email: string }>(
                '/auth/validate'
            );

            console.log('✅ Token validated:', response.data.valid);
            return response.data;
        } catch (error: any) {
            console.error('❌ Token validation failed:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * ⭐ Register new user (optional - if you implement registration)
     *
     * Spring Boot: POST /api/auth/register
     * Request: { name, email, password, phoneNumber }
     * Response: { token, user, ... }
     */
    register: async (data: {
        name: string;
        email: string;
        password: string;
        phoneNumber?: string;
    }): Promise<AuthResponse> => {
        try {
            console.log('📝 Registering new user:', data.email);

            const response = await apiClient.post<AuthResponse>('/auth/register', data);

            if (response.data.token) {
                apiClient.setToken(response.data.token);
                console.log('✅ Registration successful, token saved');
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ Registration failed:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * ⭐ Change password (optional)
     *
     * Spring Boot: POST /api/auth/change-password
     * Request: { oldPassword, newPassword }
     * Response: { success: boolean, message: string }
     */
    changePassword: async (data: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{ success: boolean; message: string }> => {
        try {
            console.log('🔐 Changing password...');

            const response = await apiClient.post<{ success: boolean; message: string }>(
                '/auth/change-password',
                data
            );

            console.log('✅ Password changed successfully');
            return response.data;
        } catch (error: any) {
            console.error('❌ Change password failed:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * ⭐ Request password reset (optional)
     *
     * Spring Boot: POST /api/auth/forgot-password
     * Request: { email: string }
     * Response: { success: boolean, message: string }
     */
    forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
        try {
            console.log('📧 Requesting password reset for:', email);

            const response = await apiClient.post<{ success: boolean; message: string }>(
                '/auth/forgot-password',
                { email }
            );

            console.log('✅ Password reset email sent');
            return response.data;
        } catch (error: any) {
            console.error('❌ Forgot password failed:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * ⭐ Reset password with token (optional)
     *
     * Spring Boot: POST /api/auth/reset-password
     * Request: { token: string, newPassword: string }
     * Response: { success: boolean, message: string }
     */
    resetPassword: async (data: {
        token: string;
        newPassword: string;
    }): Promise<{ success: boolean; message: string }> => {
        try {
            console.log('🔐 Resetting password...');

            const response = await apiClient.post<{ success: boolean; message: string }>(
                '/auth/reset-password',
                data
            );

            console.log('✅ Password reset successfully');
            return response.data;
        } catch (error: any) {
            console.error('❌ Reset password failed:', error.response?.data || error.message);
            throw error;
        }
    },

};