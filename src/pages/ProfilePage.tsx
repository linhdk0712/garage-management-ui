import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Car,
    Calendar,
    Users,
    Edit,
    CheckCircle,
    Clock,
    Plus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchCustomerProfile, updateCustomerProfile } from '../api/customers';
import { fetchAllVehicles } from '../api/vehicles';
import { fetchAppointments } from '../api/appointments';
import { fetchStaffProfile, updateStaffProfile, fetchAllStaff } from '../api/staff';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import BeautifulTabs, { BeautifulTab } from '../components/common/BeautifulTabs';
import Spinner from '../components/common/Spinner';
import Notification from '../components/common/Notification';
import Badge from '../components/common/Badge';
import VehicleList from '../components/customer/vehicles/VehicleList';
import { Vehicle } from '../types/vehicle.types';
import { Appointment } from '../types/appointment.types';
import { ROUTES } from '../config/routes';
import { fetchManagerProfile, updateManagerProfile } from '../api/manager';
import { Staff } from '../types/staff.types';

interface BaseProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    memberSince: string;
}

interface CustomerProfile extends BaseProfile {
    customerId: number;
    preferredContactMethod: string;
}

interface StaffProfile extends BaseProfile {
    staffId: number;
    position: string;
    department: string;
    hireDate: string;
}

