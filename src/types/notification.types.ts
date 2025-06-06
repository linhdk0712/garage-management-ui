export interface Notification {
    notificationId: number;
    userId: number;
    title: string;
    message: string;
    type: 'APPOINTMENT_REMINDER' | 'WORK_ORDER_UPDATE' | 'PAYMENT_DUE' | 'MAINTENANCE_REMINDER' | 'SERVICE_COMPLETED' | 'SYSTEM';
    isRead: boolean;
    createdAt: string;
    expiresAt?: string;
    url?: string;
    metadata?: Record<string, any>;
}

export interface NotificationSettings {
    appointmentReminders: boolean;
    workOrderUpdates: boolean;
    paymentReminders: boolean;
    maintenanceReminders: boolean;
    marketingUpdates: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
}

export interface NotificationTemplate {
    templateId: number;
    name: string;
    type: string;
    subject: string;
    messageBody: string;
    isActive: boolean;
}