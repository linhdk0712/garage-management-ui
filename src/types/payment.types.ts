export interface Payment {
    paymentId: number;
    workOrderId: number;
    vehicleInfo: {
        make: string;
        model: string;
        licensePlate: string;
    };
    serviceType: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CHECK';
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
    notes?: string;
    refunds?: PaymentRefund[];
}

export interface PaymentInput {
    workOrderId: number;
    amount: number;
    paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CHECK';
    cardDetails?: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
        nameOnCard: string;
    };
    notes?: string;
}

export interface PaymentRefund {
    refundId: number;
    paymentId: number;
    amount: number;
    reason: string;
    refundDate: string;
    processedBy: {
        staffId: number;
        firstName: string;
        lastName: string;
    };
}

export interface Invoice {
    invoiceId: number;
    workOrderId: number;
    customerId: number;
    customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    vehicleInfo: {
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        vin?: string;
    };
    serviceInfo: {
        serviceType: string;
        description?: string;
        completionDate: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    amountPaid: number;
    amountDue: number;
    status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    dueDate: string;
    issueDate: string;
    notes?: string;
}

export interface InvoiceItem {
    itemId: number;
    invoiceId: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    itemType: 'PART' | 'LABOR' | 'SERVICE' | 'OTHER';
}

export interface PaymentStatistics {
    totalRevenue: number;
    paymentMethodDistribution: {
        method: string;
        count: number;
        amount: number;
        percentage: number;
    }[];
    revenueByService: {
        serviceType: string;
        amount: number;
        percentage: number;
    }[];
    outstandingInvoices: {
        count: number;
        amount: number;
    };
    averageTicketValue: number;
    revenueByPeriod: {
        period: string;
        amount: number;
    }[];
}