import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { FeatureFlags, FeatureFlagContextType, defaultFeatureFlags } from '../config/featureFlags';

const FEATURE_FLAGS_STORAGE_KEY = 'featureFlags';

const loadFlagsFromStorage = (): FeatureFlags => {
    try {
        const storedFlags = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
        if (storedFlags) {
            return JSON.parse(storedFlags);
        }
    } catch (error) {
        console.error('Error loading feature flags from storage:', error);
    }
    return defaultFeatureFlags;
};

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [flags, setFlags] = useState<FeatureFlags>(loadFlagsFromStorage);

    // Save flags to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(flags));
        } catch (error) {
            console.error('Error saving feature flags to storage:', error);
        }
    }, [flags]);

    const isEnabled = useCallback((feature: keyof FeatureFlags): boolean => {
        return flags[feature] ?? false;
    }, [flags]);

    const updateFlags = useCallback((newFlags: Partial<FeatureFlags>) => {
        setFlags(prev => ({
            ...prev,
            ...newFlags
        }));
    }, []);

    const contextValue = useMemo(() => ({
        flags,
        isEnabled,
        updateFlags
    }), [flags, isEnabled, updateFlags]);

    return (
        <FeatureFlagContext.Provider value={contextValue}>
            {children}
        </FeatureFlagContext.Provider>
    );
};

export const useFeatureFlags = (): FeatureFlagContextType => {
    const context = useContext(FeatureFlagContext);
    if (context === undefined) {
        throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
    }
    return context;
}; 