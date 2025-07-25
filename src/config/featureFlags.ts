export interface FeatureFlags {
    enableVehicleManagement: boolean;
    enableAppointments: boolean;
    enableRepairHistory: boolean;
    enableHealthDashboard: boolean;
    enablePayments: boolean;
    enableNotifications: boolean;
    enableMaintenanceGuide: boolean;
    enableWorkOrders: boolean;
    enableCustomerManagement: boolean;
    enableInventory: boolean;
    enablePurchaseOrders: boolean;
    enableStaffManagement: boolean;
    enableReports: boolean;
}

// Default feature flags configuration
export const defaultFeatureFlags: FeatureFlags = {
    enableVehicleManagement: true,
    enableAppointments: true,
    enableRepairHistory: true,
    enableHealthDashboard: true,
    enablePayments: false, // Example of a disabled feature
    enableNotifications: false,
    enableMaintenanceGuide: false,
    enableWorkOrders: false,
    enableCustomerManagement: true,
    enableInventory: false,
    enablePurchaseOrders: false,
    enableStaffManagement: true,
    enableReports: false,
};

// Feature flag context type
export interface FeatureFlagContextType {
    flags: FeatureFlags;
    isEnabled: (feature: keyof FeatureFlags) => boolean;
    updateFlags: (newFlags: Partial<FeatureFlags>) => void;
} 