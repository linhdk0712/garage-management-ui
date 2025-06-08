import { ROUTES } from '../config/routes';
import { Staff, StaffProfile } from '../types/staff.types';
import apiClient from './apiClient';


export const fetchStaffProfile = async (userId: string): Promise<StaffProfile> => {
    return apiClient.get(`${ROUTES.staff.profile}/${userId}`);
};

export const updateStaffProfile = async (profile: StaffProfile): Promise<StaffProfile> => {
    return apiClient.put(`${ROUTES.staff.profile}`, profile);
};

export const fetchAllStaff = async (apiUrl: string): Promise<Staff[]> => {
    return apiClient.get(`${apiUrl}`);
}; 