import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { ForgotPasswordData } from '../../types/auth.types';
import { ROUTES } from '../../config/routes';

const ForgotPasswordForm: React.FC = () => {
    const [formData, setFormData] = useState<ForgotPasswordData>({
        email: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { requestPasswordReset } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await requestPasswordReset(formData.email);
            setIsSubmitted(true);
        } catch (error: unknown) {
            setErrors({
                form: error instanceof Error ? error.message : 'Failed to send reset email',
            });
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                Password reset instructions have been sent to your email address.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    Please check your email for instructions to reset your password.
                </div>
                <div className="pt-4">
                    <Link
                        to={ROUTES.auth.login}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Return to login
                    </Link>
                </div>
            </div>
        );
    }

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
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    leftIcon={Mail}
                    fullWidth
                />
            </div>

            <div>
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                >
                    Send Reset Instructions
                </Button>
            </div>

            <div className="text-center text-sm">
                <span className="text-gray-600">Remember your password?</span>{' '}
                <Link
                    to={ROUTES.auth.login}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Sign in
                </Link>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
