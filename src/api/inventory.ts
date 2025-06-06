import apiClient from './apiClient';
import {
    SparePart,
    SparePartFormData,
    PurchaseOrder,
    PurchaseOrderInput
} from '../types/inventory.types';

/**
 * Fetch spare parts inventory
 * @param params Optional filter parameters
 * @returns Array of spare parts
 */
export const fetchSpareParts = async (params?: {
    category?: string;
    search?: string;
    stockStatus?: string;
}): Promise<SparePart[]> => {
    return apiClient.get<SparePart[]>('/inventory/parts', { params });
};

/**
 * Fetch details for a specific spare part
 * @param partId ID of the spare part
 * @returns Spare part details
 */
export const fetchPartDetails = async (partId: number): Promise<SparePart> => {
    return apiClient.get<SparePart>(`/inventory/parts/${partId}`);
};

/**
 * Add a new spare part to inventory
 * @param partData Spare part form data
 * @returns Newly created spare part
 */
export const addSparePart = async (partData: SparePartFormData): Promise<SparePart> => {
    return apiClient.post<SparePart>('/inventory/parts', partData);
};

/**
 * Update a spare part's information
 * @param partId ID of the spare part to update
 * @param partData Updated spare part data
 * @returns Updated spare part
 */
export const updateSparePart = async (
    partId: number,
    partData: Partial<SparePartFormData>
): Promise<SparePart> => {
    return apiClient.put<SparePart>(`/inventory/parts/${partId}`, partData);
};

/**
 * Fetch items that are below minimum stock level
 * @returns Array of spare parts with low stock
 */
export const fetchLowStockItems = async (): Promise<SparePart[]> => {
    return apiClient.get<SparePart[]>('/inventory/low-stock');
};

/**
 * Create a purchase order for spare parts
 * @param orderData Purchase order data
 * @returns Created purchase order
 */
export const createPurchaseOrder = async (orderData: PurchaseOrderInput): Promise<PurchaseOrder> => {
    return apiClient.post<PurchaseOrder>('/manager/purchase-orders', orderData);
};

/**
 * Fetch purchase orders
 * @param params Optional filter parameters
 * @returns Array of purchase orders
 */
export const fetchPurchaseOrders = async (params?: {
    status?: string;
    from?: string;
    to?: string;
    supplier?: string;
}): Promise<PurchaseOrder[]> => {
    return apiClient.get<PurchaseOrder[]>('/manager/purchase-orders', { params });
};

/**
 * Fetch details for a specific purchase order
 * @param purchaseOrderId ID of the purchase order
 * @returns Purchase order details
 */
export const fetchPurchaseOrderDetails = async (purchaseOrderId: number): Promise<PurchaseOrder> => {
    return apiClient.get<PurchaseOrder>(`/manager/purchase-orders/${purchaseOrderId}`);
};

/**
 * Update purchase order status
 * @param purchaseOrderId ID of the purchase order
 * @param status New status
 * @returns Updated purchase order
 */
export const updatePurchaseOrderStatus = async (
    purchaseOrderId: number,
    status: string
): Promise<PurchaseOrder> => {
    return apiClient.put<PurchaseOrder>(
        `/manager/purchase-orders/${purchaseOrderId}/status`,
        { status }
    );
};

/**
 * Receive items from a purchase order
 * @param purchaseOrderId ID of the purchase order
 * @param receivedItems Items that were received
 * @returns Updated purchase order
 */
export const receiveOrderItems = async (
    purchaseOrderId: number,
    receivedItems: {
        itemId: number;
        quantityReceived: number;
    }[]
): Promise<PurchaseOrder> => {
    return apiClient.post<PurchaseOrder>(
        `/manager/purchase-orders/${purchaseOrderId}/receive`,
        { receivedItems }
    );
};