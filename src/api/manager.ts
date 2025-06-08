import apiClient from './apiClient';
import { ManagerProfile } from '../types/manager.types';
import { ROUTES } from '../config/routes';

export const fetchManagerProfile = async (userId: string): Promise<ManagerProfile> => {
    return apiClient.get(`${ROUTES.manager.profile}/${userId}`);
};

export const updateManagerProfile = async (profile: ManagerProfile): Promise<ManagerProfile> => {
    return apiClient.put(`${ROUTES.manager.profile}`, profile);
};