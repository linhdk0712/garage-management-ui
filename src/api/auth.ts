import apiClient from './apiClient';
import { LoginCredentials, RegisterData, AuthResponseData, User, BackendResponse } from '../types/auth.types';
import { ROUTES } from '../config/routes';

/**
 * Authenticate user with username and password
 * @param credentials Login credentials
 * @returns Auth response with token and user data (AuthResponseData)
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    console.log('Login request payload:', credentials);
    try {
        // apiClient.post<AuthResponseData> will return AuthResponseData directly if errorCode is SUCCESS
        const response = await apiClient.post<AuthResponseData>(ROUTES.auth.login, credentials);
        console.log('Login response (unwrapped data):', response);
        return response;
    } catch (error) {
        console.error('Login error caught in auth.ts:', error);
        throw error; // Re-throw for AuthContext to handle
    }
};

/**
 * Register a new user account
 * @param data Registration form data
 * @returns User ID object
 */
export const register = async (data: RegisterData): Promise<{ userId: number }> => {
    // apiClient.post will return { userId: number } directly if errorCode is SUCCESS
    const response = await apiClient.post<{ userId: number }>(ROUTES.auth.register, data);
    return response; 
    // No need to check errorCode here, apiClient.post handles it
};

/**
 * Log out the current user from the backend.
 * AuthContext will handle local state cleanup regardless of API success.
 * @param userId ID of the user to logout
 * @param token User's authentication token
 * @returns Success message string from backend if successful
 */
export const logout = async (userId: number, token: string): Promise<string> => {
    try {
        // apiClient.post will return the success message string if API call is successful
        const message = await apiClient.post<string>(
            ROUTES.auth.logout,
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return message; // Return backend success message
    } catch (error) {
        console.error('Error during API logout call in auth.ts:', error);
        // Even if API logout fails, AuthContext should proceed with local logout.
        // We re-throw so AuthContext knows an error occurred, but it can choose to ignore it for logout.
        // Or, to strictly follow original intent of *always* succeeding locally:
        // return "Logout API call failed, but local logout will proceed."; 
        // For now, let's re-throw and let AuthContext decide.
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
    // No need to check errorCode here, apiClient.post handles it
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
    // No need to check errorCode here, apiClient.post handles it
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
    // No need to check errorCode here, apiClient.post handles it
};

/**
 * Get current user profile information
 * @returns User profile data
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>(ROUTES.auth.me);
    return response;
    // No need to check errorCode here, apiClient.get handles it
};