import { useState, useEffect, useCallback } from 'react';
import {
    fetchSpareParts,
    fetchPartDetails,
    addSparePart,
    updateSparePart,
    fetchLowStockItems,
    createPurchaseOrder
} from '../api/inventory';
import {
    SparePart,
    SparePartFormData,
    PurchaseOrderInput
} from '../types/inventory.types';

interface UseInventoryOptions {
    initialFetch?: boolean;
    filters?: {
        category?: string;
        search?: string;
        stockStatus?: string;
    };
}

/**
 * Custom hook for managing inventory
 * @param options Hook configuration options
 * @returns Inventory state and methods
 */
const useInventory = (options: UseInventoryOptions = {}) => {
    const [parts, setParts] = useState<SparePart[]>([]);
    const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);
    const [lowStockItems, setLowStockItems] = useState<SparePart[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { initialFetch = true, filters = {} } = options;

    // Fetch all parts
    const fetchAllParts = useCallback(async (customFilters?: typeof filters) => {
        try {
            setIsLoading(true);
            setError(null);
            const queryFilters = customFilters || filters;
            const data = await fetchSpareParts(queryFilters);
            const partsArray = data.data.content || [];
            setParts(partsArray);
            return partsArray;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch inventory parts');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Fetch a single part
    const fetchPart = useCallback(async (partId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchPartDetails(partId);
            setSelectedPart(data);
            return data;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch part details');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create a new part
    const createPart = useCallback(async (partData: SparePartFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            const newPart = await addSparePart(partData);
            setParts((prev) => [...prev, newPart]);
            return newPart;
        } catch (err: any) {
            setError(err.message || 'Failed to add part');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update a part
    const editPart = useCallback(async (partId: number, partData: Partial<SparePartFormData>) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedPart = await updateSparePart(partId, partData);
            setParts((prev) =>
                prev.map((part) =>
                    part.partId === partId ? updatedPart : part
                )
            );
            if (selectedPart?.partId === partId) {
                setSelectedPart(updatedPart);
            }
            return updatedPart;
        } catch (err: any) {
            setError(err.message || 'Failed to update part');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedPart]);

    // Fetch low stock items
    const fetchLowStock = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchLowStockItems();
            const lowStockArray = data.data.content || [];
            setLowStockItems(lowStockArray);
            return lowStockArray;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch low stock items');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create a purchase order
    const createOrder = useCallback(async (orderData: PurchaseOrderInput) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await createPurchaseOrder(orderData);

            // Refresh parts list to reflect updated quantities
            await fetchAllParts();
            await fetchLowStock();

            return result;
        } catch (err: any) {
            setError(err.message || 'Failed to create purchase order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchAllParts, fetchLowStock]);

    // Select a part
    const selectPart = useCallback((partId: number | null) => {
        if (partId === null) {
            setSelectedPart(null);
            return;
        }

        const part = parts.find((p) => p.partId === partId);
        setSelectedPart(part || null);
    }, [parts]);

    // Check if a part is low in stock
    const isLowStock = useCallback((part: SparePart) => {
        return part.quantityInStock <= part.minimumStockLevel;
    }, []);

    // Get stock status text
    const getStockStatus = useCallback((part: SparePart) => {
        if (part.quantityInStock <= part.minimumStockLevel) {
            return 'LOW';
        } else if (part.quantityInStock <= part.minimumStockLevel * 2) {
            return 'MODERATE';
        } else {
            return 'ADEQUATE';
        }
    }, []);

    // Calculate the reorder quantity for a part
    const calculateReorderQuantity = useCallback((part: SparePart) => {
        // A simple reorder strategy: bring the stock up to twice the minimum level
        return Math.max(0, (part.minimumStockLevel * 2) - part.quantityInStock);
    }, []);

    // Initial fetch
    useEffect(() => {
        if (initialFetch) {
            fetchAllParts();
            fetchLowStock();
        }
    }, [fetchAllParts, fetchLowStock, initialFetch]);

    return {
        parts,
        selectedPart,
        lowStockItems,
        isLoading,
        error,
        fetchAllParts,
        fetchPart,
        createPart,
        editPart,
        fetchLowStock,
        createOrder,
        selectPart,
        isLowStock,
        getStockStatus,
        calculateReorderQuantity,
    };
};

export default useInventory;