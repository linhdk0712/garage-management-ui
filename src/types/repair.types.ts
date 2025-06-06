import { Vehicle } from './vehicle.types';

export interface RepairHistory {
    repairId: number;
    vehicle: Vehicle;
    serviceType: string;
    description: string;
    repairDate: string;
    completionDate?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    duration: number;
    laborCost: number;
    partsCost: number;
    totalCost: number;
    notes?: string;
} 