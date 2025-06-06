import { useState, useEffect } from 'react';

/**
 * Hook to detect if the application is offline
 * @returns Object containing isOffline state
 */
const useOfflineDetection = () => {
    const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

    useEffect(() => {
        // Event listeners for online/offline status
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOffline };
};

export default useOfflineDetection;