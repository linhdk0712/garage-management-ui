import apiClient from './apiClient';
import { Payment, PaymentInput } from '../types/payment.types';

/**
 * Process a payment for a work order
 * @param paymentData Payment data
 * @returns Payment information
 */
export const processPayment = async (paymentData: PaymentInput): Promise<Payment> => {
    return apiClient.post<Payment>('/payments', paymentData);
};

/**
 * Get payment history for the current customer
 * @returns Array of payment records
 */
export const getPaymentHistory = async (): Promise<Payment[]> => {
    return apiClient.get<Payment[]>('/payments/history');
};

/**
 * Fetch details for a specific payment
 * @param paymentId ID of the payment
 * @returns Payment details
 */
export const fetchPaymentDetails = async (paymentId: number): Promise<Payment> => {
    return apiClient.get<Payment>(`/payments/${paymentId}`);
};

/**
 * Get receipt for a payment
 * @param paymentId ID of the payment
 * @returns Receipt data in PDF format (blob)
 */
export const getPaymentReceipt = async (paymentId: number): Promise<Blob> => {
    return apiClient.get<Blob>(`/payments/${paymentId}/receipt`, {
        responseType: 'blob'
    });
};

/**
 * For manager: Fetch all payments
 * @param params Optional filter parameters
 * @returns Array of payments
 */
export const fetchAllPayments = async (params?: {
    from?: string;
    to?: string;
    customerId?: number;
    status?: string;
    paymentMethod?: string;
}): Promise<Payment[]> => {
    return apiClient.get<Payment[]>('/manager/payments', { params });
};

/**
 * For manager: Refund a payment
 * @param paymentId ID of the payment
 * @param refundData Refund information
 * @returns Updated payment with refund info
 */
export const refundPayment = async (
    paymentId: number,
    refundData: {
        amount: number;
        reason: string;
    }
): Promise<Payment> => {
    return apiClient.post<Payment>(`/manager/payments/${paymentId}/refund`, refundData);
};