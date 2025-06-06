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
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    preferredContactMethod: string;
}

export interface BackendResponse<T> {
    errorCode: string;
    errorMessage: string;
    tranDate: string;
    data: T;
}

export interface AuthResponseData {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export type AuthResponse = {
    data: AuthResponseData;
};

export interface AuthData {
    token: string;
    user: User;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}