import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CustomerDashboard from '../components/customer/CustomerDashboard';
import ManagerDashboard from '../components/manager/ManagerDashboard';
import StaffDashboard from '../components/staff/StaffDashboard';
import Spinner from '../components/common/Spinner';
import { USER_ROLES } from '../config/constants';
import { ROUTES } from '../config/routes';

const DashboardPage: React.FC = () => {
    const { user, isLoading } = useAuth();

    // If user is not authenticated and not loading, redirect to login
    if (!user && !isLoading) {
        return <Navigate to={ROUTES.auth.login} replace />;
    }

    // Show loading state
    if (isLoading) {
        return <Spinner size="lg" fullScreen text="Loading dashboard..." />;
    }

    // Render appropriate dashboard based on user role
    const renderDashboard = () => {
        if (!user) return null;

        switch (user.roles[0]) {
            case USER_ROLES.CUSTOMER:
                return <CustomerDashboard />;
            case USER_ROLES.STAFF:
                return <StaffDashboard />;
            case USER_ROLES.MANAGER:
                return <ManagerDashboard />;
            default:
                return <div>Unknown user role</div>;
        }
    };

    return <>{renderDashboard()}</>;
};

export default DashboardPage;