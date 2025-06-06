import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'light' | 'dark';

interface SpinnerProps {
    size?: SpinnerSize;
    color?: SpinnerColor;
    className?: string;
    fullScreen?: boolean;
    text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
                                             size = 'md',
                                             color = 'primary',
                                             className = '',
                                             fullScreen = false,
                                             text,
                                         }) => {
    const sizeClasses = {
        xs: 'h-4 w-4',
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const colorClasses = {
        primary: 'text-blue-600',
        secondary: 'text-gray-600',
        success: 'text-green-600',
        danger: 'text-red-600',
        warning: 'text-yellow-500',
        light: 'text-gray-300',
        dark: 'text-gray-800',
    };

    const spinnerClasses = `inline-block animate-spin rounded-full border-current border-solid border-r-transparent align-[-0.125em] ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

    // Calculate border width based on size
    const borderWidth = {
        xs: 'border-2',
        sm: 'border-2',
        md: 'border-3',
        lg: 'border-4',
        xl: 'border-4',
    };

    const spinner = (
        <output
            className={`${spinnerClasses} ${borderWidth[size]}`}
            aria-label="loading"
        >
            <span className="sr-only">Loading...</span>
        </output>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                    {spinner}
                    {text && <p className="mt-4 text-gray-700">{text}</p>}
                </div>
            </div>
        );
    }

    if (text) {
        return (
            <div className="flex flex-col items-center">
                {spinner}
                <p className="mt-2 text-sm text-gray-600">{text}</p>
            </div>
        );
    }

    return spinner;
};

export default Spinner;