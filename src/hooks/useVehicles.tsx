import { useState, useEffect, useCallback } from 'react';
import {
    fetchAllVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    fetchVehicleDetails
} from '../api/vehicles';
import { Vehicle, VehicleFormData } from '../types/vehicle.types';

interface UseVehiclesOptions {
    initialFetch?: boolean;
}

interface ApiError {
    message: string;
    status?: number;
}

/**
 * Custom hook for managing vehicles data
 * @param options Hook configuration options
 * @returns Vehicles state and methods
 */
const useVehicles = (options: UseVehiclesOptions = { initialFetch: true }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all vehicles
    const fetchVehicles = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchAllVehicles();
            const vehiclesArray = data.data.content || [];
            setVehicles(vehiclesArray);
            return vehiclesArray;
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Failed to fetch vehicles');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch a single vehicle
    const fetchVehicle = useCallback(async (vehicleId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchVehicleDetails(vehicleId);
            setSelectedVehicle(data);
            return data;
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Failed to fetch vehicle details');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Add a new vehicle
    const createVehicle = useCallback(async (vehicleData: VehicleFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            const newVehicle = await addVehicle(vehicleData);
            setVehicles((prev) => [...prev, newVehicle]);
            return newVehicle;
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Failed to add vehicle');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update a vehicle
    const editVehicle = useCallback(async (vehicleId: number, vehicleData: VehicleFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedVehicle = await updateVehicle(vehicleId, vehicleData);
            setVehicles((prev) =>
                prev.map((vehicle) =>
                    vehicle.vehicleId === vehicleId ? updatedVehicle : vehicle
                )
            );
            if (selectedVehicle?.vehicleId === vehicleId) {
                setSelectedVehicle(updatedVehicle);
            }
            return updatedVehicle;
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Failed to update vehicle');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedVehicle]);

    // Delete a vehicle
    const removeVehicle = useCallback(async (vehicleId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            await deleteVehicle(vehicleId);
            setVehicles((prev) =>
                prev.filter((vehicle) => vehicle.vehicleId !== vehicleId)
            );
            if (selectedVehicle?.vehicleId === vehicleId) {
                setSelectedVehicle(null);
            }
            return true;
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Failed to delete vehicle');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedVehicle]);

    // Select a vehicle
    const selectVehicle = useCallback((vehicleId: number | null) => {
        if (vehicleId === null) {
            setSelectedVehicle(null);
            return;
        }

        const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
        setSelectedVehicle(vehicle || null);
    }, [vehicles]);

    // Initial fetch
    useEffect(() => {
        if (options.initialFetch) {
            fetchVehicles();
        }
    }, [fetchVehicles, options.initialFetch]);

    return {
        vehicles,
        selectedVehicle,
        isLoading,
        error,
        fetchVehicles,
        fetchVehicle,
        createVehicle,
        editVehicle,
        removeVehicle,
        selectVehicle,
    };
};

export default useVehicles;