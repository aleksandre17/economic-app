// src/shared/notifications/index.ts

/**
 * Global Notification System
 *
 * Usage:
 *
 * 1. Import store in any component:
 *    import { useNotificationStore, NotificationType } from '@/shared/notifications';
 *
 * 2. Get showNotification function:
 *    const showNotification = useNotificationStore((state) => state.showNotification);
 *
 * 3. Show notification:
 *    showNotification('Success!', NotificationType.SUCCESS);
 */

export { useNotificationStore } from './store/notificationStore';
export { NotificationContainer } from './components/NotificationContainer/NotificationContainer';
export { NotificationType } from './types/notification.types';
export type { Notification } from './types/notification.types';