import { useState, useCallback } from 'react';
import { formatErrorForNotification, ErrorDetails } from '../utils/errorUtils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationState {
    type: NotificationType;
    title: string;
    message: string;
    errorDetails?: ErrorDetails;
    showErrorDetails?: boolean;
}

export interface UseNotificationReturn {
    notification: NotificationState | null;
    showSuccess: (message: string, title?: string) => void;
    showError: (error: unknown, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
    clearNotification: () => void;
    setNotification: (notification: NotificationState | null) => void;
}

/**
 * Custom hook for managing notifications with enhanced error handling
 * @returns Notification state and methods
 */
const useNotification = (): UseNotificationReturn => {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showSuccess = useCallback((message: string, title: string = 'Success') => {
        setNotification({
            type: 'success',
            title,
            message,
        });
    }, []);

    const showError = useCallback((error: unknown, title: string = 'Error') => {
        const errorInfo = formatErrorForNotification(error);
        setNotification({
            type: 'error',
            title,
            message: errorInfo.message,
            errorDetails: errorInfo.errorDetails,
            showErrorDetails: errorInfo.showErrorDetails,
        });
    }, []);

    const showWarning = useCallback((message: string, title: string = 'Warning') => {
        setNotification({
            type: 'warning',
            title,
            message,
        });
    }, []);

    const showInfo = useCallback((message: string, title: string = 'Information') => {
        setNotification({
            type: 'info',
            title,
            message,
        });
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearNotification,
        setNotification,
    };
};

export default useNotification; 