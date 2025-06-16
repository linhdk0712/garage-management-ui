import { z } from 'zod';

// Base validation patterns
const phoneRegex = /^[+]?[0-9\s\-\(\)]+$/;
const zipCodeRegex = /^[0-9A-Za-z\s\-]+$/;
const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

// Login validation
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(50, 'Username must not exceed 50 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .max(255, 'Password must not exceed 255 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration validation
export const registerSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(50, 'Username must not exceed 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Email should be valid')
    .max(100, 'Email must not exceed 100 characters'),
  phone: z.string()
    .max(20, 'Phone must not exceed 20 characters')
    .regex(phoneRegex, 'Phone number should contain only digits, spaces, hyphens, and parentheses')
    .optional(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password must not exceed 255 characters'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters'),
  address: z.string()
    .max(255, 'Address must not exceed 255 characters')
    .optional(),
  city: z.string()
    .max(50, 'City must not exceed 50 characters')
    .optional(),
  state: z.string()
    .max(50, 'State must not exceed 50 characters')
    .optional(),
  zipCode: z.string()
    .max(20, 'Zip code must not exceed 20 characters')
    .regex(zipCodeRegex, 'Zip code should contain only letters, digits, spaces, and hyphens')
    .optional(),
  preferredContactMethod: z.string()
    .max(20, 'Preferred contact method must not exceed 20 characters')
    .optional(),
  roles: z.array(z.string())
    .min(1, 'At least one role is required'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Vehicle validation
export const vehicleSchema = z.object({
  vehicleId: z.number().optional(),
  make: z.string()
    .min(1, 'Make is required')
    .max(50, 'Make must not exceed 50 characters'),
  model: z.string()
    .min(1, 'Model is required')
    .max(50, 'Model must not exceed 50 characters'),
  year: z.number()
    .min(1900, 'Year must be at least 1900')
    .max(2030, 'Year must not exceed 2030'),
  licensePlate: z.string()
    .min(1, 'License plate is required')
    .max(20, 'License plate must not exceed 20 characters'),
  vin: z.string()
    .max(17, 'VIN must not exceed 17 characters')
    .regex(vinRegex, 'VIN must be exactly 17 alphanumeric characters (excluding I, O, Q)')
    .optional()
    .or(z.literal('')),
  color: z.string()
    .max(30, 'Color must not exceed 30 characters')
    .optional()
    .or(z.literal('')),
  mileage: z.number()
    .min(0, 'Mileage must be non-negative'),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

// Appointment validation
export const appointmentSchema = z.object({
  appointmentId: z.number().optional(),
  vehicleId: z.number()
    .min(1, 'Vehicle is required'),
  serviceType: z.string()
    .min(1, 'Service type is required')
    .max(100, 'Service type must not exceed 100 characters'),
  description: z.string()
    .min(1, 'Description is required'),
  appointmentDate: z.string()
    .min(1, 'Appointment date is required')
    .refine((date) => {
      const appointmentDate = new Date(date);
      const now = new Date();
      return appointmentDate > now;
    }, 'Appointment date must be in the future'),
  estimatedDuration: z.number()
    .min(0.5, 'Estimated duration must be at least 0.5 hours'),
  estimatedCost: z.number()
    .min(0, 'Estimated cost must be non-negative'),
  notes: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Staff validation
export const staffSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(50, 'Username must not exceed 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Email should be valid')
    .max(100, 'Email must not exceed 100 characters'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone must not exceed 20 characters')
    .regex(phoneRegex, 'Phone number should contain only digits, spaces, hyphens, and parentheses'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password must not exceed 255 characters'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters'),
  address: z.string()
    .min(1, 'Address is required')
    .max(255, 'Address must not exceed 255 characters'),
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City must not exceed 50 characters'),
  state: z.string()
    .min(1, 'State is required')
    .max(50, 'State must not exceed 50 characters'),
  zipCode: z.string()
    .min(1, 'Zip code is required')
    .max(20, 'Zip code must not exceed 20 characters')
    .regex(zipCodeRegex, 'Zip code should contain only letters, digits, spaces, and hyphens'),
  preferredContactMethod: z.enum(['EMAIL', 'PHONE', 'SMS']),
  position: z.string()
    .min(1, 'Position is required')
    .max(50, 'Position must not exceed 50 characters'),
  specialization: z.string()
    .min(1, 'Specialization is required')
    .max(100, 'Specialization must not exceed 100 characters'),
  hireDate: z.string()
    .min(1, 'Hire date is required')
    .refine((date) => {
      const hireDate = new Date(date);
      const now = new Date();
      return hireDate <= now;
    }, 'Hire date must be in the past or present'),
  hourlyRate: z.number()
    .min(0.01, 'Hourly rate must be greater than 0'),
});

export type StaffFormData = z.infer<typeof staffSchema>;

// Work Order validation
export const workOrderSchema = z.object({
  id: z.number().optional(),
  appointmentId: z.number()
    .min(1, 'Appointment ID is required'),
  staffId: z.number()
    .min(1, 'Staff ID is required'),
  startTime: z.string()
    .min(1, 'Start time is required'),
  endTime: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  diagnosticNotes: z.string().optional(),
  totalCost: z.number()
    .min(0, 'Total cost must be non-negative'),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;

// Token refresh validation
export const tokenRefreshSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token is required'),
});

export type TokenRefreshFormData = z.infer<typeof tokenRefreshSchema>;

// Customer profile validation
export const customerProfileSchema = z.object({
  id: z.number().optional(),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters'),
  address: z.string()
    .max(255, 'Address must not exceed 255 characters')
    .optional(),
  city: z.string()
    .max(50, 'City must not exceed 50 characters')
    .optional(),
  state: z.string()
    .max(50, 'State must not exceed 50 characters')
    .optional(),
  zipCode: z.string()
    .max(20, 'Zip code must not exceed 20 characters')
    .regex(zipCodeRegex, 'Zip code should contain only letters, digits, spaces, and hyphens')
    .optional(),
  preferredContactMethod: z.string()
    .max(20, 'Preferred contact method must not exceed 20 characters')
    .optional(),
  notes: z.string().optional(),
});

export type CustomerProfileFormData = z.infer<typeof customerProfileSchema>; 