export interface SparePart {
    partId: number;
    name: string;
    description: string;
    category: string;
    price: number;
    cost: number;
    quantityInStock: number;
    minimumStockLevel: number;
    stockStatus: 'LOW' | 'MODERATE' | 'ADEQUATE';
    location?: string;
    supplier?: string;
    partNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SparePartFormData {
    name: string;
    description: string;
    category: string;
    price: number;
    cost: number;
    quantityInStock: number;
    minimumStockLevel: number;
    location?: string;
    supplier?: string;
    partNumber?: string;
}

export interface PurchaseOrder {
    purchaseOrderId: number;
    supplierName: string;
    orderDate: string;
    expectedDeliveryDate?: string;
    status: 'PENDING' | 'ORDERED' | 'PARTIAL' | 'DELIVERED' | 'CANCELLED';
    totalAmount: number;
    notes?: string;
    createdBy: {
        staffId: number;
        firstName: string;
        lastName: string;
    };
    items: PurchaseOrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface PurchaseOrderItem {
    itemId: number;
    purchaseOrderId: number;
    partId: number;
    partName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    quantityReceived?: number;
    receivedDate?: string;
}

export interface PurchaseOrderInput {
    supplierName: string;
    expectedDeliveryDate?: string;
    notes?: string;
    items: {
        partId: number;
        quantity: number;
        unitPrice: number;
    }[];
}

export interface InventoryAdjustment {
    adjustmentId: number;
    partId: number;
    partName: string;
    quantityBefore: number;
    quantityAfter: number;
    adjustmentType: 'STOCK_TAKE' | 'DAMAGED' | 'RETURNED' | 'OTHER';
    reason: string;
    performedBy: {
        staffId: number;
        firstName: string;
        lastName: string;
    };
    adjustmentDate: string;
}

export interface InventoryStatistics {
    totalParts: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    fastMovingParts: {
        partId: number;
        name: string;
        usageRate: number; // Units per month
    }[];
    slowMovingParts: {
        partId: number;
        name: string;
        lastUsed?: string;
        daysInStock: number;
    }[];
    categoryDistribution: {
        category: string;
        count: number;
        value: number;
    }[];
}