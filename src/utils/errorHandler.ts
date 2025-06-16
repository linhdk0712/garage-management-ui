import { AxiosError } from 'axios';

export interface ValidationError {
  [field: string]: string;
}

export interface ApiErrorResponse {
  errorCode: string;
  errorMessage: string;
  data?: ValidationError;
}

export const extractValidationErrors = (error: AxiosError<ApiErrorResponse>): ValidationError => {
  if (error.response?.data?.data && typeof error.response.data.data === 'object') {
    return error.response.data.data as ValidationError;
  }
  
  // If no specific validation errors, return a generic error
  return {
    general: error.response?.data?.errorMessage || error.message || 'An error occurred'
  };
};

export const isValidationError = (error: AxiosError<ApiErrorResponse>): boolean => {
  return error.response?.status === 400 && error.response?.data?.errorCode === '400';
};

export const formatValidationErrors = (errors: ValidationError): string[] => {
  return Object.entries(errors).map(([field, message]) => {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
    return `${fieldName}: ${message}`;
  });
}; 