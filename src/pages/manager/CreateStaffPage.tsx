import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
    User, 
    Mail, 
    Phone, 
    Lock, 
    MapPin, 
    Building2, 
    Calendar, 
    DollarSign,
    Briefcase,
    GraduationCap,
    ArrowLeft,
    Save
} from 'lucide-react';
import { ROUTES } from '../../config/routes';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import { CreateStaffFormData } from '../../types/staff.types';
import { createStaff } from '../../api/staff';
import Notification from '../../components/common/Notification';

const CreateStaffPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateStaffFormData>({
        defaultValues: {
            preferredContactMethod: 'EMAIL',
            hireDate: new Date().toISOString().split('T')[0],
            hourlyRate: 0,
        },
    });

    const onSubmit = async (data: CreateStaffFormData) => {
        try {
            setIsSubmitting(true);
            await createStaff(data);
            setNotification({
                type: 'success',
                message: 'Staff member created successfully!'
            });
            // Navigate back to staff list on success after a short delay
            setTimeout(() => {
                navigate(ROUTES.manager.staff);
            }, 1500);
        } catch (error) {
            console.error('Error creating staff:', error);
            setNotification({
                type: 'error',
                message: 'Failed to create staff member. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Button
                    variant="outline"
                    icon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => navigate(ROUTES.manager.staff)}
                >
                    Back to Staff List
                </Button>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.type === 'success' ? 'Success' : 'Error'}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <Card>
                <div className="p-6">
                    <h1 className="text-2xl font-semibold mb-6">Create New Staff Member</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="firstName"
                                    control={control}
                                    rules={{ required: 'First name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="First Name"
                                            leftIcon={User}
                                            error={errors.firstName?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="lastName"
                                    control={control}
                                    rules={{ required: 'Last name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Last Name"
                                            leftIcon={User}
                                            error={errors.lastName?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            label="Email"
                                            leftIcon={Mail}
                                            error={errors.email?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ required: 'Phone number is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="tel"
                                            label="Phone Number"
                                            leftIcon={Phone}
                                            error={errors.phone?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Address Information
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Controller
                                    name="address"
                                    control={control}
                                    rules={{ required: 'Address is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Address"
                                            leftIcon={MapPin}
                                            error={errors.address?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Controller
                                        name="city"
                                        control={control}
                                        rules={{ required: 'City is required' }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="City"
                                                leftIcon={Building2}
                                                error={errors.city?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="state"
                                        control={control}
                                        rules={{ required: 'State is required' }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="State"
                                                leftIcon={Building2}
                                                error={errors.state?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="zipCode"
                                        control={control}
                                        rules={{ required: 'ZIP code is required' }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="ZIP Code"
                                                leftIcon={MapPin}
                                                error={errors.zipCode?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Account Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ 
                                        required: 'Username is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Username must be at least 3 characters'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Username"
                                            leftIcon={User}
                                            error={errors.username?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ 
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="password"
                                            label="Password"
                                            leftIcon={Lock}
                                            error={errors.password?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Employment Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Employment Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="position"
                                    control={control}
                                    rules={{ 
                                        required: 'Position is required',
                                        maxLength: {
                                            value: 50,
                                            message: 'Position must be less than 50 characters'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Position"
                                            leftIcon={Briefcase}
                                            error={errors.position?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="specialization"
                                    control={control}
                                    rules={{ 
                                        required: 'Specialization is required',
                                        maxLength: {
                                            value: 100,
                                            message: 'Specialization must be less than 100 characters'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Specialization"
                                            leftIcon={GraduationCap}
                                            error={errors.specialization?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="hireDate"
                                    control={control}
                                    rules={{ required: 'Hire date is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            label="Hire Date"
                                            leftIcon={Calendar}
                                            error={errors.hireDate?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="hourlyRate"
                                    control={control}
                                    rules={{ 
                                        required: 'Hourly rate is required',
                                        min: {
                                            value: 0,
                                            message: 'Hourly rate cannot be negative'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            label="Hourly Rate"
                                            leftIcon={DollarSign}
                                            error={errors.hourlyRate?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Controller
                                    name="preferredContactMethod"
                                    control={control}
                                    rules={{ required: 'Preferred contact method is required' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Preferred Contact Method"
                                            options={[
                                                { value: 'EMAIL', label: 'Email' },
                                                { value: 'PHONE', label: 'Phone' },
                                                { value: 'SMS', label: 'SMS' },
                                            ]}
                                            error={errors.preferredContactMethod?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate(ROUTES.manager.staff)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                icon={<Save className="w-4 h-4" />}
                                isLoading={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Staff'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default CreateStaffPage; 