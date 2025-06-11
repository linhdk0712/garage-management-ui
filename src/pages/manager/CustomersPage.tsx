import React, { useState, useEffect, ChangeEvent } from 'react';
import { Search, Filter, UserPlus, Mail, Phone } from 'lucide-react';
import { fetchAllCustomers, fetchCustomerStatistics } from '../../api/customers';
import { CustomerProfile, CustomerStatistics } from '../../types/customer.types';
import { PaginatedResponse } from '../../types/response.types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Select from '../../components/common/Select';
import Table, { TableColumn } from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/dateUtils.ts';

// Extend CustomerProfile to satisfy Record<string, unknown>
interface CustomerProfileWithIndex extends CustomerProfile {
    [key: string]: unknown;
}

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<CustomerProfileWithIndex[]>([]);
    const [pagination, setPagination] = useState<PaginatedResponse<CustomerProfile>>({
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        isFirst: true,
        isLast: true
    });
    const [statistics, setStatistics] = useState<CustomerStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [sortBy, setSortBy] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetchAllCustomers({
                search: searchTerm,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                sortBy,
                sortDirection,
                page: currentPage,
                size: pageSize
            });
            
            console.log('fetchAllCustomers response:', response);
            console.log('Response type:', typeof response);
            console.log('Response keys:', response ? Object.keys(response) : 'null');
            
            if (!response) {
                setError('Invalid response from server - no data received');
                setCustomers([]);
                return;
            }
            
            // The apiClient already extracts the data field, so response is directly the PaginatedResponse
            const paginatedData = response;
            console.log('Paginated data:', paginatedData);
            console.log('Content length:', paginatedData.content?.length || 0);
            
            setPagination(paginatedData);
            setCustomers(paginatedData.content as CustomerProfileWithIndex[]);
            
        } catch (err) {
            console.error('Error fetching customers:', err);
            
            let errorMessage = 'Failed to fetch customers. Please try again later.';
            
            if (err instanceof Error) {
                if (err.message.includes('Network Error') || err.message.includes('ECONNREFUSED')) {
                    errorMessage = 'Unable to connect to server. Please check your internet connection.';
                } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                    errorMessage = 'Authentication failed. Please log in again.';
                } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
                    errorMessage = 'You do not have permission to access this data.';
                } else if (err.message.includes('404') || err.message.includes('Not Found')) {
                    errorMessage = 'The requested data could not be found.';
                } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
                    errorMessage = 'Server error occurred. Please try again later.';
                } else {
                    errorMessage = `Error: ${err.message}`;
                }
            }
            
            setError(errorMessage);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const stats = await fetchCustomerStatistics('MONTH');
            setStatistics(stats);
        } catch (err) {
            console.error('Failed to fetch customer statistics:', err);
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchStats();
    }, [searchTerm, statusFilter, sortBy, sortDirection, currentPage, pageSize]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0); // Reset to first page when changing page size
    };

    const columns: TableColumn<CustomerProfileWithIndex>[] = [
        {
            header: 'Name',
            accessor: (customer) => `${customer.firstName} ${customer.lastName}`,
            sortable: true,
            className: 'min-w-[200px]'
        },
        {
            header: 'Contact',
            accessor: (customer) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                    </div>
                </div>
            ),
            sortable: false,
            className: 'min-w-[250px]'
        },
        {
            header: 'Location',
            accessor: (customer) => (
                <div className="flex flex-col">
                    <span>{customer.city}, {customer.state}</span>
                    <span className="text-sm text-gray-500">{customer.zipCode}</span>
                </div>
            ),
            sortable: true,
            className: 'min-w-[200px]'
        },
        {
            header: 'Member Since',
            accessor: (customer) => formatDate(customer.memberSince),
            sortable: true,
            className: 'min-w-[150px]'
        },
        {
            header: 'Actions',
            accessor: (customer) => (
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {/* TODO: Implement view details */}}
                    >
                        View Details
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Implement send message */}}
                    >
                        Message
                    </Button>
                </div>
            ),
            sortable: false,
            className: 'min-w-[200px]'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customer Management</h1>
                <Button
                    variant="primary"
                    onClick={() => {/* TODO: Implement add customer */}}
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-500">New Customers</h3>
                            <p className="text-2xl font-bold">{statistics.newCustomers}</p>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
                            <p className="text-2xl font-bold">{statistics.activeCustomers}</p>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-500">Avg. Rating</h3>
                            <p className="text-2xl font-bold">{statistics.averageFeedbackRating.toFixed(1)}</p>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-500">Customer Retention</h3>
                            <p className="text-2xl font-bold">{statistics.customerRetention.loyal}%</p>
                        </div>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card className="mb-6">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Select
                                value={statusFilter}
                                onChange={(value: string) => setStatusFilter(value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                                options={[
                                    { value: 'ALL', label: 'All Status' },
                                    { value: 'ACTIVE', label: 'Active' },
                                    { value: 'INACTIVE', label: 'Inactive' }
                                ]}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Customers Table */}
            {error && (
                <Notification
                    type="error"
                    title="Error"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : (
                <Card>
                    <Table<CustomerProfileWithIndex>
                        columns={columns}
                        data={customers || []}
                        keyField="customerId"
                        hoverable
                        striped
                        bordered
                        emptyMessage="No customers found"
                    />
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onSizeChange={handleSizeChange}
                        showSizeSelector={true}
                    />
                </Card>
            )}
        </div>
    );
};

export default CustomersPage; 