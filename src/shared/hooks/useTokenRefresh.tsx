import { useEffect, useRef } from 'react';
import { getValidToken, getTimeUntilExpiry } from '../utils/tokenUtils';
import apiClient from '../api/ApiClient';

interface UseTokenRefreshOptions {
    enabled?: boolean; // Enable/disable refresh
    refreshThreshold?: number; // Seconds before expiry to trigger refresh (default: 300 = 5 min)
    checkInterval?: number; // How often to check (ms) (default: 30000 = 30 seconds)
    onRefreshSuccess?: () => void;
    onRefreshError?: (error: any) => void;
}

/**
 * ⭐ useTokenRefresh Hook
 *
 * Proactively refreshes access token before it expires.
 * This prevents 401 errors and provides seamless UX.
 *
 * Position: Use in App.tsx or AuthContext
 *
 * Example:
 * ```typescript
 * useTokenRefresh({
 *   enabled: isAuthenticated,
 *   refreshThreshold: 300, // Refresh 5 minutes before expiry
 *   onRefreshSuccess: () => console.log('Token refreshed'),
 * });
 * ```
 */
export const useTokenRefresh = ({
                                    enabled = true,
                                    refreshThreshold = 300, // 5 minutes
                                    checkInterval = 30000, // 30 seconds
                                    onRefreshSuccess,
                                    onRefreshError,
                                }: UseTokenRefreshOptions = {}) => {
    const isRefreshing = useRef(false);
    const refreshAttempts = useRef(0);
    const maxRefreshAttempts = 3;

    useEffect(() => {
        if (!enabled) {
            console.log('🔄 Token refresh disabled');
            return;
        }

        console.log('🔄 Token refresh enabled (threshold:', refreshThreshold, 'seconds)');

        const checkAndRefresh = async () => {
            // Skip if already refreshing
            if (isRefreshing.current) {
                console.log('🔄 Token refresh already in progress - skipping');
                return;
            }

            // Get current token
            const token = getValidToken();
            if (!token) {
                console.log('⚠️ No valid token to refresh');
                return;
            }

            // Get time until expiry
            const remaining = getTimeUntilExpiry(token);
            if (remaining === null) {
                console.log('⚠️ Token has no expiry claim');
                return;
            }

            console.log(`⏰ Token expires in ${remaining} seconds`);

            // Check if token needs refresh
            if (remaining <= refreshThreshold && remaining > 0) {
                console.log(`🔄 Token expires soon (${remaining}s) - attempting proactive refresh...`);

                // Check max attempts
                if (refreshAttempts.current >= maxRefreshAttempts) {
                    console.error('❌ Max refresh attempts reached');
                    onRefreshError?.(new Error('Max refresh attempts reached'));
                    return;
                }

                try {
                    isRefreshing.current = true;
                    refreshAttempts.current += 1;

                    // Get refresh token
                    const refreshToken = localStorage.getItem('refresh-token');
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    console.log('🔄 Calling refresh token endpoint...');

                    // Call refresh endpoint
                    const response = await apiClient.post<{ token: string }>('/auth/refresh', {
                        refreshToken,
                    });

                    if (response.data.token) {
                        // Save new access token
                        apiClient.setToken(response.data.token);
                        console.log('✅ Token proactively refreshed');

                        // Reset attempts on success
                        refreshAttempts.current = 0;

                        onRefreshSuccess?.();
                    }
                } catch (error: any) {
                    console.error('❌ Proactive token refresh failed:', error.response?.data || error.message);
                    onRefreshError?.(error);

                    // If refresh fails, let the reactive refresh (in ApiClient) handle it
                } finally {
                    isRefreshing.current = false;
                }
            }
        };

        // Initial check
        checkAndRefresh();

        // Set up interval
        const interval = setInterval(checkAndRefresh, checkInterval);

        return () => {
            clearInterval(interval);
            console.log('🔄 Token refresh cleanup');
        };
    }, [enabled, refreshThreshold, checkInterval, onRefreshSuccess, onRefreshError]);
};