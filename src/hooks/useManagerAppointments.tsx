import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    fetchAppointments,
    fetchAppointmentDetails,
    updateAppointmentStatus,
} from '../api/appointments';
import { Appointment } from '../types/appointment.types';
import { ROUTES } from '../config/routes';

interface UseManagerAppointmentsOptions {
    initialFetch?: boolean;
    filters?: {
        status?: string;
        from?: string;
        to?: string;
    };
}

/**
 * Custom hook for managing appointments in the manager interface
 * Uses the manager-specific API endpoint /api/v1/manager/appointments
 * @param options Hook configuration options
 * @returns Appointments state and methods
 */
const useManagerAppointments = (options: UseManagerAppointmentsOptions = {}) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { initialFetch = true, filters: initialFilters = {} } = options;

    // Memoize filters to prevent unnecessary re-renders
    const filters = useMemo(() => initialFilters, [initialFilters]);

    // Fetch all appointments for manager
    const fetchAllAppointments = useCallback(async (customFilters?: typeof filters) => {
        try {
            setIsLoading(true);
            setError(null);
            const queryFilters = customFilters || filters;
            const data = await fetchAppointments(ROUTES.manager.appointments, queryFilters);
            setAppointments(data);
            return data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch a single appointment
    const fetchAppointment = useCallback(async (appointmentId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchAppointmentDetails(ROUTES.manager.appointments, appointmentId);
            setSelectedAppointment(data);
            return data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch appointment details');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update appointment status
    const updateStatus = useCallback(async (appointmentId: number, status: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedAppointment = await updateAppointmentStatus(ROUTES.manager.appointments, {
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
        isLoading,
        error,
        fetchAllAppointments,
        fetchAppointment,
        updateStatus,
        selectAppointment,
    };
};

export default useManagerAppointments; 