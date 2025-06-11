import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign, Car } from 'lucide-react';
import { fetchAppointments, cancelAppointment } from '../../../api/appointments';
import { Appointment } from '../../../types/appointment.types';
import Button from '../../common/Button';
import { ROUTES } from '../../../config/routes';

interface AppointmentListProps {
    onEditAppointment: (appointmentId: number) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ onEditAppointment }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setIsLoading(true);
            const response = await fetchAppointments(ROUTES.customer.appointments);
            console.log("response", response);
            
            // Extract the appointments array from the paginated response
            if (response?.content) {
                setAppointments(response.content);
                console.log("appointments.length", response.content.length);
            } else {
                setAppointments([]);
                console.log("appointments.length", 0);
            }
        } catch (err) {
            setError('Failed to load appointments. Please try again later.');
            console.error('Error loading appointments:', err);
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId: number) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            await cancelAppointment(ROUTES.customer.appointments, appointmentId);
            setAppointments(appointments.filter(apt => apt.appointmentId !== appointmentId));
        } catch (err) {
            console.error('Error canceling appointment:', err);
            alert('Failed to cancel appointment. Please try again.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800';
            case 'CONFIRMED':
                return 'bg-purple-100 text-purple-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any appointments scheduled.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {appointments.map((appointment) => (
                <div
                    key={appointment.appointmentId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {appointment.serviceType}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{appointment.description}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                                ${appointment.estimatedCost?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm text-gray-500">Estimated Cost</p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <Car className="h-4 w-4 mr-2" />
                            <span>
                                {appointment.vehicle ? (
                                  <>
                                    {appointment.vehicle.make} {appointment.vehicle.model}
                                  </>
                                ) : (
                                  <span className="text-gray-400">No vehicle information</span>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{appointment.estimatedDuration || 0} hours</span>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>${appointment.estimatedCost?.toFixed(2) || '0.00'} estimated</span>
                        </div>
                    </div>

                    {appointment.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                            <p className="mt-1 text-sm text-gray-500">{appointment.notes}</p>
                        </div>
                    )}

                    {appointment.status === 'PENDING' && (
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                            <div className="flex space-x-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onEditAppointment(appointment.appointmentId)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment.appointmentId)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AppointmentList; 