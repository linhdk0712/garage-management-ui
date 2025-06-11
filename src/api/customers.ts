import apiClient from './apiClient';
import { CustomerProfile, CustomerStatistics } from '../types/customer.types';
import { PaginatedResponse } from '../types/response.types';
import { ROUTES } from '../config/routes';

/**
 * Fetch the current customer's profile by username
 * @param userName Username of the customer
 * @returns Customer profile data
 */
export const fetchCustomerProfile = async (userName: string): Promise<CustomerProfile> => {
    return apiClient.get<CustomerProfile>(`${ROUTES.customer.profile}/${userName}`);
};

/**
 * Update the current customer's profile
 * @param profileData Updated profile data
 * @returns Success message
 */
export const updateCustomerProfile = async (profileData: Partial<CustomerProfile>): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`${ROUTES.customer.profile}`, profileData);
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
 * For manager: Fetch list of all customers with pagination
 * @param params Optional filter parameters including pagination
 * @returns Paginated response of customers
 */
export const fetchAllCustomers = async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
    status?: string;
}): Promise<PaginatedResponse<CustomerProfile>> => {
    return apiClient.get<PaginatedResponse<CustomerProfile>>(ROUTES.customer.profile, { params });
};

/**
 * For manager: Fetch customer statistics
 * @param period Time period for statistics
 * @returns Customer statistics data
 */
export const fetchCustomerStatistics = async (period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'): Promise<CustomerStatistics> => {
    return apiClient.get<CustomerStatistics>('/manager/reports/customers', { params: { period } });
};