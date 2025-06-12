import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';

const Layout: React.FC = () => {
    const { user, isLoading } = useAuth();

    // If auth is still loading, show a loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F5EBE0]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-2 border-[#D6CCC2] border-t-[#8B7355] rounded-full animate-spin"></div>
                    <p className="text-[#6B5B47] text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5EBE0]">
            {/* Main Content */}
            <div className="flex flex-col">
                {/* Header */}
                {user && <Header />}

                {/* Page Content */}
                <main className="flex-1">
                    <div className="py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-[#EDEDE9] border-t border-[#D6CCC2] py-6 text-center">
                    <p className="text-[#6B5B47] text-sm">
                        © {new Date().getFullYear()} Garage Management System. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;