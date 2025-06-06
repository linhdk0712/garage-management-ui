import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    onRightIconClick?: () => void;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            onRightIconClick,
            fullWidth = false,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const inputContainerClass = classNames(
            'relative',
            fullWidth ? 'w-full' : '',
            className
        );

        const inputClass = classNames(
            'block border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            {
                'w-full': fullWidth,
                'pl-10': LeftIcon,
                'pr-10': RightIcon,
                'border-red-300': error,
                'border-gray-300': !error,
                'bg-gray-50 text-gray-500': disabled,
            },
            'py-2.5 px-4',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
        );

        return (
            <div className={inputContainerClass}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {LeftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span><LeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" /></span>
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={inputClass}
                        disabled={disabled}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={`${props.id}-helper ${props.id}-error`}
                        {...props}
                    />
                    {RightIcon && (
                        <button
                            type="button"
                            className={classNames(
                                'absolute inset-y-0 right-0 pr-3 flex items-center',
                                onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
                            )}
                            onClick={onRightIconClick}
                        >
                            <span><RightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" /></span>
                        </button>
                    )}
                </div>
                {(helperText || error) && (
                    <div className="mt-1.5">
                        {helperText && !error && (
                            <p id={`${props.id}-helper`} className="text-sm text-gray-600 dark:text-gray-400">
                                {helperText}
                            </p>
                        )}
                        {error && (
                            <p id={`${props.id}-error`} className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;