import { useState, useEffect } from 'react';
import { Appointment, TimeSlot } from '../types/appointment.types';
import { fetchAppointments, fetchAppointmentDetails, fetchAvailableTimeSlots, cancelAppointment } from '../api/appointments';
import { ROUTES } from '../config/routes';

interface UseAppointmentsProps {
    initialFetch?: boolean;
}

const useAppointments = ({ initialFetch = false }: UseAppointmentsProps = {}) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllAppointments = async (customFilters?: { status?: string; from?: string; to?: string }) => {
        try {
            setIsLoading(true);
            const data = await fetchAppointments(ROUTES.customer.appointments, customFilters);
            setAppointments(data);
        } catch (err) {
            setError('Failed to fetch appointments');
            console.error('Error fetching appointments:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const selectAppointment = (appointmentId: number | null) => {
        if (!appointmentId) {
            setSelectedAppointment(null);
            return;
        }

        fetchAppointmentDetails(ROUTES.customer.appointments, appointmentId)
            .then(setSelectedAppointment)
            .catch(err => {
                console.error('Error fetching appointment details:', err);
                setError('Failed to fetch appointment details');
            });
    };

    const fetchSlots = async (date: string) => {
        try {
            const slots = await fetchAvailableTimeSlots(ROUTES.customer.appointments, date);
            setAvailableSlots(slots);
        } catch (err) {
            console.error('Error fetching available slots:', err);
            setError('Failed to fetch available time slots');
        }
    };

    const handleCancelAppointment = async (appointmentId: number) => {
        try {
            await cancelAppointment(ROUTES.customer.appointments, appointmentId);
            setAppointments(appointments.filter(apt => apt.appointmentId !== appointmentId));
        } catch (err) {
            console.error('Error canceling appointment:', err);
            setError('Failed to cancel appointment');
            throw err;
        }
    };

    useEffect(() => {
        if (initialFetch) {
            fetchAllAppointments();
        }
    }, [initialFetch]);

    return {
        appointments,
        selectedAppointment,
        availableSlots,
        isLoading,
        error,
        fetchAllAppointments,
        selectAppointment,
        fetchSlots,
        cancelAppointment: handleCancelAppointment
    };
};

export default useAppointments; 