import apiClient from './apiClient';
import { RepairHistory } from '../types/repair.types';

export const fetchRepairHistory = async (): Promise<RepairHistory[]> => {
    return await apiClient.get('/repairs/history');
};

export const fetchRepairDetails = async (repairId: number): Promise<RepairHistory> => {
    return await apiClient.get(`/repairs/${repairId}`);
}; 