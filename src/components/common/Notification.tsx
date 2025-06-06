import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    showClose?: boolean;
    onClose?: () => void;
    className?: string;
}

const Notification: React.FC<NotificationProps> = ({
                                                       type,
                                                       title,
                                                       message,
                                                       duration = 5000, // Default duration of 5 seconds
                                                       showClose = true,
                                                       onClose,
                                                       className = '',
                                                   }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    // Close the notification after duration
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, handleClose]);

    if (!isVisible) {
        return null;
    }

    const typeStyles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-400',
            icon: <CheckCircle className="h-5 w-5 text-green-400" />,
            title: 'text-green-800',
            text: 'text-green-700',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-400',
            icon: <XCircle className="h-5 w-5 text-red-400" />,
            title: 'text-red-800',
            text: 'text-red-700',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-400',
            icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
            title: 'text-yellow-800',
            text: 'text-yellow-700',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-400',
            icon: <Info className="h-5 w-5 text-blue-400" />,
            title: 'text-blue-800',
            text: 'text-blue-700',
        },
    };

    const style = typeStyles[type];

    return (
        <div className={`rounded-md ${style.bg} border-l-4 ${style.border} p-4 ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">{style.icon}</div>
                <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${style.title}`}>{title}</h3>
                    <div className={`mt-2 text-sm ${style.text}`}>
                        <p>{message}</p>
                    </div>
                </div>
                {showClose && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                onClick={handleClose}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.bg} ${style.text}`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;