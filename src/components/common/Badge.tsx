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
        primary: 'bg-[#D5BDAF] text-[#3D2C2E] border border-[#D5BDAF]',
        secondary: 'bg-[#E3D5CA] text-[#5A4A42] border border-[#E3D5CA]',
        success: 'bg-[#E3D5CA] text-[#3D2C2E] border border-[#E3D5CA]',
        danger: 'bg-[#D5BDAF] text-[#3D2C2E] border border-[#D5BDAF]',
        warning: 'bg-[#D6CCC2] text-[#3D2C2E] border border-[#D6CCC2]',
        info: 'bg-[#D5BDAF] text-[#3D2C2E] border border-[#D5BDAF]',
    };

    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    };

    const badgeClasses = classNames(
        'inline-flex items-center font-medium transition-colors duration-200',
        variantStyles[variant],
        sizeStyles[size],
        rounded ? 'rounded-full' : 'rounded-lg',
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