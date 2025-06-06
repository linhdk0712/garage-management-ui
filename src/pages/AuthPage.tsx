import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/routes';

const AuthPage: React.FC = () => {
    const { authType } = useParams<{ authType: string }>();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        console.log('AuthPage mounted with authType:', authType);
    }, [authType]);

    // If user is already authenticated, redirect to dashboard
    if (user && !isLoading) {
        return <Navigate to="/" replace />;
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const renderAuthForm = () => {
        console.log('Rendering auth form for type:', authType);
        switch (authType) {
            case 'login':
                return <LoginForm />;
            case 'register':
                return <RegisterForm />;
            case 'forgot-password':
                return <ForgotPasswordForm />;
            default:
                console.log('Invalid auth type, redirecting to login');
                return <Navigate to={ROUTES.auth.login} replace />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* <img
                    className="mx-auto h-12 w-auto"
                    src="/assets/images/logo.svg"
                    alt="Garage Management System"
                /> */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {authType === 'login' && 'Sign in to your account'}
                    {authType === 'register' && 'Create a new account'}
                    {authType === 'forgot-password' && 'Reset your password'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {renderAuthForm()}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;