import apiClient from './apiClient';

/**
 * Fetch dashboard statistics for manager
 * @param params Report parameters
 * @returns Dashboard statistics data
 */
export const fetchDashboardStats = async (params: {
    period: 'week' | 'month' | 'quarter';
}) => {
    return apiClient.get('/manager/reports/dashboard', { params });
};

/**
 * Fetch repair reports with various metrics
 * @param params Report parameters
 * @returns Repair reports data
 */
export const fetchRepairReports = async (params: {
    from: string;
    to: string;
    type: 'REVENUE' | 'COMMON_ISSUES' | 'PARTS_USAGE' | 'STAFF_PERFORMANCE';
}) => {
    return apiClient.get('/manager/reports/repairs', { params });
};

/**
 * Fetch customer statistics and engagement metrics
 * @param params Report parameters
 * @returns Customer statistics data
 */
export const fetchCustomerReports = async (params: {
    period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
}) => {
    return apiClient.get('/manager/reports/customers', { params });
};

/**
 * Fetch inventory reports
 * @param params Report parameters
 * @returns Inventory reports data
 */
export const fetchInventoryReports = async (params: {
    from?: string;
    to?: string;
    category?: string;
}) => {
    return apiClient.get('/manager/reports/inventory', { params });
};

/**
 * Fetch financial reports
 * @param params Report parameters
 * @returns Financial reports data
 */
export const fetchFinancialReports = async (params: {
    from: string;
    to: string;
    groupBy: 'DAY' | 'WEEK' | 'MONTH';
}) => {
    return apiClient.get('/manager/reports/financial', { params });
};

/**
 * Fetch staff performance metrics
 * @param params Report parameters
 * @returns Staff performance data
 */
export const fetchStaffPerformance = async (params: {
    from?: string;
    to?: string;
    staffId?: number;
}) => {
    return apiClient.get('/manager/reports/staff-performance', { params });
};

/**
 * Fetch data for performance analytics dashboard
 * @param params Analytics parameters
 * @returns Analytics data
 */
export const fetchPerformanceAnalytics = async (params: {
    period: 'week' | 'month' | 'quarter';
}) => {
    return apiClient.get('/manager/analytics/performance', { params });
};

/**
 * Export a report as CSV or PDF
 * @param reportType Type of report to export
 * @param format Export format
 * @param params Report parameters
 * @returns Blob containing the exported file
 */
export const exportReport = async (
    reportType: string,
    format: 'csv' | 'pdf',
    params: {
        from?: string;
        to?: string;
        [key: string]: any;
    }
): Promise<Blob> => {
    return apiClient.get(`/manager/reports/${reportType}/export`, {
        params: {
            ...params,
            format
        },
        responseType: 'blob'
    });
};

/**
 * For customer: Fetch vehicle health history
 * @param vehicleId ID of the vehicle
 * @param params Optional parameters
 * @returns Vehicle health history data
 */
export const fetchVehicleHealthHistory = async (
    vehicleId: number,
    params?: {
        from?: string;
        to?: string;
    }
) => {
    return apiClient.get(`/vehicles/${vehicleId}/health/history`, { params });
};

/**
 * For staff: Fetch work efficiency metrics
 * @param params Optional parameters
 * @returns Work efficiency data
 */
export const fetchWorkEfficiency = async (params?: {
    from?: string;
    to?: string;
}) => {
    return apiClient.get('/staff/reports/efficiency', { params });
};