import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle, Edit, Key } from 'lucide-react';
import { fetchCustomerProfile, updateCustomerProfile } from '../../api/customers';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Tabs from '../../components/common/Tabs';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';

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
    const { user } = useAuth();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const data = await fetchCustomerProfile();
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

        loadProfile();
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
                        <Select
                            id="preferredContactMethod"
                            name="preferredContactMethod"
                            label="Preferred Contact Method"
                            options={[
                                { value: 'EMAIL', label: 'Email' },
                                { value: 'SMS', label: 'SMS' },
                                { value: 'PHONE', label: 'Phone' },
                            ]}
                            value={editedProfile?.preferredContactMethod || 'EMAIL'}
                            onChange={handleInputChange}
                            fullWidth
                        />
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
                            icon={CheckCircle}
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
                        <Button variant="primary" icon={Edit} onClick={handleEdit}>
                            Edit Profile
                        </Button>
                    </div>
                </div>
            )}
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
                <Tabs
                    tabs={[
                        { id: 'personal', label: 'Personal Information', content: personalInfoTab },
                        { id: 'security', label: 'Security', content: securityTab },
                    ]}
                    defaultTabId="personal"
                />
            </Card>
        </div>
    );
};

export default ProfilePage;