import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/auth.types';
import { ROUTES } from '../../config/routes';

const LoginForm: React.FC = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!credentials.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await login(credentials);
            // Navigation happens in AuthContext after successful login
        } catch (error: unknown) {
            setErrors({
                form: error instanceof Error ? error.message : 'Invalid username or password',
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.form}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    error={errors.username}
                    fullWidth
                />
            </div>

            <div>
                <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    error={errors.password}
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={togglePasswordVisibility}
                    fullWidth
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <Link to="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot your password?
                    </Link>
                </div>
            </div>

            <div>
                <Button
                    type="submit"
                    variant="primary"
                    icon={<LogIn className="w-5 h-5" />}
                    fullWidth
                >
                    Sign in
                </Button>
            </div>

            <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account?</span>{' '}
                <Link
                    to={ROUTES.auth.register}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Sign up
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;