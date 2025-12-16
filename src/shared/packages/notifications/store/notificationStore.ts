import { create } from 'zustand';
import { NotificationType, type Notification } from '../types/notification.types';
import { v4 as uuid } from "uuid";

const DEFAULT_DURATION = 5000;

interface NotificationStore {
    notifications: Notification[];
    showNotification: (message: string, type?: NotificationType, duration?: number) => void;
    showNotifications: (messages: string[] | string, type?: NotificationType, duration?: number) => void;
    dismissNotification: (id: string) => void;
    clearAll: () => void;
}




/**
 * Global notification store
 * Use anywhere in the app
 */
export const useNotificationStore = create<NotificationStore>((set) => {

    const showNotification = (message: string, type: NotificationType = NotificationType.INFO, duration: number = DEFAULT_DURATION) => {

        const notification: Notification = {
            id: uuid().toString(),
            type,
            message,
            duration,
            dismissible: true,
        };

        set((state) => ({
            notifications: [...state.notifications, notification],
        }));

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== notification.id),
                }));
            }, duration);
        }
    }


    const showNotifications = (messages: string[] | string, type: NotificationType = NotificationType.INFO, duration: number = DEFAULT_DURATION) => {

        if (typeof messages === 'string') {
            //alert("ფად")
            showNotification(messages, type, duration);
            return;
        }

        if (!messages || messages.length === 0) return;

        // Create notification for each message
        const newNotifications: Notification[] = messages.map((message) => ({
            id: uuid().toString(),
            type,
            message,
            duration,
            dismissible: true,
        }));

        set((state) => ({
            notifications: [...state.notifications, ...newNotifications],
        }));

        // Auto dismiss each notification
        if (duration > 0) {
            newNotifications.forEach((notification) => {
                setTimeout(() => {
                    set((state) => ({
                        notifications: state.notifications.filter((n) => n.id !== notification.id),
                    }));
                }, duration);
            });
        }
    }
    return {
      notifications: [],

      showNotification: showNotification,

      // ✅ Multiple notifications from array
      showNotifications: showNotifications,

      dismissNotification: (id) => {
          set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
          }));
      },

      clearAll: () => {
          set({notifications: []});
      }
    }
  });