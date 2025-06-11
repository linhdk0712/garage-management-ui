import { ROUTES } from '../config/routes';
import { Staff, StaffProfile, CreateStaffFormData } from '../types/staff.types';
import { PaginatedResponse } from '../types/response.types';
import apiClient from './apiClient';


export const fetchStaffProfile = async (userId: string): Promise<StaffProfile> => {
    return apiClient.get(`${ROUTES.staff.profile}/${userId}`);
};

export const updateStaffProfile = async (profile: StaffProfile): Promise<StaffProfile> => {
    return apiClient.put(`${ROUTES.staff.profile}`, profile);
};

export const fetchAllStaff = async (apiUrl: string, params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}): Promise<PaginatedResponse<Staff>> => {
    return apiClient.get<PaginatedResponse<Staff>>(apiUrl, { params });
};

/**
 * Create a new staff member
 * @param staffData Staff creation form data
 * @returns Newly created staff member
 */
export const createStaff = async (staffData: CreateStaffFormData): Promise<Staff> => {
    return apiClient.post<Staff>(ROUTES.staff.list, staffData);
};

/**
 * Get work orders for the current staff member
 * @param params Optional filter parameters including pagination
 * @returns Paginated response of work orders
 */
export const getWorkOrders = async (params?: {
    page?: number;
    size?: number;
    status?: string;
    from?: string;
    to?: string;
}): Promise<any> => {
    return apiClient.get(ROUTES.staff.workOrders, { params });
};

/**
 * Get appointments for the current staff member
 * @param params Optional filter parameters including pagination
 * @returns Paginated response of appointments
 */
export const getAppointments = async (params?: {
    page?: number;
    size?: number;
    status?: string;
    from?: string;
    to?: string;
}): Promise<any> => {
    return apiClient.get(ROUTES.staff.appointments, { params });
}; 