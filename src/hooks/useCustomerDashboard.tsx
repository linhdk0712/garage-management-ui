import { useState, useEffect, useCallback } from 'react';
import { fetchCustomerDashboard } from '../api/appointments';
import { Appointment } from '../types/appointment.types';
import { Vehicle } from '../types/vehicle.types';
import { ROUTES } from '../config/routes';

interface UseCustomerDashboardOptions {
    initialFetch?: boolean;
}

/**
 * Custom hook for managing customer dashboard data (appointments and vehicles)
 * @param options Hook configuration options
 * @returns Dashboard state and methods
 */
const useCustomerDashboard = (options: UseCustomerDashboardOptions = {}) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { initialFetch = true } = options;

    // Fetch dashboard data (appointments and vehicles)
    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchCustomerDashboard(ROUTES.customer.appointments);
            setAppointments(data.appointments);
            setVehicles(data.vehicles);
            return data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            setAppointments([]);
            setVehicles([]);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update appointments (for when new appointments are created or existing ones are updated)
    const updateAppointments = useCallback((newAppointments: Appointment[]) => {
        setAppointments(newAppointments);
    }, []);

    // Update vehicles (for when new vehicles are added or existing ones are updated)
    const updateVehicles = useCallback((newVehicles: Vehicle[]) => {
        setVehicles(newVehicles);
    }, []);

    // Initial fetch
    useEffect(() => {
        if (initialFetch) {
            fetchDashboardData();
        }
    }, [fetchDashboardData, initialFetch]);

    return {
        appointments,
        vehicles,
        isLoading,
        error,
        fetchDashboardData,
        updateAppointments,
        updateVehicles,
    };
};

export default useCustomerDashboard; 