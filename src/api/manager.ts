import apiClient from './apiClient';
import { ManagerProfile } from '../types/manager.types';

export const fetchManagerProfile = async (userId: string): Promise<ManagerProfile> => {
    return apiClient.get(`/managers/profile/${userId}`);
};

export const updateManagerProfile = async (profile: ManagerProfile): Promise<ManagerProfile> => {
    return apiClient.put('/managers/profile', profile);
};