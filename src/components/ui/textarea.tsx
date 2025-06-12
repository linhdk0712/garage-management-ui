import React, { forwardRef } from 'react';
import classNames from 'classnames';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, helperText, ...props }, ref) => {
        const textareaClass = classNames(
            'block w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            {
                'border-red-300': error,
                'border-gray-300': !error,
            },
            'py-2 px-3',
            className
        );

        return (
            <div>
                <textarea
                    ref={ref}
                    className={textareaClass}
                    aria-describedby={`${props.id}-helper ${props.id}-error`}
                    {...props}
                />
                {(helperText || error) && (
                    <div className="mt-1">
                        {helperText && !error && (
                            <p id={`${props.id}-helper`} className="text-sm text-gray-500">{helperText}</p>
                        )}
                        {error && (
                            <p id={`${props.id}-error`} className="text-sm text-red-600">{error}</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea }; 