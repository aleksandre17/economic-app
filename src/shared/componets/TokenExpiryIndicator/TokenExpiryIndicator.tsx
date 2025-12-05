import React, { useState, useEffect } from 'react';
import { getValidToken, getTimeUntilExpiry, formatTimeUntilExpiry } from '../../utils/tokenUtils';
import styles from './TokenExpiryIndicator.module.css';

interface TokenExpiryIndicatorProps {
    warningThreshold?: number; // Seconds before expiry to show warning (default: 300 = 5 min)
    onExpiringSoon?: () => void; // Callback when token is expiring soon
    onExpired?: () => void; // Callback when token expires
}

export const TokenExpiryIndicator: React.FC<TokenExpiryIndicatorProps> = ({
                                                                              warningThreshold = 300,
                                                                              onExpiringSoon,
                                                                              onExpired,
                                                                          }) => {
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const token = getValidToken();

            if (!token) {
                setTimeRemaining(null);
                setShowWarning(false);
                return;
            }

            const remaining = getTimeUntilExpiry(token);
            setTimeRemaining(remaining);

            if (remaining !== null) {
                // Check if expiring soon
                if (remaining <= warningThreshold && remaining > 0) {
                    if (!showWarning) {
                        setShowWarning(true);
                        onExpiringSoon?.();
                    }
                }

                // Check if expired
                if (remaining <= 0) {
                    setShowWarning(false);
                    onExpired?.();
                }
            }
        };

        // Initial check
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 30000);

        return () => clearInterval(interval);
    }, [warningThreshold, showWarning, onExpiringSoon, onExpired]);

    // Don't show if no token or too much time remaining
    if (timeRemaining === null || timeRemaining > warningThreshold) {
        return null;
    }

    // Expired
    if (timeRemaining <= 0) {
        return (
            <div className={styles.indicator + ' ' + styles.expired}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 4v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Session Expired</span>
            </div>
        );
    }

    // Expiring soon
    const token = localStorage.getItem('auth-token');
    const timeText = token ? formatTimeUntilExpiry(token) : '';

    return (
        <div className={styles.indicator + ' ' + styles.warning}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                    d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3v4m0 2v.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
            <span>Session expires in {timeText}</span>
        </div>
    );
};