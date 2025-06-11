import { useState, useEffect, useCallback } from 'react';
import {
    fetchWorkOrders,
    fetchWorkOrderDetails,
    createWorkOrder,
    updateWorkOrderStatus,
    addPartsToWorkOrder,
    addLaborCharge,
    addWorkOrderNote
} from '../api/workOrders';
import {
    WorkOrder,
    WorkOrderStatus,
    PartUsageInput,
    LaborChargeInput
} from '../types/workOrder.types';

interface UseWorkOrdersOptions {
    initialFetch?: boolean;
    filters?: {
        status?: string;
        from?: string;
        to?: string;
        vehicleId?: number;
        customerId?: number;
    };
}

/**
 * Custom hook for managing work orders
 * @param options Hook configuration options
 * @returns Work orders state and methods
 */
const useWorkOrders = (options: UseWorkOrdersOptions = {}) => {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { initialFetch = true, filters = {} } = options;

    // Fetch all work orders
    const fetchAllWorkOrders = useCallback(async (customFilters?: typeof filters) => {
        try {
            setIsLoading(true);
            setError(null);
            const queryFilters = customFilters || filters;
            const data = await fetchWorkOrders(queryFilters);
            setWorkOrders(data);
            return data;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch work orders');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Fetch a single work order
    const fetchWorkOrder = useCallback(async (workOrderId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchWorkOrderDetails(workOrderId);
            setSelectedWorkOrder(data);
            return data;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch work order details');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create a new work order
    const addWorkOrder = useCallback(async (appointmentId: number, staffId: number, diagnosticNotes?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const newWorkOrder = await createWorkOrder({
                appointmentId,
                staffId,
                diagnosticNotes,
            });
            setWorkOrders((prev) => [...prev, newWorkOrder]);
            return newWorkOrder;
        } catch (err: any) {
            setError(err.message || 'Failed to create work order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update work order status
    const updateStatus = useCallback(async (workOrderId: number, status: WorkOrderStatus) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedWorkOrder = await updateWorkOrderStatus(workOrderId, status);
            setWorkOrders((prev) =>
                prev.map((order) =>
                    order.workOrderId === workOrderId ? updatedWorkOrder : order
                )
            );
            if (selectedWorkOrder?.workOrderId === workOrderId) {
                setSelectedWorkOrder(updatedWorkOrder);
            }
            return updatedWorkOrder;
        } catch (err: any) {
            setError(err.message || 'Failed to update work order status');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedWorkOrder]);

    // Add parts to work order
    const addParts = useCallback(async (workOrderId: number, parts: PartUsageInput[]) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedWorkOrder = await addPartsToWorkOrder(workOrderId, parts);
            setWorkOrders((prev) =>
                prev.map((order) =>
                    order.workOrderId === workOrderId ? updatedWorkOrder : order
                )
            );
            if (selectedWorkOrder?.workOrderId === workOrderId) {
                setSelectedWorkOrder(updatedWorkOrder);
            }
            return updatedWorkOrder;
        } catch (err: any) {
            setError(err.message || 'Failed to add parts to work order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedWorkOrder]);

    // Add labor charge to work order
    const addLabor = useCallback(async (workOrderId: number, labor: LaborChargeInput) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedWorkOrder = await addLaborCharge(workOrderId, labor);
            setWorkOrders((prev) =>
                prev.map((order) =>
                    order.workOrderId === workOrderId ? updatedWorkOrder : order
                )
            );
            if (selectedWorkOrder?.workOrderId === workOrderId) {
                setSelectedWorkOrder(updatedWorkOrder);
            }
            return updatedWorkOrder;
        } catch (err: any) {
            setError(err.message || 'Failed to add labor charge to work order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedWorkOrder]);

    // Add note to work order
    const addNote = useCallback(async (workOrderId: number, noteText: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const note = await addWorkOrderNote(workOrderId, noteText);

            // Update the selected work order with the new note
            if (selectedWorkOrder?.workOrderId === workOrderId) {
                setSelectedWorkOrder((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        notes: [...prev.notes, note],
                    };
                });
            }

            return note;
        } catch (err: any) {
            setError(err.message || 'Failed to add note to work order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedWorkOrder]);

    // Select a work order
    const selectWorkOrder = useCallback((workOrderId: number | null) => {
        if (workOrderId === null) {
            setSelectedWorkOrder(null);
            return;
        }

        const workOrder = workOrders.find((wo) => wo.workOrderId === workOrderId);
        setSelectedWorkOrder(workOrder || null);
    }, [workOrders]);

    // Calculate total parts cost for a work order
    const calculatePartsCost = useCallback((workOrderId: number) => {
        const workOrder = workOrders.find((wo) => wo.workOrderId === workOrderId);
        if (!workOrder) return 0;

        return workOrder.partsUsed.reduce((sum, part) => sum + part.totalPrice, 0);
    }, [workOrders]);

    // Calculate total labor cost for a work order
    const calculateLaborCost = useCallback((workOrderId: number) => {
        const workOrder = workOrders.find((wo) => wo.workOrderId === workOrderId);
        if (!workOrder) return 0;

        return workOrder.laborCharges.reduce((sum, labor) => sum + labor.totalCharge, 0);
    }, [workOrders]);

    // Calculate total cost for a work order
    const calculateTotalCost = useCallback((workOrderId: number) => {
        return calculatePartsCost(workOrderId) + calculateLaborCost(workOrderId);
    }, [calculatePartsCost, calculateLaborCost]);

    // Initial fetch
    useEffect(() => {
        if (initialFetch) {
            fetchAllWorkOrders();
        }
    }, [fetchAllWorkOrders, initialFetch]);

    return {
        workOrders,
        selectedWorkOrder,
        isLoading,
        error,
        fetchAllWorkOrders,
        fetchWorkOrder,
        addWorkOrder,
        updateStatus,
        addParts,
        addLabor,
        addNote,
        selectWorkOrder,
        calculatePartsCost,
        calculateLaborCost,
        calculateTotalCost,
    };
};

export default useWorkOrders;