// shared/components/ui/Notification/Notification.tsx

import React, { useEffect } from 'react';
import { NotificationType, type Notification as NotificationItem } from '@/shared/packages/notifications/types/notification.types.ts';
import styles from './Notification.module.css';

interface NotificationProps {
    notification: NotificationItem;
    onDismiss: (id: string) => void;
}

const TYPE_CONFIG = {
    [NotificationType.SUCCESS]: {
        icon: '✓',
        className: styles.success,
    },
    [NotificationType.ERROR]: {
        icon: '✕',
        className: styles.error,
    },
    [NotificationType.WARNING]: {
        icon: '⚠',
        className: styles.warning,
    },
    [NotificationType.INFO]: {
        icon: 'ℹ',
        className: styles.info,
    },
};

export const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
    console.log('🔔 [Notification] Rendering notification:', notification);

    const config = TYPE_CONFIG[notification.type];
    console.log('🔔 [Notification] Config:', config);

    useEffect(() => {
        console.log('🔔 [Notification] useEffect - setting timeout for:', notification.id);

        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(() => {
                console.log('⏰ [Notification] Auto-dismiss timer fired for:', notification.id);
                onDismiss(notification.id);
            }, notification.duration);

            return () => {
                console.log('🧹 [Notification] Cleanup timer for:', notification.id);
                clearTimeout(timer);
            };
        }
    }, [notification.id, notification.duration, onDismiss]);

    return (
        <div
            className={`${styles.notification} ${config.className}`}
            role="alert"
            aria-live="polite"
            style={{ border: '2px solid red' }} // ✅ Test style
        >
            {console.log('🔔 [Notification] Rendering JSX for:', notification.id)}
            <div className={styles.content}>
                <span className={styles.icon}>{config.icon}</span>
                <span className={styles.message}>{notification.message}</span>
            </div>

            {notification.dismissible && (
                <button
                    className={styles.dismiss}
                    onClick={() => {
                        console.log('❌ [Notification] Dismiss clicked:', notification.id);
                        onDismiss(notification.id);
                    }}
                    aria-label="Close"
                    type="button"
                >
                    ×
                </button>
            )}
        </div>
    );
};