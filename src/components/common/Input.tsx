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
            'block border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2',
            {
                'w-full': fullWidth,
                'pl-10': LeftIcon,
                'pr-10': RightIcon,
                'border-[#D5BDAF] focus:ring-[#D5BDAF]': error,
                'border-[#D6CCC2] hover:border-[#D5BDAF]': !error,
                'bg-[#F5EBE0] text-[#8B7355]': disabled,
            },
            'py-2.5 px-4',
            'bg-[#EDEDE9] text-[#5A4A42]'
        );

        return (
            <div className={inputContainerClass}>
                {label && (
                    <label className="block text-sm font-medium text-[#5A4A42] mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {LeftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span><LeftIcon className="h-5 w-5 text-[#8B7355]" /></span>
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={inputClass}
                        disabled={disabled}
                        {...(error && { "aria-invalid": "true" })}
                        aria-describedby={`${props.id}-helper ${props.id}-error`}
                        {...props}
                    />
                    {RightIcon && (
                        <button
                            type="button"
                            className={classNames(
                                'absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200',
                                onRightIconClick ? 'cursor-pointer hover:text-[#6B5B47]' : 'pointer-events-none'
                            )}
                            onClick={onRightIconClick}
                            title="Toggle input action"
                        >
                            <span><RightIcon className="h-5 w-5 text-[#8B7355]" /></span>
                        </button>
                    )}
                </div>
                {(helperText || error) && (
                    <div className="mt-2">
                        {helperText && !error && (
                            <p id={`${props.id}-helper`} className="text-sm text-[#6B5B47]">
                                {helperText}
                            </p>
                        )}
                        {error && (
                            <p id={`${props.id}-error`} className="text-sm text-[#8B7355]">
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