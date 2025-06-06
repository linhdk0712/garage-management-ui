import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clipboard,
    Clock,
    User,
    AlertTriangle,
    CheckCircle,
    Wrench,
    ChevronRight
} from 'lucide-react';
import { fetchStaffAppointments } from '../../api/appointments';
import { fetchWorkOrders } from '../../api/workOrders';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import Badge, { BadgeVariant } from '../common/Badge';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { Appointment } from '../../types/appointment.types';
import { WorkOrder } from '../../types/workOrder.types';
import AppointmentCalendar from './AppointmentCalendar';

const StaffDashboard: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // Get today's date in the format 'YYYY-MM-DD'
                const today = new Date().toISOString().split('T')[0];

                // Fetch today's appointments and active work orders
                const [appointmentsData, workOrdersData] = await Promise.all([
                    fetchStaffAppointments({ date: today }),
                    fetchWorkOrders({ status: 'PENDING,IN_PROGRESS,ON_HOLD' })
                ]);

                setAppointments(appointmentsData);
                setWorkOrders(workOrdersData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'CONFIRMED':
                return 'info';
            case 'IN_PROGRESS':
                return 'primary';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            case 'ON_HOLD':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const getAppointmentTimeText = (appointment: Appointment): string => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoading) {
        return <Spinner size="lg" text="Loading dashboard..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        icon={Calendar}
                        onClick={() => navigate('/staff/appointments')}
                    >
                        View All Appointments
                    </Button>
                    <Button
                        variant="primary"
                        icon={Clipboard}
                        onClick={() => navigate('/staff/work-orders')}
                    >
                        Manage Work Orders
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    title="Today's Schedule"
                    footer={
                        <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate('/staff/appointments')}
                        >
                            View Schedule
                        </Button>
                    }
                >
                    <div className="space-y-3">
                        {appointments.length > 0 ? (
                            appointments.slice(0, 5).map((appointment) => (
                                <div
                                    key={appointment.appointmentId}
                                    className="flex items-start p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/staff/appointments/${appointment.appointmentId}`)}
                                >
                                    <div className="mr-3 mt-0.5">
                                        <Clock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {appointment.serviceType}
                                            </p>
                                            <Badge
                                                label={appointment.status}
                                                variant={getStatusColor(appointment.status) as BadgeVariant}
                                                size="sm"
                                                rounded
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {getAppointmentTimeText(appointment)}
                                        </p>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <User className="h-3.5 w-3.5 mr-1" />
                                            <span>
                        {appointment.customerInfo.firstName} {appointment.customerInfo.lastName}
                      </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6">
                                <Calendar className="h-8 w-8 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">No appointments for today</p>
                            </div>
                        )}
                    </div>
                </Card>

                <Card
                    title="Active Work Orders"
                    footer={
                        <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate('/staff/work-orders')}
                        >
                            View All Work Orders
                        </Button>
                    }
                >
                    <div className="space-y-3">
                        {workOrders.length > 0 ? (
                            workOrders.slice(0, 5).map((workOrder) => (
                                <div
                                    key={workOrder.workOrderId}
                                    className="flex items-start p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/staff/work-orders/${workOrder.workOrderId}`)}
                                >
                                    <div className="mr-3 mt-0.5">
                                        {workOrder.status === 'IN_PROGRESS' ? (
                                            <Wrench className="h-5 w-5 text-blue-500" />
                                        ) : workOrder.status === 'ON_HOLD' ? (
                                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                        ) : (
                                            <Clipboard className="h-5 w-5 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                #{workOrder.workOrderId} - {workOrder.appointment.serviceType}
                                            </p>
                                            <Badge
                                                label={workOrder.status}
                                                variant={getStatusColor(workOrder.status) as BadgeVariant}
                                                size="sm"
                                                rounded
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {workOrder.vehicle.make} {workOrder.vehicle.model} ({workOrder.vehicle.licensePlate})
                                        </p>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <User className="h-3.5 w-3.5 mr-1" />
                                            <span>
                        {workOrder.customer.firstName} {workOrder.customer.lastName}
                      </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6">
                                <Clipboard className="h-8 w-8 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">No active work orders</p>
                            </div>
                        )}
                    </div>
                </Card>

                <Card title="Weekly Stats">
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Appointments</p>
                                <p className="text-xl font-bold text-blue-700">24</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded-full mr-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Completed</p>
                                <p className="text-xl font-bold text-green-700">18</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                            <div className="p-2 bg-yellow-100 rounded-full mr-3">
                                <Wrench className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">In Progress</p>
                                <p className="text-xl font-bold text-yellow-700">6</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                            <div className="p-2 bg-purple-100 rounded-full mr-3">
                                <Clock className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Avg. Completion Time</p>
                                <p className="text-xl font-bold text-purple-700">3.2 hrs</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Appointment Calendar">
                <AppointmentCalendar />
            </Card>
        </div>
    );
};

export default StaffDashboard;