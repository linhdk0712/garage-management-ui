import React, { useState, useEffect } from 'react';
import {  Mail, Phone, MapPin, CheckCircle, Edit, Key, Car, Calendar } from 'lucide-react';
import { fetchCustomerProfile, updateCustomerProfile } from '../../api/customers';
import { fetchCustomerVehicles } from '../../api/vehicles';
import useAppointments from '../../hooks/useAppointments';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';
import AppointmentList from '../../components/customer/appointments/AppointmentList';
import { Vehicle } from '../../types/vehicle.types';

interface CustomerProfile {
    customerId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    preferredContactMethod: string;
    memberSince: string;
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<CustomerProfile | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);
    const { user } = useAuth();
    const { appointments, isLoading: isAppointmentsLoading, error: appointmentsError } = useAppointments({ initialFetch: true });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const data = await fetchCustomerProfile(user?.username || '');
                setProfile(data);
                setEditedProfile(data);
            } catch (error) {
                console.error('Error loading profile:', error);
                setNotification({
                    type: 'error',
                    message: 'Failed to load profile information. Please try again.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        const loadVehicles = async () => {
            try {
                setIsVehiclesLoading(true);
                const vehiclesData = await fetchCustomerVehicles();
                setVehicles(vehiclesData.data?.content || []);
            } catch (error) {
                console.error('Error loading vehicles:', error);
                setNotification({
                    type: 'error',
                    message: 'Failed to load vehicles. Please try again.',
                });
            } finally {
                setIsVehiclesLoading(false);
            }
        };

        loadProfile();
        loadVehicles();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (editedProfile) {
            setEditedProfile({
                ...editedProfile,
                [name]: value,
            });
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile(profile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedProfile) return;

        try {
            setIsSubmitting(true);
            await updateCustomerProfile(editedProfile);
            setProfile(editedProfile);
            setIsEditing(false);
            setNotification({
                type: 'success',
                message: 'Profile updated successfully.',
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setNotification({
                type: 'error',
                message: 'Failed to update profile. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <Spinner size="lg" text="Loading profile..." />;
    }

    const personalInfoTab = (
        <div className="space-y-4">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={editedProfile?.firstName || ''}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <Input
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={editedProfile?.lastName || ''}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email Address"
                            leftIcon={Mail}
                            value={editedProfile?.email || ''}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            label="Phone Number"
                            leftIcon={Phone}
                            value={editedProfile?.phone || ''}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </div>
                    <Input
                        id="address"
                        name="address"
                        label="Address"
                        leftIcon={MapPin}
                        value={editedProfile?.address || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            id="city"
                            name="city"
                            label="City"
                            value={editedProfile?.city || ''}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <Input
                            id="state"
                            name="state"
                            label="State/Province"
                            value={editedProfile?.state || ''}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <Input
                            id="zipCode"
                            name="zipCode"
                            label="ZIP / Postal Code"
                            value={editedProfile?.zipCode || ''}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Preferred Contact Method</label>
                        <Select
                            value={editedProfile?.preferredContactMethod || 'EMAIL'}
                            onValueChange={(value: string) => handleInputChange({ target: { name: 'preferredContactMethod', value } } as React.ChangeEvent<HTMLInputElement>)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EMAIL">Email</SelectItem>
                                <SelectItem value="SMS">SMS</SelectItem>
                                <SelectItem value="PHONE">Phone</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={<CheckCircle className="w-5 h-5" />}
                            isLoading={isSubmitting}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p className="mt-1 text-lg">{profile?.firstName} {profile?.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Member Since</p>
                                <p className="mt-1 text-lg">{new Date(profile?.memberSince || '').toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                                <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                                    <p className="mt-1">{profile?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                    <p className="mt-1">{profile?.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="mt-1">{profile?.address}</p>
                                    <p>{profile?.city}, {profile?.state} {profile?.zipCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                        <h3 className="text-lg font-medium">Preferences</h3>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">Preferred Contact Method</p>
                            <p className="mt-1">{profile?.preferredContactMethod}</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="primary" icon={<Edit className="w-5 h-5" />} onClick={handleEdit}>
                            Edit Profile
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );

    const vehiclesTab = (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">My Vehicles</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your registered vehicles</p>
            </div>

            {(() => {
                if (isVehiclesLoading) {
                    return <Spinner size="md" text="Loading vehicles..." />;
                }
                if (vehicles.length > 0) {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicles.map((vehicle) => (
                                <div key={vehicle.vehicleId} className="bg-white rounded-lg shadow p-4">
                                    <h4 className="font-medium text-lg">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">License Plate: {vehicle.licensePlate}</p>
                                    {vehicle.vin && (
                                        <p className="text-sm text-gray-500">VIN: {vehicle.vin}</p>
                                    )}
                                    {vehicle.color && (
                                        <p className="text-sm text-gray-500">Color: {vehicle.color}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Mileage: {vehicle.mileage.toLocaleString()} miles
                                    </p>
                                    {vehicle.lastServiceDate && (
                                        <p className="text-sm text-gray-500">
                                            Last Service: {new Date(vehicle.lastServiceDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                }
                return (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Car className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-600">No vehicles registered yet</p>
                        <Button
                            variant="primary"
                            className="mt-4"
                            onClick={() => window.location.href = '/customer/vehicles/add'}
                        >
                            Register a Vehicle
                        </Button>
                    </div>
                );
            })()}
        </div>
    );

    const appointmentsTab = (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">My Appointments</h3>
                <p className="text-sm text-gray-500 mt-1">View and manage your service appointments</p>
            </div>

            {(() => {
                if (isAppointmentsLoading) {
                    return <Spinner size="md" text="Loading appointments..." />;
                }
                if (appointmentsError) {
                    return (
                        <Notification
                            type="error"
                            title="Error"
                            message={appointmentsError}
                            onClose={() => {}}
                        />
                    );
                }
                if (appointments.length > 0) {
                    return <AppointmentList onEditAppointment={(id) => window.location.href = `/customer/appointments/${id}`} />;
                }
                return (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-600">No appointments scheduled yet</p>
                        <Button
                            variant="primary"
                            className="mt-4"
                            onClick={() => window.location.href = '/customer/appointments'}
                        >
                            Schedule an Appointment
                        </Button>
                    </div>
                );
            })()}
        </div>
    );

    const securityTab = (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Security Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your password and security preferences</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                        <Key className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                            <p className="font-medium">Password</p>
                            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Change Password</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Not enabled</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Profile Settings</h1>

            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.type === 'success' ? 'Success' : 'Error'}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <Card>
                <Tabs defaultValue="personal">
                    <TabsList>
                        <TabsTrigger value="personal">Personal Information</TabsTrigger>
                        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">{personalInfoTab}</TabsContent>
                    <TabsContent value="vehicles">{vehiclesTab}</TabsContent>
                    <TabsContent value="appointments">{appointmentsTab}</TabsContent>
                    <TabsContent value="security">{securityTab}</TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};

export default ProfilePage;