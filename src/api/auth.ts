import apiClient from './apiClient';
import { LoginCredentials, RegisterData, AuthResponseData, TokenRefreshRequest, TokenRefreshResponse, User } from '../types/auth.types';
import { ROUTES } from '../config/routes';

/**
 * Authenticate user with username and password
 * @param credentials Login credentials
 * @returns Auth response with token and user data (AuthResponseData)
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    try {
        const response = await apiClient.post<AuthResponseData>(ROUTES.auth.login, credentials);
        return response;
    } catch (error) {
        console.error('Login error caught in auth.ts:', error);
        throw error;
    }
};

/**
 * Register a new user account
 * @param data Registration form data
 * @returns Customer DTO object
 */
export const register = async (data: RegisterData): Promise<any> => {
    const response = await apiClient.post<any>(ROUTES.auth.register, data);
    return response; 
};

/**
 * Refresh authentication token
 * @param request Token refresh request
 * @returns Token refresh response
 */
export const refreshToken = async (request: TokenRefreshRequest): Promise<TokenRefreshResponse> => {
    const response = await apiClient.post<TokenRefreshResponse>(ROUTES.auth.refresh, request);
    return response;
};

/**
 * Log out the current user from the backend.
 * @param userId User ID to logout
 * @returns Success message string from backend if successful
 */
export const logout = async (userId: number): Promise<string> => {
    try {
        const response = await apiClient.post<string>(ROUTES.auth.logout, null, { params: { userId } });
        return response;
    } catch (error) {
        console.error('Error during API logout call in auth.ts:', error);
        throw error;
    }
};

/**
 * Request password reset for a user
 * @param email User's email address
 * @returns Success message string
 */
export const requestPasswordReset = async (email: string): Promise<string> => {
    const response = await apiClient.post<string>(ROUTES.auth.forgotPassword, { email });
    return response;
};

/**
 * Reset user password with token
 * @param token Reset token from email
 * @param newPassword New password
 * @returns Success message string
 */
export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
    const response = await apiClient.post<string>(ROUTES.auth.resetPassword, { token, newPassword });
    return response;
};

/**
 * Change current user's password
 * @param currentPassword Current password for verification
 * @param newPassword New password
 * @returns Success message string
 */
export const changePassword = async (
    currentPassword: string,
    newPassword: string
): Promise<string> => {
    const response = await apiClient.post<string>(ROUTES.auth.changePassword, {
        currentPassword,
        newPassword,
    });
    return response;
};

/**
 * Get current user profile information
 * @returns User profile data
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>(ROUTES.auth.me);
    return response;
};