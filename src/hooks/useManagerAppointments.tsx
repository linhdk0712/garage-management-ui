import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    fetchAppointments,
    fetchAppointmentDetails,
    updateAppointmentStatus,
} from '../api/appointments';
import { Appointment } from '../types/appointment.types';
import { PaginatedResponse } from '../types/response.types';
import { ROUTES } from '../config/routes';

interface UseManagerAppointmentsOptions {
    initialFetch?: boolean;
    filters?: {
        status?: string;
        from?: string;
        to?: string;
    };
    pagination?: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
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
    const [pagination, setPagination] = useState<{
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
        isFirst: boolean;
        isLast: boolean;
        content: any[];
    }>({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        isFirst: true,
        isLast: true,
        content: [],
    });
    const initialFetchRef = useRef(false);

    const { initialFetch = true, filters: initialFilters = {}, pagination: initialPagination = {} } = options;

    // Memoize filters to prevent unnecessary re-renders
    const filters = useMemo(() => initialFilters, [initialFilters]);

    // Fetch all appointments for manager with pagination
    const fetchAllAppointments = useCallback(async (customFilters?: typeof filters, customPagination?: typeof pagination) => {
        try {
            setIsLoading(true);
            setError(null);
            const queryFilters = customFilters || filters;
            const queryPagination = customPagination || pagination;
            
            const response = await fetchAppointments(ROUTES.manager.appointments, {
                ...queryFilters,
                page: queryPagination.page,
                size: queryPagination.size,
                sortBy: 'appointmentDate',
                sortDirection: 'asc',
            });
            
            // Extract the appointments array from the paginated response
            if (response?.content) {
                setAppointments(response.content);
                setPagination({
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    hasNext: response.hasNext,
                    hasPrevious: response.hasPrevious,
                    isFirst: response.isFirst,
                    isLast: response.isLast,
                    content: response.content,
                });
                return response;
            } else {
                setAppointments([]);
                setPagination({
                    page: 0,
                    size: 10,
                    totalElements: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrevious: false,
                    isFirst: true,
                    isLast: true,
                    content: [],
                });
                return null;
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
            setAppointments([]);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

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

    // Pagination methods
    const goToPage = useCallback((page: number) => {
        setPagination(prev => ({ ...prev, page }));
    }, []);

    const changePageSize = useCallback((size: number) => {
        setPagination(prev => ({ ...prev, page: 0, size }));
    }, []);

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
        pagination,
        fetchAllAppointments,
        fetchAppointment,
        updateStatus,
        selectAppointment,
        goToPage,
        changePageSize,
    };
};

export default useManagerAppointments; 