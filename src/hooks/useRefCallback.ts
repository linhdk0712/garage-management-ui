import { useCallback, useRef } from 'react';

export function useRefCallback<T>(
    callback: (value: T | null) => void
): (value: T | null) => void {
    const ref = useRef<((value: T | null) => void) | null>(null);
    ref.current = callback;

    return useCallback((value: T | null) => {
        ref.current?.(value);
    }, []);
} 