interface ManagerProfile extends BaseProfile {
    managerId: number;
    position: string;
    department: string;
    hireDate: string;
}

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<CustomerProfile | StaffProfile | ManagerProfile | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<CustomerProfile | StaffProfile | ManagerProfile | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                console.log('Loading profile data...', {
                    user,
                    userId: user?.id,
                    userRoles: user?.roles,
                    authToken: localStorage.getItem('garage_auth')
                });
                
                if (!user) {
                    console.error('User object is null');
                    setNotification({
                        type: 'error',
                        message: 'User information is not available. Please try logging in again.',
                    });
                    navigate('/auth/login');
                    return;
                }

                if (!user.id) {
                    console.error('User ID is missing');
                    setNotification({
                        type: 'error',
                        message: 'User ID is missing. Please try logging in again.',
                    });
                    navigate('/auth/login');
                    return;
                }

                setIsLoading(true);
                let profileData;
                let vehiclesData;
                let appointmentsData;
                let staffData;
                console.log('User roles:', user?.roles[0]);

                switch (user?.roles[0]) {
                    case 'CUSTOMER':
                        profileData = await fetchCustomerProfile(user?.username);
                        vehiclesData = await fetchAllVehicles();
                        appointmentsData = await fetchAppointments(ROUTES.customer.appointments);
                        break;
                    case 'STAFF':
                        profileData = await fetchStaffProfile(user?.username);
                        appointmentsData = await fetchAppointments(ROUTES.staff.appointments); // All appointments
                        break;
                    case 'MANAGER':
                        profileData = await fetchManagerProfile(user?.username);
                        appointmentsData = await fetchAppointments(ROUTES.manager.appointments); // All appointments
                        staffData = await fetchAllStaff(ROUTES.manager.staff);
                        break;
                    default:
                        throw new Error('Invalid user role');
                }
                console.log('Profile data:', profileData);

                setProfile(profileData as unknown as CustomerProfile | StaffProfile | ManagerProfile);
                setEditedProfile(profileData as unknown as CustomerProfile | StaffProfile | ManagerProfile);
                if (vehiclesData) setVehicles(vehiclesData.data.content || []);
                if (appointmentsData) setAppointments(appointmentsData.content || []);
                if (staffData) setStaff(staffData.content || []);
            } catch (error) {
                console.error('Error loading profile data:', error);
                setNotification({
                    type: 'error',
                    message: 'Failed to load profile information. Please try again.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadProfileData();
    }, [user]);

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
            switch (user?.roles[0]) {
                case 'CUSTOMER':
                    await updateCustomerProfile(editedProfile as CustomerProfile);
                    break;
                case 'STAFF':
                    await updateStaffProfile(editedProfile as StaffProfile);
                    break;
                case 'MANAGER':
                    await updateManagerProfile(editedProfile as ManagerProfile);
                    break;
            }
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

    const getStatusBadgeVariant = (status: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'CONFIRMED':
                return 'primary';
            case 'IN_PROGRESS':
                return 'primary';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'secondary';
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
                    {user?.roles[0] === 'CUSTOMER' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Preferred Contact Method</label>
                            <Select 
                                value={(editedProfile as CustomerProfile)?.preferredContactMethod || 'EMAIL'}
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
                    )}
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
                    <div className="flex justify-between items-start">
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
                                {(profile as StaffProfile | ManagerProfile)?.position && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Position</p>
                                        <p className="mt-1 text-lg">{(profile as StaffProfile | ManagerProfile).position}</p>
                                    </div>
                                )}
                                {(profile as StaffProfile | ManagerProfile)?.department && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Department</p>
                                        <p className="mt-1 text-lg">{(profile as StaffProfile | ManagerProfile).department}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            icon={<Edit className="w-5 h-5" />}
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </Button>
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
                                    <p className="mt-1">
                                        {profile?.address}<br />
                                        {profile?.city}, {profile?.state} {profile?.zipCode}
                                    </p>
                                </div>
                            </div>
                            {user?.roles[0] === 'CUSTOMER' && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Preferred Contact Method</p>
                                    <p className="mt-1">{(profile as CustomerProfile).preferredContactMethod}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const vehiclesTab = (
        <div className="space-y-4">
            {user?.roles[0] === 'CUSTOMER' ? (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">My Vehicles</h3>
                        <Button
                            variant="primary"
                            icon={<Plus className="w-5 h-5" />}
                            onClick={() => navigate('/customer/vehicles')}
                        >
                            Add Vehicle
                        </Button>
                    </div>
                    <VehicleList onEditVehicle={(vehicleId) => navigate(`/customer/vehicles/${vehicleId}`)} />
                </>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.vehicleId} className="hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {vehicle.year} • {vehicle.licensePlate}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/staff/vehicles/${vehicle.vehicleId}`)}
                                >
                                    View Details
                                </Button>
                            </div>
                            <div className="mt-4 space-y-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">VIN:</span> {vehicle.vin || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Color:</span> {vehicle.color || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()} miles
                                </p>
                                {vehicle.lastServiceDate && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Last Service:</span>{' '}
                                        {new Date(vehicle.lastServiceDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const appointmentsTab = (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                    {user?.roles[0] === 'CUSTOMER' ? 'My Appointments' : 'All Appointments'}
                </h3>
                {user?.roles[0] === 'CUSTOMER' && (
                    <Button
                        variant="primary"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => navigate('/customer/appointments/new')}
                    >
                        Schedule Appointment
                    </Button>
                )}
            </div>
            <div className="space-y-4">
                {appointments.map((appointment) => (
                    <Card key={appointment.appointmentId} className="hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">{appointment.serviceType}</h3>
                                <div className="flex items-center mt-1 text-gray-700">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>
                                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>
                                        {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center mt-1 text-gray-700">
                                    <Car className="w-4 h-4 mr-1" />
                                    <span>
                                        {appointment.vehicle ? (
                                          <>
                                            {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model} ({appointment.vehicle.licensePlate})
                                          </>
                                        ) : (
                                          <span className="text-gray-400">No vehicle information</span>
                                        )}
                                    </span>
                                </div>
                                {user?.roles[0] !== 'CUSTOMER' && (
                                    <div className="flex items-center mt-1 text-gray-700">
                                        <User className="w-4 h-4 mr-1" />
                                        <span>
                                            {/* {appointment.customer?.firstName} {appointment.customer?.lastName} */}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                                <Badge
                                    label={appointment.status}
                                    variant={getStatusBadgeVariant(appointment.status)}
                                    size="md"
                                    rounded
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => navigate(`/${user?.roles[0].toLowerCase()}/appointments/${appointment.appointmentId}`)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const staffTab = (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Staff Members</h3>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => navigate('/manager/staff/new')}
                >
                    Add Staff Member
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {staff.map((staffMember) => (
                    <Card key={staffMember.staffId} className="hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {staffMember.firstName} {staffMember.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {staffMember.position} • {staffMember.department}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/manager/staff/${staffMember.staffId}`)}
                            >
                                View Details
                            </Button>
                        </div>
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {staffMember.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span> {staffMember.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Hire Date:</span>{' '}
                                {new Date(staffMember.hireDate).toLocaleDateString()}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const tabs: BeautifulTab[] = [
        {
            id: 'personal',
            label: 'Personal Information',
            icon: <UserIcon />,
            content: personalInfoTab,
        },
        {
            id: 'vehicles',
            label: 'Vehicles',
            icon: <Car />,
            content: vehiclesTab,
            show: user?.roles[0] !== 'STAFF',
        },
        {
            id: 'appointments',
            label: 'Appointments',
            icon: <Calendar />,
            content: appointmentsTab,
        },
        {
            id: 'staff',
            label: 'Staff Management',
            icon: <Users />,
            content: staffTab,
            show: user?.roles[0] === 'MANAGER',
        },
    ].filter(tab => tab.show !== false);

    return (
        <div className="space-y-6">
            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.type === 'success' ? 'Success' : 'Error'}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Profile</h3>
            </div>

            <Card>
                <BeautifulTabs
                    tabs={tabs}
                    variant="underline"
                    defaultTabId="personal"
                />
            </Card>
        </div>
    );
};

export default ProfilePage; 