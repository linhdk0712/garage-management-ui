import { useState, useEffect, useCallback } from 'react';
import {
    fetchAppointments,
    fetchAppointmentDetails,
    scheduleAppointment,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    fetchAvailableTimeSlots
} from '../api/appointments';
import { Appointment, AppointmentFormData, TimeSlot } from '../types/appointment.types';
import { ROUTES } from '../config/routes';

interface UseAppointmentsOptions {
    initialFetch?: boolean;
    filters?: {
        status?: string;
        from?: string;
        to?: string;
    };
}

/**
 * Custom hook for managing appointments
 * @param options Hook configuration options
 * @returns Appointments state and methods
 */
const useAppointments = (options: UseAppointmentsOptions = {}) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { initialFetch = true, filters = {} } = options;

    // Fetch all appointments
    const fetchAllAppointments = useCallback(async (customFilters?: typeof filters) => {
        try {
            setIsLoading(true);
            setError(null);
            const queryFilters = customFilters || filters;
            const response = await fetchAppointments(ROUTES.customer.appointments, queryFilters);
            
            // Extract the appointments array from the paginated response
            if (response && response.content) {
                setAppointments(response.content);
                return response.content;
            } else {
                setAppointments([]);
                return [];
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
            setAppointments([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Fetch a single appointment
    const fetchAppointment = useCallback(async (appointmentId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchAppointmentDetails(ROUTES.customer.appointments, appointmentId);
            setSelectedAppointment(data);
            return data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch appointment details');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create a new appointment
    const createAppointment = useCallback(async (appointmentData: AppointmentFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            const newAppointment = await scheduleAppointment(ROUTES.customer.appointments, appointmentData);
            setAppointments((prev) => [...prev, newAppointment]);
            return newAppointment;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to schedule appointment');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update an appointment
    const editAppointment = useCallback(async (appointmentId: number, appointmentData: Partial<AppointmentFormData>) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedAppointment = await updateAppointment(ROUTES.customer.appointments, appointmentData as AppointmentFormData);
            setAppointments((prev) =>
                prev.map((appointment) =>
                    appointment.appointmentId === appointmentId ? updatedAppointment : appointment
                )
            );
            if (selectedAppointment?.appointmentId === appointmentId) {
                setSelectedAppointment(updatedAppointment);
            }
            return updatedAppointment;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update appointment');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedAppointment]);

    // Update appointment status
    const updateStatus = useCallback(async (appointmentId: number, status: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedAppointment = await updateAppointmentStatus(ROUTES.customer.appointments, {
                appointmentId,
                status
            });
            setAppointments((prev) =>
                prev.map((appointment) =>
                    appointment.appointmentId === appointmentId ? updatedAppointment : appointment
                )
            );
            if (selectedAppointment?.appointmentId === appointmentId) {
                setSelectedAppointment(updatedAppointment);
            }
            return updatedAppointment;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update appointment status');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedAppointment]);

    // Cancel an appointment
    const removeAppointment = useCallback(async (appointmentId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            await cancelAppointment(ROUTES.customer.appointments, appointmentId);
            setAppointments((prev) =>
                prev.filter((appointment) => appointment.appointmentId !== appointmentId)
            );
            if (selectedAppointment?.appointmentId === appointmentId) {
                setSelectedAppointment(null);
            }
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedAppointment]);

    // Fetch available time slots
    const fetchTimeSlots = useCallback(async (date: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const slots = await fetchAvailableTimeSlots(ROUTES.customer.appointments, date);
            setAvailableSlots(slots);
            return slots;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch available time slots');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Select an appointment
    const selectAppointment = useCallback((appointmentId: number | null) => {
        if (appointmentId === null) {
            setSelectedAppointment(null);
            return;
        }

        const appointment = appointments.find((a) => a.appointmentId === appointmentId);
        setSelectedAppointment(appointment || null);
    }, [appointments]);

    // Initial fetch
    useEffect(() => {
        if (initialFetch) {
            fetchAllAppointments();
        }
    }, [fetchAllAppointments, initialFetch]);

    return {
        appointments,
        selectedAppointment,
        availableSlots,
        isLoading,
        error,
        fetchAllAppointments,
        fetchAppointment,
        createAppointment,
        editAppointment,
        updateStatus,
        removeAppointment,
        fetchTimeSlots,
        selectAppointment,
    };
};

export default useAppointments;