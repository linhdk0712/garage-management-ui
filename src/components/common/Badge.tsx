import React from 'react';
import classNames from 'classnames';
import { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    label: string;
    icon?: LucideIcon;
    rounded?: boolean;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    variant = 'primary',
    size = 'md',
    label,
    icon: Icon,
    rounded = false,
    className,
}) => {
    const variantStyles = {
        primary: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-indigo-100 text-indigo-800',
    };

    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    };

    const badgeClasses = classNames(
        'inline-flex items-center font-medium',
        variantStyles[variant],
        sizeStyles[size],
        rounded ? 'rounded-full' : 'rounded',
        className
    );

    return (
        <span className={badgeClasses}>
            {Icon && <span className="mr-1"><Icon className="w-3.5 h-3.5" /></span>}
            {label}
        </span>
    );
};

export default Badge;