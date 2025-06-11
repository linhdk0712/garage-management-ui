import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, AlertTriangle, Truck, Download, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { fetchSpareParts, createPurchaseOrder } from '../../api/inventory';
import { SparePart } from '../../types/inventory.types';

const InventoryManagement: React.FC = () => {
    const [parts, setParts] = useState<SparePart[]>([]);
    const [filteredParts, setFilteredParts] = useState<SparePart[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [category, setCategory] = useState<string>('all');
    const [stockStatus, setStockStatus] = useState<string>('all');
    const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
    const [selectedParts, setSelectedParts] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [showCreatePOModal, setShowCreatePOModal] = useState<boolean>(false);
    const [isCreatingPO, setIsCreatingPO] = useState<boolean>(false);
    const [poData, setPOData] = useState({
        supplierName: '',
        expectedDeliveryDate: '',
        notes: ''
    });

    // Fetch inventory data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchSpareParts();
                const partsArray = data.data.content || [];
                setParts(partsArray);
                setFilteredParts(partsArray);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter and sort parts
    useEffect(() => {
        let result = [...parts];

        // Apply category filter
        if (category !== 'all') {
            result = result.filter(part => part.category === category);
        }

        // Apply stock status filter
        if (stockStatus !== 'all') {
            result = result.filter(part => part.stockStatus === stockStatus);
        }

        // Apply low stock filter
        if (showLowStockOnly) {
            result = result.filter(part => part.quantityInStock <= part.minimumStockLevel);
        }

        // Apply search filter
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(part =>
                part.name.toLowerCase().includes(lowerSearchTerm) ||
                part.description.toLowerCase().includes(lowerSearchTerm) ||
                part.category.toLowerCase().includes(lowerSearchTerm) ||
                (part.supplier?.toLowerCase() ?? '').includes(lowerSearchTerm)
            );
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key];
                const bValue = (b as any)[sortConfig.key];
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredParts(result);
    }, [parts, category, stockStatus, showLowStockOnly, searchTerm, sortConfig]);

    // Get unique categories for filter dropdown
    const categories = ['all', ...new Set(parts.map(part => part.category))];

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        }

        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown className="w-4 h-4" />;
        }

        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4" />
            : <ArrowDown className="w-4 h-4" />;
    };

    const togglePartSelection = (partId: number) => {
        setSelectedParts(prev =>
            prev.includes(partId)
                ? prev.filter(id => id !== partId)
                : [...prev, partId]
        );
    };

    const selectAllLowStockParts = () => {
        const lowStockPartIds = parts
            .filter(part => part.quantityInStock <= part.minimumStockLevel)
            .map(part => part.partId);

        setSelectedParts(lowStockPartIds);
    };

    const handleCreatePO = async () => {
        if (selectedParts.length === 0) return;

        setIsCreatingPO(true);
        try {
            const poItems = selectedParts.map(partId => {
                const part = parts.find(p => p.partId === partId)!;
                const quantityToOrder = (part.minimumStockLevel * 2) - part.quantityInStock;

                return {
                    partId,
                    quantity: quantityToOrder > 0 ? quantityToOrder : part.minimumStockLevel,
                    unitPrice: part.cost
                };
            });

            await createPurchaseOrder({
                ...poData,
                items: poItems
            });

            setSelectedParts([]);
            setShowCreatePOModal(false);

            // You might want to refresh the inventory data here
        } catch (error) {
            console.error('Error creating purchase order:', error);
        } finally {
            setIsCreatingPO(false);
        }
    };

    const getStockStatusStyle = (status: string) => {
        switch (status) {
            case 'LOW':
                return 'bg-red-100 text-red-800';
            case 'MODERATE':
                return 'bg-yellow-100 text-yellow-800';
            case 'ADEQUATE':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
                <h2 className="text-lg font-semibold text-white">Inventory Management</h2>
            </div>

            <div className="p-4">
                {/* Filters and Actions */}
                <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search parts by name, description, or supplier..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-2">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                className="pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white text-gray-700"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                title="Filter by category"
                            >
                                <option value="all">All Categories</option>
                                {categories.filter(cat => cat !== 'all').map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ArrowDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                className="pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white text-gray-700"
                                value={stockStatus}
                                onChange={(e) => setStockStatus(e.target.value)}
                                title="Filter by stock status"
                            >
                                <option value="all">All Stock Status</option>
                                <option value="LOW">Low Stock</option>
                                <option value="MODERATE">Moderate Stock</option>
                                <option value="ADEQUATE">Adequate Stock</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ArrowDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert & Actions */}
                <div className="mb-4">
                    {parts.some(part => part.quantityInStock <= part.minimumStockLevel) && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                <div>
                                    <h3 className="text-red-800 font-medium">Low Stock Alert</h3>
                                    <p className="text-red-700 text-sm mt-1">
                                        {parts.filter(part => part.quantityInStock <= part.minimumStockLevel).length} items are below their minimum stock level.
                                    </p>
                                    <div className="mt-2 flex space-x-2">
                                        <button
                                            className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200"
                                            onClick={selectAllLowStockParts}
                                        >
                                            Select All Low Stock Items
                                        </button>
                                        <button
                                            className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 flex items-center"
                                            onClick={() => setShowCreatePOModal(true)}
                                            disabled={selectedParts.length === 0}
                                        >
                                            <Truck className="h-4 w-4 mr-1" />
                                            Create Purchase Order ({selectedParts.length})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="low-stock-toggle"
                                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                checked={showLowStockOnly}
                                onChange={() => setShowLowStockOnly(!showLowStockOnly)}
                            />
                            <label htmlFor="low-stock-toggle" className="text-sm text-gray-700">
                                Show Low Stock Only
                            </label>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 flex items-center"
                                onClick={() => {}}
                            >
                                <Download className="h-4 w-4 mr-1" />
                                Export Inventory
                            </button>
                            <button
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 flex items-center"
                                onClick={() => {}}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add New Part
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    checked={selectedParts.length === filteredParts.length && filteredParts.length > 0}
                                    onChange={() => {
                                        if (selectedParts.length === filteredParts.length) {
                                            setSelectedParts([]);
                                        } else {
                                            setSelectedParts(filteredParts.map(part => part.partId));
                                        }
                                    }}
                                    title="Select all parts"
                                />
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">
                                    Part Name
                                    <button className="ml-1 focus:outline-none">
                                        {getSortIcon('name')}
                                    </button>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('category')}
                            >
                                <div className="flex items-center">
                                    Category
                                    <button className="ml-1 focus:outline-none">
                                        {getSortIcon('category')}
                                    </button>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('quantityInStock')}
                            >
                                <div className="flex items-center">
                                    Quantity
                                    <button className="ml-1 focus:outline-none">
                                        {getSortIcon('quantityInStock')}
                                    </button>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('minimumStockLevel')}
                            >
                                <div className="flex items-center">
                                    Min Level
                                    <button className="ml-1 focus:outline-none">
                                        {getSortIcon('minimumStockLevel')}
                                    </button>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('price')}
                            >
                                <div className="flex items-center">
                                    Price
                                    <button className="ml-1 focus:outline-none">
                                        {getSortIcon('price')}
                                    </button>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Supplier
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Location
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredParts.length > 0 ? (
                            filteredParts.map((part) => (
                                <tr key={part.partId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                            checked={selectedParts.includes(part.partId)}
                                            onChange={() => togglePartSelection(part.partId)}
                                            title={`Select ${part.name}`}
                                        />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{part.name}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{part.description}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {part.category}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                          part.quantityInStock <= part.minimumStockLevel
                              ? 'text-red-600'
                              : 'text-gray-900'
                      }`}>
                        {part.quantityInStock}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {part.minimumStockLevel}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusStyle(part.stockStatus)}`}>
                        {part.stockStatus}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        ${part.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {part.supplier}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {part.location}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                    No parts found matching your criteria.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Purchase Order Modal */}
            {showCreatePOModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Create Purchase Order
                                        </h3>
                                        <div className="mt-4">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Supplier Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={poData.supplierName}
                                                    onChange={(e) => setPOData({...poData, supplierName: e.target.value})}
                                                    title="Enter supplier name"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expected Delivery Date
                                                </label>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={poData.expectedDeliveryDate}
                                                    onChange={(e) => setPOData({...poData, expectedDeliveryDate: e.target.value})}
                                                    title="Select expected delivery date"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Notes
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={poData.notes}
                                                    onChange={(e) => setPOData({...poData, notes: e.target.value})}
                                                    title="Enter purchase order notes"
                                                ></textarea>
                                            </div>
                                            <div className="mt-2">
                                                <h4 className="font-medium text-sm text-gray-700 mb-2">Selected Parts: {selectedParts.length}</h4>
                                                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                                    {selectedParts.map(partId => {
                                                        const part = parts.find(p => p.partId === partId)!;
                                                        const quantityToOrder = Math.max((part.minimumStockLevel * 2) - part.quantityInStock, part.minimumStockLevel);

                                                        return (
                                                            <div key={partId} className="text-sm py-1 border-b last:border-b-0 flex justify-between">
                                                                <span>{part.name}</span>
                                                                <span>Qty: {quantityToOrder}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleCreatePO}
                                    disabled={isCreatingPO || !poData.supplierName || !poData.expectedDeliveryDate}
                                >
                                    {isCreatingPO ? 'Creating...' : 'Create Purchase Order'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowCreatePOModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;