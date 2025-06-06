import React from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../config/constants';
import { ROUTES } from '../../config/routes';
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return <Spinner size="lg" text="Checking authentication..." />;
    }

    // If not authenticated, redirect to login
    if (!user) {
        return <Navigate to={ROUTES.auth.login} replace />;
    }

    // Check if the user has any of the allowed roles
    const hasAllowedRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasAllowedRole) {
        // Redirect to appropriate dashboard based on first role
        let redirectPath = '/';
        const userRole = user.roles[0];
        switch (userRole) {
            case USER_ROLES.CUSTOMER:
                redirectPath = '/customer/dashboard';
                break;
            case USER_ROLES.STAFF:
                redirectPath = '/staff/appointments';
                break;
            case USER_ROLES.MANAGER:
                redirectPath = '/manager/dashboard';
                break;
        }
        return <Navigate to={redirectPath} replace />;
    }

    // If authenticated and has the required role, render the children
    return <>{children}</>;
};

export default ProtectedRoute;