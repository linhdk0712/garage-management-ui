export type ContactMethod = 'EMAIL' | 'PHONE' | 'SMS';

export interface StaffProfile {
    staffId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    position: string;
    department: string;
    hireDate: string;
    memberSince: string;
} 
export interface Staff {
    staffId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    position: string;
    department: string;
    hireDate: string;
    memberSince: string;
    username: string;
    preferredContactMethod: ContactMethod;
    specialization: string;
    hourlyRate: number;
    employmentStatus: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
    managerId?: number;
    isActive: boolean;
    lastLoginDate?: string;
    createdAt: string;
    updatedAt: string;
} 

export interface CreateStaffFormData {
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
    preferredContactMethod: ContactMethod;
    position: string;
    specialization: string;
    hireDate: string;
    hourlyRate: number;
}

export interface StaffAccount {
    staffId: number;
    username: string;
    email: string;
    phone: string;
    preferredContactMethod: ContactMethod;
    isActive: boolean;
    lastLoginDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface StaffEmployment {
    staffId: number;
    position: string;
    specialization: string;
    department: string;
    hireDate: string;
    hourlyRate: number;
    employmentStatus: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
    managerId?: number;
} 