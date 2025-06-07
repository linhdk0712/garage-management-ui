import apiClient from './apiClient';
import { CustomerProfile } from '../types/customer.types';

/**
 * Fetch the current customer's profile
 * @returns Customer profile data
 */
export const fetchCustomerProfile = async (userId: string): Promise<CustomerProfile> => {
    return apiClient.get<CustomerProfile>(`/customers/profile/${userId}`);
};

/**
 * Update the current customer's profile
 * @param profileData Updated profile data
 * @returns Success message
 */
export const updateCustomerProfile = async (profileData: Partial<CustomerProfile>): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/customers/profile', profileData);
};

/**
 * Fetch a customer's loyalty program information
 * @returns Loyalty data including tier, points, and available rewards
 */
export const fetchCustomerLoyalty = async () => {
    return apiClient.get('/customers/loyalty');
};

/**
 * Redeem a loyalty reward
 * @param rewardId ID of the reward to redeem
 * @returns Success message
 */
export const redeemReward = async (rewardId: number): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/customers/loyalty/rewards/${rewardId}/redeem`);
};

/**
 * For staff/manager: Fetch a specific customer's details
 * @param customerId ID of the customer
 * @returns Customer details
 */
export const fetchCustomerDetails = async (customerId: number): Promise<CustomerProfile> => {
    return apiClient.get<CustomerProfile>(`/customers/${customerId}`);
};

/**
 * For manager: Fetch list of all customers
 * @param params Optional filter parameters
 * @returns Array of customers
 */
export const fetchAllCustomers = async (params?: {
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}): Promise<{ customers: CustomerProfile[]; total: number; page: number; limit: number }> => {
    return apiClient.get('/manager/customers', { params });
};

/**
 * For manager: Fetch customer statistics
 * @param period Time period for statistics
 * @returns Customer statistics data
 */
export const fetchCustomerStatistics = async (period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR') => {
    return apiClient.get('/manager/reports/customers', { params: { period } });
};