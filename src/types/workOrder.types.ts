import { Inspection } from './vehicle.types';

export type WorkOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';

export interface WorkOrder {
    workOrderId: number;
    appointmentId: number;
    appointment: {
        appointmentDate: string;
        serviceType: string;
        status: string;
    };
    customer: {
        customerId: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    vehicle: {
        vehicleId: number;
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        vin?: string;
        color?: string;
        mileage: number;
    };
    assignedStaff: {
        staffId: number;
        firstName: string;
        lastName: string;
        position: string;
    };
    startTime?: string;
    endTime?: string;
    status: WorkOrderStatus;
    diagnosticNotes?: string;
    totalCost: number;
    partsUsed: PartUsage[];
    laborCharges: LaborCharge[];
    notes: WorkOrderNote[];
    inspection?: Inspection;
    createdAt: string;
    updatedAt: string;
}

export interface PartUsage {
    partUsageId: number;
    partId: number;
    partName: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    usedAt: string;
}

export interface PartUsageInput {
    partId: number;
    quantity: number;
}

export interface LaborCharge {
    laborChargeId: number;
    staffId: number;
    staffName: string;
    hoursWorked: number;
    ratePerHour: number;
    totalCharge: number;
    description: string;
    recordedAt: string;
}

export interface LaborChargeInput {
    staffId: number;
    hoursWorked: number;
    description: string;
}

export interface WorkOrderNote {
    noteId: number;
    workOrderId: number;
    staffId: number;
    staffName: string;
    note: string;
    createdAt: string;
}

export interface WorkOrderSummary {
    workOrderId: number;
    appointmentId: number;
    vehicleInfo: {
        make: string;
        model: string;
        licensePlate: string;
    };
    customerName: string;
    serviceType: string;
    status: WorkOrderStatus;
    startTime?: string;
    endTime?: string;
    totalCost: number;
}

export interface WorkOrderStatistics {
    totalWorkOrders: number;
    averageCompletionTime: number;
    statusDistribution: {
        pending: number;
        inProgress: number;
        onHold: number;
        completed: number;
    };
    revenueGenerated: number;
    totalLaborHours: number;
    mostUsedParts: {
        partName: string;
        usageCount: number;
    }[];
    mostCommonServices: {
        serviceType: string;
        count: number;
    }[];
}