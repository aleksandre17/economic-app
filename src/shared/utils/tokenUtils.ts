/**
 * ═══════════════════════════════════════════════════════════
 * Token Utility Functions
 * ═══════════════════════════════════════════════════════════
 */

interface TokenPayload {
    exp?: number;        // Expiry timestamp (seconds)
    iat?: number;        // Issued at timestamp (seconds)
    userId?: string;
    email?: string;
    [key: string]: any;
}

interface TokenStorage {
    token: string;
    expiresAt: number;   // Timestamp in milliseconds
}

const TOKEN_KEY = 'auth-token';
const TOKEN_EXPIRY_KEY = 'auth-token-expiry';

/**
 * ⭐ Decode JWT token (without verification)
 * Works with standard JWT format: header.payload.signature
 */
export const decodeToken = (token: string): TokenPayload | null => {
    try {
        // Split token into parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('❌ Invalid token format');
            return null;
        }

        // Decode payload (second part)
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const parsed = JSON.parse(decoded);

        console.log('🔓 Token decoded:', {
            exp: parsed.exp ? new Date(parsed.exp * 1000).toISOString() : 'N/A',
            iat: parsed.iat ? new Date(parsed.iat * 1000).toISOString() : 'N/A',
            userId: parsed.userId || parsed.sub,
        });

        return parsed;
    } catch (error) {
        console.error('❌ Token decode error:', error);
        return null;
    }
};

/**
 * ⭐ Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    const payload = decodeToken(token);

    if (!payload || !payload.exp) {
        console.warn('⚠️ Token has no expiry (exp) claim');
        return false; // If no exp, consider it valid
    }

    const now = Date.now() / 1000; // Convert to seconds
    const isExpired = payload.exp < now;

    if (isExpired) {
        const expiredAt = new Date(payload.exp * 1000).toISOString();
        console.log('🔴 Token expired at:', expiredAt);
    } else {
        const expiresIn = Math.floor(payload.exp - now);
        console.log('🟢 Token valid for:', expiresIn, 'seconds');
    }

    return isExpired;
};

/**
 * ⭐ Get token expiry timestamp (milliseconds)
 */
export const getTokenExpiry = (token: string): number | null => {
    const payload = decodeToken(token);

    if (!payload || !payload.exp) {
        return null;
    }

    return payload.exp * 1000; // Convert to milliseconds
};

/**
 * ⭐ Get time until token expires (seconds)
 */
export const getTimeUntilExpiry = (token: string): number | null => {
    const payload = decodeToken(token);

    if (!payload || !payload.exp) {
        return null;
    }

    const now = Date.now() / 1000;
    const remaining = payload.exp - now;

    return Math.max(0, Math.floor(remaining));
};

/**
 * ⭐ Save token with expiry to localStorage
 */
export const saveTokenWithExpiry = (token: string): void => {
    try {
        localStorage.setItem(TOKEN_KEY, token);

        // Try to get expiry from token
        const expiry = getTokenExpiry(token);
        if (expiry) {
            localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
            console.log('✅ Token saved with expiry:', new Date(expiry).toISOString());
        } else {
            // No expiry in token - set default (e.g., 1 hour)
            const defaultExpiry = Date.now() + (60 * 60 * 1000);
            localStorage.setItem(TOKEN_EXPIRY_KEY, defaultExpiry.toString());
            console.log('✅ Token saved with default expiry (1 hour)');
        }
    } catch (error) {
        console.error('❌ Error saving token:', error);
    }
};

/**
 * ⭐ Get token from localStorage and validate expiry
 */
export const getValidToken = (): string | null => {
    try {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            console.log('⚠️ No token found');
            return null;
        }

        // Check expiry
        if (isTokenExpired(token)) {
            console.log('🔴 Token expired - removing');
            removeToken();
            return null;
        }

        return token;
    } catch (error) {
        console.error('❌ Error getting token:', error);
        return null;
    }
};

/**
 * ⭐ Remove token from localStorage
 */
export const removeToken = (): void => {
    try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        console.log('🗑️ Token removed');
    } catch (error) {
        console.error('❌ Error removing token:', error);
    }
};

/**
 * ⭐ Check if token will expire soon (within threshold)
 */
export const willExpireSoon = (token: string, thresholdSeconds: number = 300): boolean => {
    const remaining = getTimeUntilExpiry(token);

    if (remaining === null) {
        return false;
    }

    return remaining < thresholdSeconds;
};

/**
 * ⭐ Get token payload data
 */
export const getTokenData = (token: string): TokenPayload | null => {
    return decodeToken(token);
};

/**
 * ⭐ Format time until expiry (human readable)
 */
export const formatTimeUntilExpiry = (token: string): string => {
    const seconds = getTimeUntilExpiry(token);

    if (seconds === null) {
        return 'Unknown';
    }

    if (seconds <= 0) {
        return 'Expired';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
};