import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, isToday, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Car, ArrowRight } from 'lucide-react';
import { fetchStaffAppointments, updateAppointmentStatus } from '../../api/appointments';
import { Appointment } from '../../types/appointment.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const AppointmentCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Generate array of dates for the week
        const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start week on Monday
        const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
        setWeekDates(dates);

        // Fetch appointments
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchStaffAppointments(ROUTES.staff.appointments, {
                    from: format(dates[0], 'yyyy-MM-dd'),
                    to: format(dates[6], 'yyyy-MM-dd')
                });
                
                // Extract the appointments array from the paginated response
                if (response?.content) {
                    setAppointments(response.content);
                } else {
                    setAppointments([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentDate]);

    const nextWeek = () => {
        setCurrentDate(addWeeks(currentDate, 1));
    };

    const prevWeek = () => {
        setCurrentDate(subWeeks(currentDate, 1));
    };

    const getAppointmentsForDate = (date: Date) => {
        return appointments.filter(appointment =>
            isSameDay(parseISO(appointment.appointmentDate), date)
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'IN_PROGRESS':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const handleStatusChange = async (appointmentId: number, newStatus: string) => {
        try {
            await updateAppointmentStatus(ROUTES.staff.appointments, {
                appointmentId,
                status: newStatus
            });

            // Update local state
            setAppointments(prevAppointments =>
                prevAppointments.map(appointment =>
                    appointment.appointmentId === appointmentId
                        ? { ...appointment, status: newStatus as Appointment['status'] }
                        : appointment
                )
            );
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };

    const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Appointment Calendar</h2>
                <div className="flex space-x-2">
                    <button
                        className="p-1.5 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30"
                        onClick={prevWeek}
                        title="Previous week"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="p-1.5 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30"
                        onClick={nextWeek}
                        title="Next week"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-max">
                    <div className="grid grid-cols-8 border-b">
                        <div className="p-3 font-medium text-gray-500 text-center bg-gray-50">Time</div>
                        {weekDates.map((date, index) => (
                            <div
                                key={index}
                                className={`p-3 font-medium text-center ${
                                    isToday(date) ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                                }`}
                            >
                                <div>{format(date, 'EEE')}</div>
                                <div className={`text-lg ${isToday(date) ? 'font-bold' : ''}`}>
                                    {format(date, 'd')}
                                </div>
                            </div>
                        ))}
                    </div>

                    {timeSlots.map(hour => (
                        <div key={hour} className="grid grid-cols-8 border-b">
                            <div className="p-2 text-sm text-gray-500 text-center border-r">
                                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                            </div>

                            {weekDates.map((date, dateIndex) => {
                                const appointmentsForTimeSlot = getAppointmentsForDate(date).filter(apt => {
                                    const aptHour = new Date(apt.appointmentDate).getHours();
                                    return aptHour === hour;
                                });

                                return (
                                    <div key={dateIndex} className="p-1.5 border-r min-h-[80px]">
                                        {appointmentsForTimeSlot.length > 0 ? (
                                            <div className="space-y-1.5">
                                                {appointmentsForTimeSlot.map(apt => (
                                                    <div
                                                        key={apt.appointmentId}
                                                        className={`p-1.5 rounded text-xs border ${getStatusColor(apt.status)} cursor-pointer hover:shadow-sm`}
                                                        onClick={() => navigate(`/staff/appointments/${apt.appointmentId}`)}
                                                    >
                                                        <div className="font-medium truncate">{apt.serviceType}</div>
                                                        <div className="flex items-center mt-1">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            <span>
                                {format(new Date(apt.appointmentDate), 'h:mm a')}
                              </span>
                                                        </div>
                                                        <div className="flex items-center mt-1">
                                                            <User className="w-3 h-3 mr-1" />
                                                            <span className="truncate">
                                Customer Info
                              </span>
                                                        </div>
                                                        <div className="flex items-center mt-1">
                                                            <Car className="w-3 h-3 mr-1" />
                                                            <span className="truncate">
                                {apt.vehicle?.make && apt.vehicle?.model ? `${apt.vehicle.make} ${apt.vehicle.model}` : 'No vehicle info'}
                              </span>
                                                        </div>

                                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                                            {apt.status === 'PENDING' && (
                                                                <button
                                                                    className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 text-xs"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStatusChange(apt.appointmentId, 'CONFIRMED');
                                                                    }}
                                                                >
                                                                    Confirm
                                                                </button>
                                                            )}
                                                            {apt.status === 'CONFIRMED' && (
                                                                <button
                                                                    className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 text-xs"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStatusChange(apt.appointmentId, 'IN_PROGRESS');
                                                                    }}
                                                                >
                                                                    Start
                                                                </button>
                                                            )}
                                                            {apt.status === 'IN_PROGRESS' && (
                                                                <button
                                                                    className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 text-xs"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStatusChange(apt.appointmentId, 'COMPLETED');
                                                                    }}
                                                                >
                                                                    Complete
                                                                </button>
                                                            )}
                                                            <button
                                                                className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-xs flex items-center"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/staff/work-orders/create/${apt.appointmentId}`);
                                                                }}
                                                            >
                                                                Details <ArrowRight className="w-3 h-3 ml-0.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppointmentCalendar;