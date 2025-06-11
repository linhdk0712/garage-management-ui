import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Notification from '../common/Notification';
import { useAuth } from '../../hooks/useAuth';
import { RegisterData } from '../../types/auth.types';
import { ROUTES } from '../../config/routes';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<RegisterData>({
        username: '',
        password: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        preferredContactMethod: 'EMAIL',
        roles: ['CUSTOMER'],
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [successNotification, setSuccessNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) return;

        try {
            await register(formData);
            setSuccessNotification({
                type: 'success',
                message: 'Registration successful! Redirecting to login...'
            });
            // Delay navigation to show the success message
            setTimeout(() => {
                navigate(ROUTES.auth.login);
            }, 2000);
        } catch (error: unknown) {
            setErrors({
                form: error instanceof Error ? error.message : 'Registration failed',
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {successNotification && (
                <div className="fixed top-4 right-4 z-50 w-96">
                    <Notification
                        type={successNotification.type}
                        title={successNotification.type === 'success' ? 'Success' : 'Error'}
                        message={successNotification.message}
                        onClose={() => setSuccessNotification(null)}
                        duration={3000}
                    />
                </div>
            )}
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

                <div className="relative pb-6 mb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className={`flex-1 flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                            <div className={`rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'} h-6 w-6 text-white flex items-center justify-center`}>
                                1
                            </div>
                            <span className="ml-2 text-sm font-medium">Account Information</span>
                        </div>
                        <div className="flex-grow border-t border-gray-300 mx-2"></div>
                        <div className={`flex-1 flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                            <div className={`rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'} h-6 w-6 text-white flex items-center justify-center`}>
                                2
                            </div>
                            <span className="ml-2 text-sm font-medium">Personal Information</span>
                        </div>
                    </div>
                </div>

                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                label="Username"
                                value={formData.username}
                                onChange={handleChange}
                                error={errors.username}
                                fullWidth
                            />
                        </div>

                        <div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                fullWidth
                            />
                        </div>

                        <div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                rightIcon={showPassword ? EyeOff : Eye}
                                onRightIconClick={togglePasswordVisibility}
                                fullWidth
                            />
                        </div>

                        <div>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                fullWidth
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleNextStep}
                                fullWidth
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                    fullWidth
                                />
                            </div>

                            <div>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                    fullWidth
                                />
                            </div>
                        </div>

                        <div>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                fullWidth
                            />
                        </div>

                        <div>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                label="Address"
                                value={formData.address}
                                onChange={handleChange}
                                error={errors.address}
                                fullWidth
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    label="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    error={errors.city}
                                    fullWidth
                                />
                            </div>

                            <div>
                                <Input
                                    id="state"
                                    name="state"
                                    type="text"
                                    label="State/Province"
                                    value={formData.state}
                                    onChange={handleChange}
                                    error={errors.state}
                                    fullWidth
                                />
                            </div>

                            <div>
                                <Input
                                    id="zipCode"
                                    name="zipCode"
                                    type="text"
                                    label="ZIP / Postal Code"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    error={errors.zipCode}
                                    fullWidth
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Contact Method
                            </label>
                            <select
                                id="preferredContactMethod"
                                name="preferredContactMethod"
                                value={formData.preferredContactMethod}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="EMAIL">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="PHONE">Phone</option>
                            </select>
                        </div>

                        <div className="pt-4 flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevStep}
                                className="flex-1"
                            >
                                Back
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                icon={<UserPlus className="w-5 h-5" />}
                                className="flex-1"
                            >
                                Register
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account?</span>{' '}
                    <Link to={ROUTES.auth.login} className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;