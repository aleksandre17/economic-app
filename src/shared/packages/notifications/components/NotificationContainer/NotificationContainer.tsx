// shared/components/ui/NotificationContainer/NotificationContainer.tsx

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { Notification } from '@/shared/packages/notifications/components/Notification/Notification.tsx';
import type { Notification as NotificationItem } from '@/shared/packages/notifications/types/notification.types.ts';
import styles from './NotificationContainer.module.css';

interface NotificationContainerProps {
    notifications: NotificationItem[];
    onDismiss: (id: string) => void;
}

// ✅ Memoize - only re-renders when notifications change
export const NotificationContainer = memo<NotificationContainerProps>(({
                                                                           notifications,
                                                                           onDismiss,
                                                                       }) => {
    console.log('🔄 NotificationContainer rendered:', notifications.length);

    if (notifications.length === 0) {
        return null;
    }

    return createPortal(
        <div className={styles.container}>
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    notification={notification}
                    onDismiss={onDismiss}
                />
            ))}
        </div>,
        document.body
    );
});

NotificationContainer.displayName = 'NotificationContainer';