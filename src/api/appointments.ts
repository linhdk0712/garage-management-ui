import apiClient from './apiClient';
import { Appointment, AppointmentFormData, TimeSlot } from '../types/appointment.types';
import { PaginatedResponse } from '../types/response.types';

/**
 * Fetch appointments for a customer or staff member with pagination
 * @param apiUrl The API endpoint URL
 * @param params Optional filter parameters including pagination
 * @returns Paginated response of appointments
 */
export const fetchAppointments = async (apiUrl: string, params?: {
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}): Promise<PaginatedResponse<Appointment>> => {
    return await apiClient.get<PaginatedResponse<Appointment>>(apiUrl, { params });
};

/**
 * Fetch a specific appointment details
 * @param appointmentId ID of the appointment
 * @returns Appointment details
 */
export const fetchAppointmentDetails = async (apiUrl: string,appointmentId: number): Promise<Appointment> => {
    return await apiClient.get<Appointment>(apiUrl, { params: { appointmentId } });
};

/**
 * Schedule a new appointment
 * @param appointmentData Appointment form data
 * @returns Newly created appointment
 */
export const scheduleAppointment = async (apiUrl: string,appointmentData: AppointmentFormData): Promise<Appointment> => {
    return await apiClient.post<Appointment>(apiUrl, appointmentData);
};

/**
 * Update an existing appointment
 * @param appointmentId ID of the appointment to update
 * @param appointmentData Updated appointment data
 * @returns Updated appointment
 */
export const updateAppointment = async (apiUrl: string, data: AppointmentFormData): Promise<Appointment> => {
    return await apiClient.put<Appointment>(apiUrl, data);
};

/**
 * Cancel an appointment
 * @param appointmentId ID of the appointment to cancel
 * @returns Success message
 */
export const cancelAppointment = async (apiUrl: string,appointmentId: number): Promise<void> => {
    await apiClient.delete(apiUrl, { params: { appointmentId } });
};

/**
 * Get available appointment time slots for a specific date
 * @param date Date to check (YYYY-MM-DD)
 * @returns Array of available time slots
 */
export const fetchAvailableTimeSlots = async (apiUrl: string,date: string): Promise<TimeSlot[]> => {
    return await apiClient.get<TimeSlot[]>(apiUrl, { params: { date } });
};

/**
 * For staff: Fetch staff appointments with pagination
 * @param apiUrl The API endpoint URL
 * @param params Optional filter parameters including pagination
 * @returns Paginated response of appointments assigned to staff
 */
export const fetchStaffAppointments = async (apiUrl: string, params?: {
    status?: string;
    date?: string;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}): Promise<PaginatedResponse<Appointment>> => {
    return await apiClient.get<PaginatedResponse<Appointment>>(apiUrl, { params });
};

/**
 * For staff: Update appointment status
 * @param appointmentId ID of the appointment
 * @param data Updated status and optional estimated completion time
 * @returns Updated appointment
 */
export const updateAppointmentStatus = async (
    apiUrl: string,
    data: {
        appointmentId: number,
        status: string;
        estimatedCompletion?: string;
    }
): Promise<Appointment> => {
    return await apiClient.put<Appointment>(apiUrl, data);
};