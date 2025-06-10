import { Vehicle } from './vehicle.types';

export interface Appointment {
    appointmentId: number;
    vehicle?: Vehicle;
    serviceType: string;
    description: string;
    appointmentDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    estimatedDuration?: number;
    estimatedCost?: number;
    notes?: string;
}

export interface AppointmentFormData {
    vehicleId: number;
    serviceType: string;
    description: string;
    appointmentDate: string;
    estimatedDuration: number;
    estimatedCost: number;
    notes?: string;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
}

export interface AppointmentStatistics {
    daily: {
        pending: number;
        confirmed: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        total: number;
    };
    weekly: {
        pending: number;
        confirmed: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        total: number;
    };
    monthly: {
        pending: number;
        confirmed: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        total: number;
    };
    averageCompletionTime: number;
    popularTimeSlots: {
        day: string;
        hour: number;
        count: number;
    }[];
    popularServices: {
        serviceType: string;
        count: number;
    }[];
}