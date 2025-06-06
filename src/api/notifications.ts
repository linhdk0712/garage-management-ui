import apiClient from './apiClient';
import { Notification } from '../types/notification.types';

/**
 * Fetch notifications for the current user
 * @param params Optional filter parameters
 * @returns Array of notifications
 */
export const fetchUserNotifications = async (params?: {
    unreadOnly?: boolean;
}): Promise<Notification[]> => {
    return apiClient.get<Notification[]>('/notifications', { params });
};

/**
 * Mark a notification as read
 * @param notificationId ID of the notification
 * @returns Success message
 */
export const markNotificationAsRead = async (notificationId: number): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`/notifications/${notificationId}/read`);
};

/**
 * Mark all notifications as read
 * @returns Success message
 */
export const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/notifications/read-all');
};

/**
 * Fetch customer notifications (for staff/manager to check if notifications were sent)
 * @param customerId ID of the customer
 * @returns Array of notifications
 */
export const fetchCustomerNotifications = async (
    customerId: number,
    params?: { unreadOnly?: boolean }
): Promise<Notification[]> => {
    return apiClient.get<Notification[]>(`/manager/customers/${customerId}/notifications`, { params });
};

/**
 * Send a manual notification to a customer
 * @param customerId ID of the customer
 * @param notificationData Notification data
 * @returns Created notification
 */
export const sendCustomerNotification = async (
    customerId: number,
    notificationData: {
        title: string;
        message: string;
        type: string;
    }
): Promise<Notification> => {
    return apiClient.post<Notification>(
        `/manager/customers/${customerId}/notifications`,
        notificationData
    );
};