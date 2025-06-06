import React from 'react';
import { useRefCallback } from '../../hooks/useRefCallback';

interface AutoFocusInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onFocus?: () => void;
    onBlur?: () => void;
    autoFocus?: boolean;
}

const AutoFocusInput: React.FC<AutoFocusInputProps> = ({
    onFocus,
    onBlur,
    autoFocus = false,
    ...props
}) => {
    const handleRef = useRefCallback<HTMLInputElement>((element) => {
        if (element && autoFocus) {
            element.focus();
        }
    });

    return (
        <input
            ref={handleRef}
            onFocus={onFocus}
            onBlur={onBlur}
            {...props}
        />
    );
};

export default AutoFocusInput; 