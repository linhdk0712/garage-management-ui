import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffSchema, StaffFormData } from '../../lib/validations';
import { extractValidationErrors, isValidationError } from '../../utils/errorHandler';
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
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import Select from '../../components/common/Select';
import { createStaff } from '../../api/staff';
import Notification from '../../components/common/Notification';
import { AxiosError } from 'axios';

const CreateStaffPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            username: '',
            email: '',
            phone: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            preferredContactMethod: 'EMAIL',
            position: '',
            specialization: '',
            hireDate: new Date().toISOString().split('T')[0],
            hourlyRate: 0,
        },
    });

    const onSubmit = async (data: StaffFormData) => {
        try {
            setIsSubmitting(true);
            setNotification(null);
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
            
            if (error instanceof AxiosError && isValidationError(error)) {
                const validationErrors = extractValidationErrors(error);
                Object.entries(validationErrors).forEach(([field, message]) => {
                    if (field !== 'general') {
                        setError(field as keyof StaffFormData, { message });
                    }
                });
                if (validationErrors.general) {
                    setNotification({
                        type: 'error',
                        message: validationErrors.general
                    });
                }
            } else {
                setNotification({
                    type: 'error',
                    message: 'Failed to create staff member. Please try again.'
                });
            }
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
                    <h3 className="text-xl font-semibold mb-6">Create New Staff Member</h3>
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
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="City"
                                                error={errors.city?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="State"
                                                error={errors.state?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="zipCode"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Zip Code"
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
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="hireDate"
                                    control={control}
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
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <Controller
                                    name="preferredContactMethod"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Preferred Contact Method"
                                            options={[
                                                { value: 'EMAIL', label: 'Email' },
                                                { value: 'PHONE', label: 'Phone' },
                                                { value: 'SMS', label: 'SMS' },
                                            ]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.preferredContactMethod?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(ROUTES.manager.staff)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="default"
                                disabled={isSubmitting}
                                icon={<Save className="w-4 h-4" />}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Staff Member'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default CreateStaffPage; 