import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextType';

/**
 * Custom hook to access the auth context
 * @returns The auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;