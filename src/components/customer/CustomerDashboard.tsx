import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    Car,
    ClipboardList,
    CreditCard,
    CheckCircle2,
    Plus,
    Menu
} from 'lucide-react';
import { fetchAllVehicles } from '../../api/vehicles';
import { Vehicle } from '../../types/vehicle.types';
import VehicleHealthDashboard from '../enhanced/VehicleHealthDashboard';
import { useAuth } from '../../hooks/useAuth';
import FeatureGate from '../common/FeatureGate';
import useCustomerDashboard from '../../hooks/useCustomerDashboard';

const CustomerDashboard: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Use the customer dashboard hook to fetch appointments and vehicles
    const { 
        appointments, 
        vehicles: dashboardVehicles, 
        isLoading: dashboardLoading, 
        error: dashboardError    } = useCustomerDashboard({ initialFetch: true });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const vehiclesData = await fetchAllVehicles();
                
                // Handle different possible response structures
                let vehiclesArray: Vehicle[] = [];
                
                if (!vehiclesData) {
                    console.warn('No vehicles data received');
                    setVehicles([]);
                    return;
                }
                
                // Check if response has the full PaginatedResponseData structure
                if ('data' in vehiclesData && vehiclesData.data && 'content' in vehiclesData.data) {
                    vehiclesArray = vehiclesData.data.content || [];
                }
                // Check if response is directly the PaginatedResponse structure
                else if ('content' in vehiclesData && Array.isArray(vehiclesData.content)) {
                    vehiclesArray = vehiclesData.content || [];
                }
                // Check if response is an array
                else if (Array.isArray(vehiclesData)) {
                    vehiclesArray = vehiclesData;
                }
                // Fallback to empty array
                else {
                    console.warn('Unexpected response structure:', vehiclesData);
                    vehiclesArray = [];
                }
                
                setVehicles(vehiclesArray);

                if (vehiclesArray.length > 0) {
                    setSelectedVehicle(vehiclesArray[0]);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setVehicles([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Update vehicles when dashboard data is loaded
    useEffect(() => {
        if (dashboardVehicles.length > 0) {
            setVehicles(dashboardVehicles);
            if (!selectedVehicle || !dashboardVehicles.find(v => v.vehicleId === selectedVehicle.vehicleId)) {
                setSelectedVehicle(dashboardVehicles[0]);
            }
        }
    }, [dashboardVehicles, selectedVehicle]);

    // Get upcoming appointments (PENDING, CONFIRMED, IN_PROGRESS)
    const upcomingAppointments = appointments.filter(
        appointment => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(appointment.status)
    );

    // Get completed appointments
    const completedAppointments = appointments.filter(
        appointment => appointment.status === 'COMPLETED'
    );

    if (isLoading || dashboardLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (dashboardError) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    Error loading dashboard data: {dashboardError}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.firstName ?? 'Customer'}</h3>
                    <button 
                        className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        title="Toggle mobile menu"
                    >
                        <Menu className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
                <FeatureGate feature="enableAppointments">
                    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
                        <button 
                            onClick={() => navigate('/customer/appointments/schedule')}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            New Appointment
                        </button>
                    </div>
                </FeatureGate>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <FeatureGate feature="enableVehicleManagement">
                    <button 
                        className="w-full text-left bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100 cursor-pointer"
                        onClick={() => navigate('/customer/vehicles')}
                        type="button"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Your Vehicles</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{vehicles.length}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                            </div>
                        </div>
                    </button>
                </FeatureGate>

                <FeatureGate feature="enableAppointments">
                    <button 
                        className="w-full text-left bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100 cursor-pointer"
                        onClick={() => navigate('/customer/appointments')}
                        type="button"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Upcoming Appointments</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{upcomingAppointments.length}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
                            </div>
                        </div>
                    </button>
                </FeatureGate>

                <FeatureGate feature="enableRepairHistory">
                    <button 
                        className="w-full text-left bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100 cursor-pointer"
                        onClick={() => navigate('/customer/repair-history')}
                        type="button"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Completed Services</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{completedAppointments.length}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg sm:rounded-xl">
                                <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-700" />
                            </div>
                        </div>
                    </button>
                </FeatureGate>

                <FeatureGate feature="enablePayments">
                    <button 
                        className="w-full text-left bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100 cursor-pointer"
                        onClick={() => navigate('/customer/payments')}
                        type="button"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Payments</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Manage</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                            </div>
                        </div>
                    </button>
                </FeatureGate>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Vehicle Health Dashboard */}
                    <FeatureGate feature="enableHealthDashboard">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#E3D5CA]">
                                <h3 className="text-lg font-semibold text-[#3D2C2E]">Vehicle Health Dashboard</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                {selectedVehicle ? (
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                                            <h3 className="text-base sm:text-lg font-medium text-gray-900">
                                                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {vehicles.map((vehicle) => (
                                                    <button
                                                        key={vehicle.vehicleId}
                                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                                                            selectedVehicle.vehicleId === vehicle.vehicleId
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                        onClick={() => setSelectedVehicle(vehicle)}
                                                    >
                                                        {vehicle.licensePlate}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <VehicleHealthDashboard vehicleId={selectedVehicle.vehicleId} />
                                    </>
                                ) : (
                                    <div className="text-center py-6 sm:py-8">
                                        <p className="text-gray-600 mb-4">You don't have any vehicles registered yet.</p>
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            onClick={() => navigate('/customer/vehicles/add')}
                                        >
                                            Register a Vehicle
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FeatureGate>

                    {/* Upcoming Appointments */}
                    <FeatureGate feature="enableAppointments">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-700 to-purple-800">
                                <h3 className="text-base sm:text-lg font-semibold text-white">Upcoming Appointments</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                {upcomingAppointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingAppointments.slice(0, 3).map((appointment) => (
                                            <div key={appointment.appointmentId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{appointment.serviceType}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{appointment.description}</p>
                                                        <div className="flex items-center mt-2 text-sm text-gray-500">
                                                            <CalendarDays className="w-4 h-4 mr-1" />
                                                            <span>
                                                                {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                                                                {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </span>
                                                        </div>
                                                        {appointment.vehicle && (
                                                            <div className="flex items-center mt-1 text-sm text-gray-500">
                                                                <Car className="w-4 h-4 mr-1" />
                                                                <span>
                                                                    {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model} ({appointment.vehicle.licensePlate})
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                            appointment.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {appointment.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {upcomingAppointments.length > 3 && (
                                            <div className="text-center pt-2">
                                                <button
                                                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                                    onClick={() => navigate('/customer/appointments')}
                                                >
                                                    View all {upcomingAppointments.length} appointments
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 sm:py-8">
                                        <p className="text-gray-600 mb-4">You don't have any upcoming appointments.</p>
                                        <button
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            onClick={() => navigate('/customer/appointments/schedule')}
                                        >
                                            Schedule an Appointment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FeatureGate>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    {/* Notifications */}
                    <FeatureGate feature="enableNotifications">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-yellow-600 to-yellow-700">
                                <h3 className="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="text-center py-6 sm:py-8">
                                    <p className="text-gray-600">You have no new notifications</p>
                                </div>
                            </div>
                        </div>
                    </FeatureGate>

                    {/* Maintenance Tips */}
                    <FeatureGate feature="enableMaintenanceGuide">
                        <div className="bg-gradient-to-br from-blue-700 to-purple-700 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-6 text-white">
                                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Maintenance Tips</h3>
                                <ul className="space-y-2 sm:space-y-3">
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm">Check tire pressure monthly for optimal fuel efficiency</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm">Replace air filters every 15,000-30,000 miles</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm">Change oil every 3,000-5,000 miles for conventional oil</span>
                                    </li>
                                </ul>
                                <button
                                    className="w-full mt-4 sm:mt-6 bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                                    onClick={() => navigate('/customer/maintenance-guide')}
                                >
                                    View Full Maintenance Guide
                                </button>
                            </div>
                        </div>
                    </FeatureGate>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;