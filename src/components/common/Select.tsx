import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import classNames from 'classnames';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: SelectOption[];
    helperText?: string;
    error?: string;
    fullWidth?: boolean;
    onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            options,
            helperText,
            error,
            fullWidth = false,
            className,
            onChange,
            disabled,
            ...props
        },
        ref
    ) => {
        const selectContainerClass = classNames(
            'relative',
            fullWidth ? 'w-full' : '',
            className
        );

        const selectClass = classNames(
            'block border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none',
            {
                'w-full': fullWidth,
                'border-red-300': error,
                'border-gray-300': !error,
                'bg-gray-100 text-gray-500': disabled,
            },
            'py-2 pl-3 pr-10'
        );

        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (onChange) {
                onChange(e.target.value);
            }
        };

        return (
            <div className={selectContainerClass}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={selectClass}
                        disabled={disabled}
                        onChange={handleChange}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={`${props.id}-helper ${props.id}-error`}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                {(helperText || error) && (
                    <div className="mt-1">
                        {helperText && !error && (
                            <p id={`${props.id}-helper`} className="text-sm text-gray-500">
                                {helperText}
                            </p>
                        )}
                        {error && (
                            <p id={`${props.id}-error`} className="text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;