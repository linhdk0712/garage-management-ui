import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface TableColumn<T> {
    header: string;
    accessor: keyof T | ((data: T) => React.ReactNode);
    cell?: (data: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface TableProps<T> {
    readonly columns: TableColumn<T>[];
    readonly data: T[];
    readonly keyField: keyof T;
    readonly pagination?: boolean;
    readonly pageSize?: number;
    readonly striped?: boolean;
    readonly hoverable?: boolean;
    readonly bordered?: boolean;
    readonly searchable?: boolean;
    readonly loading?: boolean;
    readonly emptyMessage?: string;
    readonly className?: string;
    readonly onRowClick?: (row: T) => void;
}

function Table<T extends Record<string, unknown>>({
                      columns,
                      data,
                      keyField,
                      pagination = false,
                      pageSize = 10,
                      striped = false,
                      hoverable = true,
                      bordered = true,
                      searchable = false,
                      loading = false,
                      emptyMessage = 'No data available',
                      className = '',
                      onRowClick,
                  }: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Ensure data is always an array to prevent undefined errors
    const safeData = Array.isArray(data) ? data : [];
    const [filteredData, setFilteredData] = useState<T[]>(safeData);

    // Update filtered data when data, search term, or sort changes
    useEffect(() => {
        let result = [...safeData];

        // Apply search if searchable
        if (searchable && searchTerm) {
            result = result.filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Apply sorting if sortField exists
        if (sortField) {
            result.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
                if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

                return sortDirection === 'asc'
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            });
        }

        setFilteredData(result);
        // Reset to first page when filtering data
        setCurrentPage(1);
    }, [safeData, searchTerm, sortField, sortDirection, searchable]);

    // Handle sorting
    const handleSort = (accessor: keyof T) => {
        const isSameField = sortField === accessor;
        if (isSameField) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(accessor);
            setSortDirection('asc');
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = pagination
        ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : filteredData;

    // Generate an array of page numbers to display
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    // Table classes
    const tableClasses = `min-w-full divide-y divide-gray-200 ${bordered ? 'border border-gray-200' : ''} ${className}`;
    const headerRowClasses = 'bg-gray-50';
    const bodyRowClasses = `${striped ? 'even:bg-gray-50' : ''} ${hoverable && onRowClick ? 'hover:bg-gray-100 cursor-pointer' : ''}`;

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                    </td>
                </tr>
            );
        }

        if (paginatedData.length === 0) {
            return (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                        {emptyMessage}
                    </td>
                </tr>
            );
        }

        return paginatedData.map((row) => (
            <tr
                key={String(row[keyField])}
                className={bodyRowClasses}
                onClick={() => onRowClick && onRowClick(row)}
            >
                {columns.map((column, cellIndex) => {
                    const value =
                        typeof column.accessor === 'function'
                            ? column.accessor(row)
                            : row[column.accessor];
                    return (
                        <td
                            key={`${column.header}-${cellIndex}`}
                            className={`px-6 py-4 whitespace-nowrap ${column.className ?? ''}`}
                        >
                            {column.cell ? column.cell(row) : (value as React.ReactNode)}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <div className="overflow-hidden rounded-lg shadow">
            {searchable && (
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className={tableClasses}>
                    <thead>
                    <tr className={headerRowClasses}>
                        {columns.map((column, index) => {
                            const isSortable = column.sortable !== false && typeof column.accessor === 'string';
                            const isSorted = isSortable && sortField === column.accessor;

                            return (
                                <th
                                    key={`${column.header}-${index}`}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                        column.className ?? ''
                                    } ${isSortable ? 'cursor-pointer select-none' : ''}`}
                                    onClick={() => isSortable && handleSort(column.accessor as keyof T)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.header}</span>
                                        {isSortable && (
                                            <div className="flex flex-col">
                                                {renderSortIcon(isSorted, sortDirection)}
                                            </div>
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>

            {pagination && totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * pageSize, filteredData.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredData.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <span className="sr-only">First</span>
                                    <ChevronsLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                {getPageNumbers().map((page, index) => (
                                    <button
                                        key={`page-${page}-${index}`}
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            page === currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <span className="sr-only">Last</span>
                                    <ChevronsRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const renderSortIcon = (isSorted: boolean, sortDirection: 'asc' | 'desc') => {
    if (!isSorted) {
        return (
            <div className="h-4 w-4 text-gray-300">
                <ChevronUp className="h-2 w-2" />
                <ChevronDown className="h-2 w-2" />
            </div>
        );
    }
    return sortDirection === 'asc' ? (
        <ChevronUp className="h-4 w-4 text-blue-500" />
    ) : (
        <ChevronDown className="h-4 w-4 text-blue-500" />
    );
};

export default Table;