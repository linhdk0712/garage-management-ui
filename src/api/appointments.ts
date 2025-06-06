import apiClient from './apiClient';
import { Appointment, AppointmentFormData, TimeSlot } from '../types/appointment.types';


/**
 * Fetch appointments for a customer or staff member
 * @param params Optional filter parameters
 * @returns Array of appointments
 */
export const fetchAppointments = async (params?: {
    status?: string;
    from?: string;
    to?: string;
}): Promise<Appointment[]> => {
    return await apiClient.get<Appointment[]>('/appointments', { params });
};

/**
 * Fetch a specific appointment details
 * @param appointmentId ID of the appointment
 * @returns Appointment details
 */
export const fetchAppointmentDetails = async (appointmentId: number): Promise<Appointment> => {
    return await apiClient.get<Appointment>(`/appointments/${appointmentId}`);
};

/**
 * Schedule a new appointment
 * @param appointmentData Appointment form data
 * @returns Newly created appointment
 */
export const scheduleAppointment = async (appointmentData: AppointmentFormData): Promise<Appointment> => {
    return await apiClient.post<Appointment>('/appointments', appointmentData);
};

/**
 * Update an existing appointment
 * @param appointmentId ID of the appointment to update
 * @param appointmentData Updated appointment data
 * @returns Updated appointment
 */
export const updateAppointment = async (appointmentId: number, data: AppointmentFormData): Promise<Appointment> => {
    return await apiClient.put<Appointment>(`/appointments/${appointmentId}`, data);
};

/**
 * Cancel an appointment
 * @param appointmentId ID of the appointment to cancel
 * @returns Success message
 */
export const cancelAppointment = async (appointmentId: number): Promise<void> => {
    await apiClient.delete(`/appointments/${appointmentId}`);
};

/**
 * Get available appointment time slots for a specific date
 * @param date Date to check (YYYY-MM-DD)
 * @returns Array of available time slots
 */
export const fetchAvailableTimeSlots = async (date: string): Promise<TimeSlot[]> => {
    return await apiClient.get<TimeSlot[]>('/appointments/available', { params: { date } });
};

/**
 * For staff: Fetch staff appointments
 * @param params Optional filter parameters
 * @returns Array of appointments assigned to staff
 */
export const fetchStaffAppointments = async (params?: {
    status?: string;
    date?: string;
    from?: string;
    to?: string;
}): Promise<Appointment[]> => {
    return await apiClient.get<Appointment[]>('/staff/appointments', { params });
};

/**
 * For staff: Update appointment status
 * @param appointmentId ID of the appointment
 * @param data Updated status and optional estimated completion time
 * @returns Updated appointment
 */
export const updateAppointmentStatus = async (
    appointmentId: number,
    data: {
        status: string;
        estimatedCompletion?: string;
    }
): Promise<Appointment> => {
    return await apiClient.put<Appointment>(`/staff/appointments/${appointmentId}/status`, data);
};