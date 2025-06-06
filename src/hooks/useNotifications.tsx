import { useState, useEffect, useCallback } from 'react';
import { fetchUserNotifications, markNotificationAsRead } from '../api/notifications';
import { Notification } from '../types/notification.types';

interface UseNotificationsOptions {
    initialFetch?: boolean;
    unreadOnly?: boolean;
    pollingInterval?: number; // in milliseconds
}

/**
 * Custom hook for managing user notifications
 * @param options Hook configuration options
 * @returns Notifications state and methods
 */
const useNotifications = (options: UseNotificationsOptions = {}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {
        initialFetch = true,
        unreadOnly = false,
        pollingInterval = 0  // 0 means no polling
    } = options;

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchUserNotifications({ unreadOnly });
            setNotifications(data);

            // Count unread notifications
            const unread = data.filter(notification => !notification.isRead).length;
            setUnreadCount(unread);

            return data;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch notifications');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [unreadOnly]);

    // Mark a notification as read
    const markAsRead = useCallback(async (notificationId: number) => {
        try {
            await markNotificationAsRead(notificationId);

            // Update local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification.notificationId === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            // Decrement unread count
            setUnreadCount(prev => Math.max(0, prev - 1));

            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to mark notification as read');
            return false;
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            // Update local state immediately for better UX
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);

            // For each unread notification, send an API call
            const promises = notifications
                .filter(notification => !notification.isRead)
                .map(notification => markNotificationAsRead(notification.notificationId));

            await Promise.all(promises);
            return true;
        } catch (err: any) {
            // If there's an error, refresh the notifications to get the correct state
            fetchNotifications();
            setError(err.message || 'Failed to mark all notifications as read');
            return false;
        }
    }, [notifications, fetchNotifications]);

    // Initial fetch
    useEffect(() => {
        if (initialFetch) {
            fetchNotifications();
        }
    }, [fetchNotifications, initialFetch]);

    // Set up polling if requested
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (pollingInterval > 0) {
            intervalId = setInterval(fetchNotifications, pollingInterval);
        }

        // Cleanup interval on unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchNotifications, pollingInterval]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
};

export default useNotifications;