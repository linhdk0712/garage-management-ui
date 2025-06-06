import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';

const Layout: React.FC = () => {
    const { user, isLoading } = useAuth();

    // If auth is still loading, show a loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="flex flex-col">
                {/* Header */}
                {user && <Header />}

                {/* Page Content */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Garage Management System. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;