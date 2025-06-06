import React, { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
    children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <AuthProvider>
            <FeatureFlagProvider>
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                    }}
                />
                {children}
            </FeatureFlagProvider>
        </AuthProvider>
    );
};

// Custom hook to use all providers
export const useProviders = () => {
    return {
        Providers,
    };
}; 