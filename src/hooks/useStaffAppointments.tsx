import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    fetchStaffAppointments,
    fetchAppointmentDetails,
    updateAppointmentStatus,
} from '../api/appointments';
import { Appointment } from '../types/appointment.types';
import { ROUTES } from '../config/routes';

interface UseStaffAppointmentsOptions {
    initialFetch?: boolean;
    filters?: {
        status?: string;
        from?: string;
        to?: string;
    };
}

/**
 * Custom hook for managing appointments in the staff interface
 * Uses the staff-specific API endpoint /api/v1/staff/appointments
 * @param options Hook configuration options
 * @returns Appointments state and methods
 */
const useStaffAppointments = (options: UseStaffAppointmentsOptions = {}) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const initialFetchRef = useRef(false);

    const { initialFetch = true, filters: initialFilters = {} } = options;

    // Memoize filters to prevent unnecessary re-renders
    const filters = useMemo(() => initialFilters, [initialFilters]);

    // Fetch all appointments for staff
    const fetchAllAppointments = useCallback(async (customFilters?: typeof filters) => {
        try {
            setIsLoading(true);
            setError(null);
            const queryFilters = customFilters || filters;
            const response = await fetchStaffAppointments(ROUTES.staff.appointments, queryFilters);
            
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
            const data = await fetchAppointmentDetails(ROUTES.staff.appointments, appointmentId);
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
            const updatedAppointment = await updateAppointmentStatus(ROUTES.staff.appointments, {
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
        if (initialFetch && !initialFetchRef.current) {
            initialFetchRef.current = true;
            fetchAllAppointments();
        }
    }, [initialFetch]);

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

export default useStaffAppointments; 