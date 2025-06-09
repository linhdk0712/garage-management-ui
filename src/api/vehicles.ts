import apiClient from './apiClient';
import { Vehicle, VehicleFormData, HealthData, MaintenanceItem } from '../types/vehicle.types';
import { ROUTES } from '../config/routes';
/**
 * Fetch all vehicles for the current customer
 * @returns Array of vehicles
 */
export const fetchCustomerVehicles = async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>(ROUTES.vehicle.list);
    console.log("fetchCustomerVehicles", response);
    return response;
};

/**
 * Fetch details for a specific vehicle
 * @param vehicleId ID of the vehicle
 * @returns Vehicle details
 */
export const fetchVehicleDetails = async (vehicleId: number): Promise<Vehicle> => {
    const response = await apiClient.get<Vehicle>(ROUTES.vehicle.details.replace(':id', vehicleId.toString()));
    console.log("fetchVehicleDetails", response);
    return response;
};

/**
 * Register a new vehicle for the current customer
 * @param vehicleData Vehicle form data
 * @returns Newly created vehicle
 */
export const addVehicle = async (vehicleData: VehicleFormData): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>(ROUTES.vehicle.create, vehicleData);
    console.log("addVehicle",response);
    return response;
};

/**
 * Update a vehicle's information
 * @param vehicleId ID of the vehicle to update
 * @param vehicleData Updated vehicle data
 * @returns Updated vehicle
 */
export const updateVehicle = async (vehicleId: number, vehicleData: Partial<VehicleFormData>): Promise<Vehicle> => {
    const response = await apiClient.put<Vehicle>(
        ROUTES.vehicle.update.replace(':id', vehicleId.toString()),
        { ...vehicleData, vehicleId } // Include vehicleId in the request body
    );
    console.log("updateVehicle", response);
    return response;
};

/**
 * Delete a vehicle
 * @param vehicleId ID of the vehicle to delete
 * @returns Success message
 */
export const deleteVehicle = async (vehicleId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(ROUTES.vehicle.delete.replace(':id', vehicleId.toString()));
    console.log("deleteVehicle",response);
    return response;
};

/**
 * Fetch the repair history for a vehicle
 * @param vehicleId ID of the vehicle
 * @returns Array of repair records
 */
export const fetchVehicleRepairHistory = async (vehicleId: number) => {
    const response = await apiClient.get(ROUTES.vehicle.history.replace(':id', vehicleId.toString()));
    console.log("fetchVehicleRepairHistory",response);
    return response;
};

/**
 * Fetch vehicle health data (for health dashboard)
 * @param vehicleId ID of the vehicle
 * @returns Vehicle health data
 */
export const fetchVehicleHealth = async (vehicleId: number): Promise<HealthData> => {
    const response = await apiClient.get<HealthData>(ROUTES.vehicle.health.replace(':id', vehicleId.toString()));
    console.log("fetchVehicleHealth",response);
    return response;
};

/**
 * Fetch maintenance schedule for a vehicle
 * @param vehicleId ID of the vehicle
 * @returns Maintenance schedule items
 */
export const fetchMaintenanceSchedule = async (vehicleId: number): Promise<MaintenanceItem[]> => {
    const response = await apiClient.get<MaintenanceItem[]>(ROUTES.vehicle.maintenanceSchedule.replace(':id', vehicleId.toString()));
    console.log("fetchMaintenanceSchedule",response);
    return response;
};

/**
 * For staff: Fetch all vehicles
 * @param params Optional filter parameters
 * @returns Array of vehicles
 */
export const fetchAllVehicles = async (params?: {
    search?: string;
    make?: string;
    model?: string;
    year?: number;
    customerId?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}) => {
    const response = await apiClient.get(ROUTES.vehicle.list, { params });
    console.log("fetchAllVehicles",response);
    return response;
};

/**
 * For manager: Fetch all vehicles with customer information
 * @param params Optional filter parameters
 * @returns Array of vehicles with customer details
 */
export const fetchAllVehiclesWithCustomers = async (params?: {
    search?: string;
    make?: string;
    model?: string;
    year?: number;
    customerId?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}) => {
    const response = await apiClient.get(ROUTES.manager.vehicles, { params });
    console.log("fetchAllVehiclesWithCustomers", response);
    return response;
};