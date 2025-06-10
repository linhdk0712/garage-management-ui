import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                <div className="mt-8">
                    <Button
                        variant="primary"
                        icon={<Home className="w-4 h-4" />}
                        onClick={() => navigate('/')}
                        className="mx-auto"
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;