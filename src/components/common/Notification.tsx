import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { ErrorDetails } from '../../utils/errorUtils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    showClose?: boolean;
    onClose?: () => void;
    className?: string;
    // Enhanced error details for error notifications
    errorDetails?: ErrorDetails;
    showErrorDetails?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
                                                       type,
                                                       title,
                                                       message,
                                                       duration = 5000, // Default duration of 5 seconds
                                                       showClose = true,
                                                       onClose,
                                                       className = '',
                                                       errorDetails,
                                                       showErrorDetails = false,
                                                   }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(showErrorDetails);

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

    const renderErrorDetails = () => {
        if (type !== 'error' || !errorDetails) {
            return null;
        }

        const hasDetails = errorDetails.code || errorDetails.status || errorDetails.details || errorDetails.stack || errorDetails.context;

        if (!hasDetails) {
            return null;
        }

        return (
            <div className="mt-3 border-t border-red-200 pt-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-sm font-medium text-red-700 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                >
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                        <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    Error Details
                </button>
                
                {isExpanded && (
                    <div className="mt-2 space-y-2">
                        {errorDetails.code && (
                            <div className="text-xs">
                                <span className="font-medium text-red-700">Error Code:</span>
                                <span className="ml-2 text-red-600 font-mono bg-red-100 px-2 py-1 rounded">
                                    {errorDetails.code}
                                </span>
                            </div>
                        )}
                        
                        {errorDetails.status && (
                            <div className="text-xs">
                                <span className="font-medium text-red-700">Status:</span>
                                <span className="ml-2 text-red-600 font-mono bg-red-100 px-2 py-1 rounded">
                                    {errorDetails.status}
                                </span>
                            </div>
                        )}
                        
                        {errorDetails.timestamp && (
                            <div className="text-xs">
                                <span className="font-medium text-red-700">Timestamp:</span>
                                <span className="ml-2 text-red-600">
                                    {new Date(errorDetails.timestamp).toLocaleString()}
                                </span>
                            </div>
                        )}
                        
                        {errorDetails.details && (
                            <div className="text-xs">
                                <span className="font-medium text-red-700">Details:</span>
                                <div className="mt-1 text-red-600 bg-red-100 p-2 rounded font-mono text-xs break-words">
                                    {errorDetails.details}
                                </div>
                            </div>
                        )}
                        
                        {errorDetails.context && Object.keys(errorDetails.context).length > 0 && (
                            <div className="text-xs">
                                <span className="font-medium text-red-700">Context:</span>
                                <div className="mt-1 text-red-600 bg-red-100 p-2 rounded font-mono text-xs break-words">
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(errorDetails.context, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                        
                        {errorDetails.stack && (
                            <div className="text-xs">
                                <span className="font-medium text-red-700">Stack Trace:</span>
                                <div className="mt-1 text-red-600 bg-red-100 p-2 rounded font-mono text-xs break-words max-h-32 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap">
                                        {errorDetails.stack}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`rounded-md ${style.bg} border-l-4 ${style.border} p-4 ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">{style.icon}</div>
                <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${style.title}`}>{title}</h3>
                    <div className={`mt-2 text-sm ${style.text}`}>
                        <p>{message}</p>
                    </div>
                    {renderErrorDetails()}
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