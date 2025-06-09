export interface Vehicle {
    vehicleId: number;
    customerId: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    color?: string;
    mileage: number;
    lastServiceDate?: string;
    registrationDate: string;
}

export interface VehicleWithCustomer extends Vehicle {
    customer: {
        customerId: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}

export interface VehicleFormData {
    vehicleId?: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    color?: string;
    mileage: number;
}

export interface HealthData {
    engine: {
        score: number;
        notes?: string;
    };
    transmission: {
        score: number;
        notes?: string;
    };
    brakes: {
        score: number;
        notes?: string;
    };
    suspension: {
        score: number;
        notes?: string;
    };
    electrical: {
        score: number;
        notes?: string;
    };
    componentsStatus: {
        good: number;
        fair: number;
        poor: number;
    };
    trending: 'up' | 'down' | 'stable';
    changeSinceLastService: number;
    historyData: {
        date: string;
        score: number;
    }[];
}

export interface MaintenanceItem {
    id: number;
    description: string;
    dueDate: string;
    mileage?: number;
    status: 'UPCOMING' | 'OVERDUE' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    notes?: string;
}

export interface InspectionItem {
    id: string;
    name: string;
    status: 'good' | 'fair' | 'poor' | 'not_inspected';
    notes: string;
    images: string[];
}

export interface Inspection {
    inspectionId: number;
    workOrderId: number;
    inspectionDate: string;
    items: InspectionItem[];
}

export interface RepairRecord {
    repairId: number;
    workOrderId: number;
    vehicleId: number;
    serviceType: string;
    datePerformed: string;
    cost: number;
    notes?: string;
    partsReplaced: {
        partName: string;
        quantity: number;
        cost: number;
    }[];
    laborHours: number;
    laborCost: number;
    technician: string;
    feedback?: {
        rating: number;
        comments?: string;
    };
}