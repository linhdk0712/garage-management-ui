export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    firstName: string;
    lastName: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    preferredContactMethod: string;
    roles: string[];
}

export interface BackendResponse<T> {
    errorCode: string;
    errorMessage: string;
    tranDate: string;
    data: T;
}

export interface AuthResponseData {
    token: string;
    refreshToken: string;
    type: string;
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export type AuthResponse = {
    data: AuthResponseData;
};

export interface AuthData {
    token: string;
    user: User;
}

export interface TokenRefreshRequest {
    refreshToken: string;
}

export interface TokenRefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}