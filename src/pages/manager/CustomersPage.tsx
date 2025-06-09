import React, { useState, useEffect, ChangeEvent } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, UserPlus, Mail, Phone } from 'lucide-react';
import { fetchAllCustomers, fetchCustomerStatistics } from '../../api/customers';
import { CustomerProfile, CustomerStatistics } from '../../types/customer.types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table, { TableColumn } from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';
import { formatDate } from '../../utils/dateUtils.ts';

// Extend CustomerProfile to satisfy Record<string, unknown>
interface CustomerProfileWithIndex extends CustomerProfile {
    [key: string]: unknown;
}

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<CustomerProfileWithIndex[]>([]);
    const [statistics, setStatistics] = useState<CustomerStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [sortBy, setSortBy] = useState<string>('memberSince');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null); // Clear any previous errors
            
            const response = await fetchAllCustomers({
                search: searchTerm,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                sortBy,
                sortDirection,
                page: currentPage,
                limit: itemsPerPage
            });
            
            console.log('fetchAllCustomers response:', response);
            
            // Add proper null checks and validation
            if (!response) {
                setError('Invalid response from server - no data received');
                setCustomers([]);
                setTotalPages(1);
                return;
            }
            
            // Ensure response has the expected structure
            if (typeof response !== 'object') {
                setError('Invalid response format from server');
                setCustomers([]);
                setTotalPages(1);
                return;
            }
            
            // Handle different possible response structures
            let customers: CustomerProfile[] = [];
            let total = 0;
            
            // Check if response has the expected structure
            if ('customers' in response && 'total' in response) {
                customers = (response as any).customers || [];
                total = (response as any).total || 0;
            } 
            // Fallback: if response is an array, treat it as the customers array
            else if (Array.isArray(response)) {
                customers = response as CustomerProfile[];
                total = (response as CustomerProfile[]).length;
            }
            // Fallback: if response has a 'data' property, check if it's an array
            else if ('data' in response && Array.isArray((response as any).data)) {
                customers = (response as any).data;
                total = (response as any).data.length;
            }
            // Fallback: if response has a 'content' property (Spring Boot pagination)
            else if ('content' in response && Array.isArray((response as any).content)) {
                customers = (response as any).content;
                total = (response as any).totalElements || (response as any).content.length;
            }
            else {
                setError('Unexpected response structure from server');
                setCustomers([]);
                setTotalPages(1);
                return;
            }
            
            console.log('Processed customers:', customers);
            console.log('Total:', total);
            
            // Validate that customers is an array
            if (!Array.isArray(customers)) {
                setError('Invalid customers data format from server');
                setCustomers([]);
                setTotalPages(1);
                return;
            }
            
            // Cast the response to CustomerProfileWithIndex[]
            setCustomers(customers as CustomerProfileWithIndex[]);
            setTotalPages(Math.ceil(total / itemsPerPage));
        } catch (err) {
            console.error('Error fetching customers:', err);
            
            // Provide more specific error messages based on error type
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
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const stats = await fetchCustomerStatistics('MONTH') as CustomerStatistics;
            setStatistics(stats);
        } catch (err) {
            console.error('Failed to fetch customer statistics:', err);
        }
    };

    useEffect(() => {
        fetchCustomers();
        //fetchStats();
    }, [searchTerm, statusFilter, sortBy, sortDirection, currentPage]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
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
                        pagination
                        pageSize={itemsPerPage}
                        hoverable
                        striped
                        bordered
                        emptyMessage="No customers found"
                    />
                </Card>
            )}
        </div>
    );
};

export default CustomersPage; 