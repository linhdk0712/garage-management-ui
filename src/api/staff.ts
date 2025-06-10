import { ROUTES } from '../config/routes';
import { Staff, StaffProfile, CreateStaffFormData } from '../types/staff.types';
import { PaginatedResponseData } from '../types/response.types';
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
}): Promise<PaginatedResponseData<Staff>> => {
    return apiClient.get<PaginatedResponseData<Staff>>(apiUrl, { params });
};

/**
 * Create a new staff member
 * @param staffData Staff creation form data
 * @returns Newly created staff member
 */
export const createStaff = async (staffData: CreateStaffFormData): Promise<Staff> => {
    return apiClient.post<Staff>('/staff', staffData);
}; 