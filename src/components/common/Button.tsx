import React from 'react';
import { Loader2 } from 'lucide-react';
import classNames from 'classnames';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    fullWidth = false,
    className,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex bg-cyan-500 items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    const variantStyles = {
        primary: 'bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-500 disabled:bg-cyan-400 disabled:text-white',
        secondary: 'bg-blue-300 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400',
        danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-500 disabled:bg-red-400 disabled:text-white',
        outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:border-gray-200 disabled:text-gray-400'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <button
            className={classNames(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                widthStyles,
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2"><Loader2 className="w-4 h-4 animate-spin" /></span>
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            {children}
        </button>
    );
};

export default Button;