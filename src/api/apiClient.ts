import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getStoredAuth } from '../utils/storageUtils';
import { toast } from 'react-hot-toast';

interface BackendResponse<T> {
    errorCode: string;
    errorMessage: string;
    tranDate: string;
    data: T;
}

interface ErrorResponse {
    errorMessage?: string;
    errorCode?: string;
    [key: string]: unknown;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const auth = getStoredAuth();
        
        if (auth?.token) {
            config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        
        return response;
    },
    async (error: AxiosError<ErrorResponse>) => {
        

        if (error.response?.status === 401) {
            const errorMessage = error.response.data?.errorMessage || 'Your session has expired. Please log in again.';
            toast.error(errorMessage, { duration: 5000 });
        }

        return Promise.reject(error);
    }
);

const apiClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        axiosInstance.get<BackendResponse<T>>(url, config)
            .then((response) => {
                if (response.data.errorCode === 'SUCCESS') {
                    return response.data.data;
                }
                throw new Error(response.data.errorMessage);
            }),

    post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
        axiosInstance.post<BackendResponse<T>>(url, data, config)
            .then((response) => {
                if (response.data.errorCode === 'SUCCESS') {
                    return response.data.data;
                }
                throw new Error(response.data.errorMessage);
            }),

    put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
        axiosInstance.put<BackendResponse<T>>(url, data, config)
            .then((response) => {
                if (response.data.errorCode === 'SUCCESS') {
                    return response.data.data;
                }
                throw new Error(response.data.errorMessage);
            }),

    patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
        axiosInstance.patch<BackendResponse<T>>(url, data, config)
            .then((response) => {
                if (response.data.errorCode === 'SUCCESS') {
                    return response.data.data;
                }
                throw new Error(response.data.errorMessage);
            }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        axiosInstance.delete<BackendResponse<T>>(url, config)
            .then((response) => {
                if (response.data.errorCode === 'SUCCESS') {
                    return response.data.data;
                }
                throw new Error(response.data.errorMessage);
            }),
};

export default apiClient;