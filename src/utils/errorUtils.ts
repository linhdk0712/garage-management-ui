import { AxiosError } from 'axios';

export interface ErrorDetails {
    code?: string;
    status?: number;
    timestamp?: string;
    details?: string;
    stack?: string;
    context?: Record<string, any>;
}

/**
 * Extract detailed error information from various error types
 * @param error - The error object to extract details from
 * @returns Formatted error details object
 */
export const extractErrorDetails = (error: unknown): ErrorDetails => {
    const details: ErrorDetails = {
        timestamp: new Date().toISOString(),
    };

    if (error instanceof Error) {
        details.details = error.message;
        details.stack = error.stack;
        
        // Check if it's an AxiosError for API errors
        if (error instanceof AxiosError) {
            details.status = error.response?.status;
            
            // Extract error code and message from response
            if (error.response?.data) {
                const responseData = error.response.data as any;
                details.code = responseData.errorCode || responseData.code || `HTTP_${error.response.status}`;
                details.details = responseData.errorMessage || responseData.message || error.message;
                
                // Add additional context from response
                details.context = {
                    url: error.config?.url,
                    method: error.config?.method,
                    statusText: error.response.statusText,
                    responseData: responseData,
                };
            } else {
                details.code = `HTTP_${error.response?.status || 'UNKNOWN'}`;
                details.context = {
                    url: error.config?.url,
                    method: error.config?.method,
                    statusText: error.response?.statusText,
                };
            }
        } else {
            // For regular JavaScript errors
            details.code = 'JS_ERROR';
            details.context = {
                name: error.name,
                constructor: error.constructor.name,
            };
        }
    } else if (typeof error === 'string') {
        details.code = 'STRING_ERROR';
        details.details = error;
    } else if (typeof error === 'object' && error !== null) {
        // Handle object errors
        const errorObj = error as any;
        details.code = errorObj.code || 'OBJECT_ERROR';
        details.details = errorObj.message || errorObj.error || JSON.stringify(error);
        details.context = errorObj;
    } else {
        details.code = 'UNKNOWN_ERROR';
        details.details = String(error);
    }

    return details;
};

/**
 * Create a user-friendly error message from error details
 * @param errorDetails - The error details object
 * @returns A user-friendly error message
 */
export const createUserFriendlyMessage = (errorDetails: ErrorDetails): string => {
    // If we have a specific error message, use it
    if (errorDetails.details) {
        return errorDetails.details;
    }

    // Fallback messages based on error code
    switch (errorDetails.code) {
        case 'HTTP_401':
            return 'Your session has expired. Please log in again.';
        case 'HTTP_403':
            return 'You do not have permission to perform this action.';
        case 'HTTP_404':
            return 'The requested resource was not found.';
        case 'HTTP_409':
            return 'This resource already exists or conflicts with existing data.';
        case 'HTTP_422':
            return 'The provided data is invalid. Please check your input and try again.';
        case 'HTTP_500':
            return 'An internal server error occurred. Please try again later.';
        case 'HTTP_502':
        case 'HTTP_503':
        case 'HTTP_504':
            return 'The service is temporarily unavailable. Please try again later.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

/**
 * Check if error details should be shown to the user
 * @param errorDetails - The error details object
 * @param showInDevelopment - Whether to show details in development mode
 * @returns Boolean indicating if details should be shown
 */
export const shouldShowErrorDetails = (
    errorDetails: ErrorDetails, 
    showInDevelopment: boolean = import.meta.env.DEV
): boolean => {
    // Always show details in development mode if requested
    if (showInDevelopment) {
        return true;
    }

    // In production, only show details for certain error types
    const productionSafeCodes = [
        'VALIDATION_ERROR',
        'BUSINESS_RULE_VIOLATION',
        'INVALID_INPUT',
    ];

    return productionSafeCodes.includes(errorDetails.code || '');
};

/**
 * Format error for notification display
 * @param error - The error object
 * @param showDetails - Whether to include detailed error information
 * @returns Object with message and error details
 */
export const formatErrorForNotification = (
    error: unknown, 
    showDetails: boolean = import.meta.env.DEV
) => {
    const errorDetails = extractErrorDetails(error);
    const message = createUserFriendlyMessage(errorDetails);
    
    return {
        message,
        errorDetails: showDetails ? errorDetails : undefined,
        showErrorDetails: shouldShowErrorDetails(errorDetails, showDetails),
    };
}; 