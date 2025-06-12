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
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2 transition-all duration-200';
    
    const variantStyles = {
        primary: 'bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] shadow-sm disabled:bg-[#F5EBE0]',
        secondary: 'bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] disabled:bg-[#F5EBE0] disabled:text-[#8B7355]',
        danger: 'bg-[#D5BDAF] text-[#3D2C2E] hover:bg-[#E3D5CA] shadow-sm disabled:bg-[#F5EBE0]',
        outline: 'border border-[#D6CCC2] bg-[#EDEDE9] text-[#5A4A42] hover:bg-[#E3D5CA] hover:border-[#D5BDAF] disabled:border-[#F5EBE0] disabled:text-[#8B7355]'
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