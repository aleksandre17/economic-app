import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type {AuthContextValue, LoginCredentials, User} from '../types/auth.types';
import { authApi } from '../api/authApi';
import { getValidToken, getTimeUntilExpiry } from '../../../shared/utils/tokenUtils';
import {apiClient} from "../../../shared/api";
import { useTokenRefresh } from '../../../shared/hooks/useTokenRefresh';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    /**
     * ⭐ Proactive Token Refresh Hook
     * Refreshes token 5 minutes before expiry
     */
    useTokenRefresh({
        enabled: isAuthenticated,
        refreshThreshold: 300, // 5 minutes before expiry
        checkInterval: 30000, // Check every 30 seconds
        onRefreshSuccess: () => {
            console.log('✅ Token proactively refreshed in background');
        },
        onRefreshError: (error) => {
            console.error('❌ Proactive refresh failed:', error);
            // Don't logout here - let reactive refresh (ApiClient) handle it
        },
    });


    /**
     * ⭐ Initialize auth state on mount
     * Calls Spring Boot: GET /api/auth/me
     */
    useEffect(() => {

        const initAuth = async () => {
            try {
                // Check for valid token
                const token = getValidToken();

                if (token) {
                    console.log('🔑 Valid token found - fetching user data');

                    // Log time until expiry
                    const remaining = getTimeUntilExpiry(token);
                    if (remaining) {
                        console.log(`⏰ Token expires in ${remaining} seconds`);
                    }

                    // Fetch current user
                    const userData = await authApi.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ User authenticated:', userData.email);
                } else {
                    console.log('⚠️ No valid token found');
                }
            } catch (error: any) {
                console.error('❌ Auth initialization error:', error);

                // If 401, token is invalid
                if (error.response?.status === 401) {
                    console.log('🔐 Token invalid - clearing auth state');
                    handleLogout();
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * ⭐ Listen for auth:logout custom event (from ApiClient)
     */
    useEffect(() => {
        const handleAutoLogout = (event: CustomEvent) => {
            console.log('🚪 Auto logout triggered:', event.detail?.reason);

            // Clear user state
            setUser(null);
            setIsAuthenticated(false);

            // Show notification (optional)
            if (event.detail?.reason === 'token_expired') {
                // You can show a toast/notification here
                console.log('⚠️ Your session has expired. Please login again.');
            }
        };

        window.addEventListener('auth:logout' as any, handleAutoLogout);

        return () => {
            window.removeEventListener('auth:logout' as any, handleAutoLogout);
        };
    }, []);


    /**
     * ⭐ Periodic token validation check (every 1 minute)
     */
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            const token = getValidToken();

            if (!token) {
                console.log('🔴 Token no longer valid - logging out');
                handleLogout();
            } else {
                const remaining = getTimeUntilExpiry(token);
                if (remaining && remaining < 300) { // Less than 5 minutes
                    console.log(`⚠️ Token expires soon: ${remaining}s remaining`);
                    // You could trigger a token refresh here
                }
            }
        }, 60000); // Every 1 minute

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            console.log('🔐 Attempting login:', credentials);

            const response = await authApi.login(credentials);

            if (response.token) {
                // Token is saved by authApi (which uses apiClient.setToken)
                console.log('✅ Login successful');

                setUser(response.user);
                setIsAuthenticated(true);

                // Log expiry
                const remaining = getTimeUntilExpiry(response.token);
                if (remaining) {
                    console.log(`⏰ Session valid for ${remaining} seconds`);
                }

                return { success: true };
            } else {
                throw new Error('No token received');
            }
        } catch (error: any) {
            console.error('❌ Login failed:', error.response?.data || error.message);

            // Handle specific error cases
            let errorMessage = 'Login failed';

            if (error.response?.status === 401) {
                errorMessage = 'Invalid email or password';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage,
            };

        } finally {
            setIsLoading(false);
        }
    }, [navigate]);


    const logout = useCallback(async () => {
        try {
            console.log('🚪 Logging out...');
            await authApi.logout();
        } catch (error) {
            console.error('⚠️ Logout API error:', error);
        } finally {
            handleLogout();
        }
    }, [navigate]);

    /**
     * ⭐ Handle logout (clear state and redirect)
     */
    const handleLogout = () => {
        apiClient.removeToken();
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
        console.log('✅ Logged out');
    };

    /**
     * ⭐ Check if user is authenticated with valid token
     */
    const checkAuth = (): boolean => {
        const token = getValidToken();
        const isValid = token !== null && isAuthenticated;

        if (!isValid && isAuthenticated) {
            // Token expired but state still authenticated - logout
            console.log('🔴 Token expired during check - logging out');
            handleLogout();
        }

        return isValid;
    };

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextValue = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        clearError,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};