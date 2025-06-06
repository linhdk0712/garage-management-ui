import apiClient from './apiClient';
import {
    WorkOrder,
    WorkOrderStatus,
    PartUsageInput,
    LaborChargeInput,
    WorkOrderNote
} from '../types/workOrder.types';

/**
 * Fetch work orders
 * @param params Optional filter parameters
 * @returns Array of work orders
 */
export const fetchWorkOrders = async (params?: {
    status?: string;
    from?: string;
    to?: string;
    vehicleId?: number;
    customerId?: number;
}): Promise<WorkOrder[]> => {
    return apiClient.get<WorkOrder[]>('/staff/work-orders', { params });
};

/**
 * Fetch details for a specific work order
 * @param workOrderId ID of the work order
 * @returns Work order details
 */
export const fetchWorkOrderDetails = async (workOrderId: number): Promise<WorkOrder> => {
    return apiClient.get<WorkOrder>(`/staff/work-orders/${workOrderId}`);
};

/**
 * Create a new work order
 * @param data Work order creation data
 * @returns Newly created work order
 */
export const createWorkOrder = async (data: {
    appointmentId: number;
    staffId: number;
    diagnosticNotes?: string;
}): Promise<WorkOrder> => {
    return apiClient.post<WorkOrder>('/staff/work-orders', data);
};

/**
 * Update work order status
 * @param workOrderId ID of the work order
 * @param status New status
 * @returns Updated work order
 */
export const updateWorkOrderStatus = async (
    workOrderId: number,
    status: WorkOrderStatus
): Promise<WorkOrder> => {
    return apiClient.put<WorkOrder>(`/staff/work-orders/${workOrderId}`, { status });
};

/**
 * Update work order details
 * @param workOrderId ID of the work order
 * @param data Updated work order data
 * @returns Updated work order
 */
export const updateWorkOrder = async (
    workOrderId: number,
    data: {
        status?: WorkOrderStatus;
        diagnosticNotes?: string;
        startTime?: string;
        endTime?: string;
    }
): Promise<WorkOrder> => {
    return apiClient.put<WorkOrder>(`/staff/work-orders/${workOrderId}`, data);
};

/**
 * Add parts to a work order
 * @param workOrderId ID of the work order
 * @param parts Array of parts to add
 * @returns Updated work order
 */
export const addPartsToWorkOrder = async (
    workOrderId: number,
    parts: PartUsageInput[]
): Promise<WorkOrder> => {
    return apiClient.post<WorkOrder>(`/staff/work-orders/${workOrderId}/parts`, { parts });
};

/**
 * Add labor charge to a work order
 * @param workOrderId ID of the work order
 * @param labor Labor charge data
 * @returns Updated work order
 */
export const addLaborCharge = async (
    workOrderId: number,
    labor: LaborChargeInput
): Promise<WorkOrder> => {
    return apiClient.post<WorkOrder>(`/staff/work-orders/${workOrderId}/labor`, labor);
};

/**
 * Add a note to a work order
 * @param workOrderId ID of the work order
 * @param note Note text
 * @returns Created note
 */
export const addWorkOrderNote = async (
    workOrderId: number,
    note: string
): Promise<WorkOrderNote> => {
    return apiClient.post<WorkOrderNote>(`/staff/work-orders/${workOrderId}/notes`, { note });
};

/**
 * Submit a digital inspection for a work order
 * @param inspectionData Inspection data including items, status, and images
 * @returns Updated work order
 */
export const submitInspection = async (inspectionData: any): Promise<WorkOrder> => {
    return apiClient.post<WorkOrder>(
        `/staff/work-orders/${inspectionData.workOrderId}/inspection`,
        inspectionData
    );
};

/**
 * Upload an inspection image
 * @param workOrderId ID of the work order
 * @param itemId ID of the inspection item
 * @param imageFile Image file to upload
 * @returns URL of the uploaded image
 */
export const uploadInspectionImage = async (
    workOrderId: number,
    itemId: string,
    imageFile: File
): Promise<string> => {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('itemId', itemId);

    const response = await apiClient.post<{ imageUrl: string }>(
        `/staff/work-orders/${workOrderId}/inspection/images`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.imageUrl;
};

/**
 * For customers: Submit feedback for a completed repair
 * @param workOrderId ID of the work order
 * @param feedback Feedback data
 * @returns Success message
 */
export const submitFeedback = async (
    workOrderId: number,
    feedback: {
        rating: number;
        comments: string;
    }
): Promise<{ feedbackId: number; message: string }> => {
    return apiClient.post<{ feedbackId: number; message: string }>(
        `/work-orders/${workOrderId}/feedback`,
        feedback
    );
};