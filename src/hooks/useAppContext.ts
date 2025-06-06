import { useAuth } from '../context/AuthContext';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';

export const useAppContext = () => {
    const auth = useAuth();
    const featureFlags = useFeatureFlags();

    return {
        // Auth context values
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        login: auth.login,
        register: auth.register,
        logout: auth.logout,
        requestPasswordReset: auth.requestPasswordReset,

        // Feature flag context values
        isEnabled: featureFlags.isEnabled,
        updateFlags: featureFlags.updateFlags,
    };
}; 