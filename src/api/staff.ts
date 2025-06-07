import { Staff, StaffProfile } from '../types/staff.types';
import apiClient from './apiClient';


export const fetchStaffProfile = async (userId: string): Promise<StaffProfile> => {
    return apiClient.get(`/staff/profile/${userId}`);
};

export const updateStaffProfile = async (profile: StaffProfile): Promise<StaffProfile> => {
    return apiClient.put('/staff/profile', profile);
};

export const fetchAllStaff = async (): Promise<Staff[]> => {
    return apiClient.get('/staff');
}; 