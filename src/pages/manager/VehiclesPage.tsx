import React, { useState, useEffect, ChangeEvent } from 'react';
import { Search, Filter, Car, User, Calendar, MapPin } from 'lucide-react';
import { fetchAllVehiclesWithCustomers } from '../../api/vehicles';
import { VehicleWithCustomer } from '../../types/vehicle.types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table, { TableColumn } from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';
import { formatDate } from '../../utils/dateUtils.ts';

// Extend VehicleWithCustomer to satisfy Record<string, unknown>
interface VehicleWithCustomerIndex extends VehicleWithCustomer {
    [key: string]: unknown;
}

const VehiclesPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<VehicleWithCustomerIndex[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [makeFilter, setMakeFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [sortBy, setSortBy] = useState<string>('registrationDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetchAllVehiclesWithCustomers({
                search: searchTerm,
                make: makeFilter || undefined,
                year: yearFilter ? parseInt(yearFilter) : undefined,
                sortBy,
                sortDirection,
                page: currentPage,
                limit: itemsPerPage
            });
            
            console.log('fetchAllVehiclesWithCustomers response:', response);
            
            // Handle different possible response structures
            let vehicles: VehicleWithCustomer[] = [];
            let total = 0;
            
            if (!response) {
                setError('Invalid response from server - no data received');
                setVehicles([]);
                setTotalPages(1);
                return;
            }
            
            if (typeof response !== 'object') {
                setError('Invalid response format from server');
                setVehicles([]);
                setTotalPages(1);
                return;
            }
            
            // Check if response has the expected structure
            if ('vehicles' in response && 'total' in response) {
                vehicles = (response as any).vehicles || [];
                total = (response as any).total || 0;
            } 
            else if (Array.isArray(response)) {
                vehicles = response as VehicleWithCustomer[];
                total = (response as VehicleWithCustomer[]).length;
            }
            else if ('data' in response && Array.isArray((response as any).data)) {
                vehicles = (response as any).data;
                total = (response as any).data.length;
            }
            else if ('content' in response && Array.isArray((response as any).content)) {
                vehicles = (response as any).content;
                total = (response as any).totalElements || (response as any).content.length;
            }
            else {
                setError('Unexpected response structure from server');
                setVehicles([]);
                setTotalPages(1);
                return;
            }
            
            console.log('Processed vehicles:', vehicles);
            console.log('Total:', total);
            
            if (!Array.isArray(vehicles)) {
                setError('Invalid vehicles data format from server');
                setVehicles([]);
                setTotalPages(1);
                return;
            }
            
            setVehicles(vehicles as VehicleWithCustomerIndex[]);
            setTotalPages(Math.ceil(total / itemsPerPage));
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            
            let errorMessage = 'Failed to fetch vehicles. Please try again later.';
            
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
            setVehicles([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [searchTerm, makeFilter, yearFilter, sortBy, sortDirection, currentPage]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const columns: TableColumn<VehicleWithCustomerIndex>[] = [
        {
            header: 'Vehicle',
            accessor: (vehicle) => (
                <div className="flex flex-col">
                    <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                    <div className="text-sm text-gray-500">{vehicle.year}</div>
                    <div className="text-sm text-gray-600">{vehicle.licensePlate}</div>
                </div>
            ),
            sortable: true,
            className: 'min-w-[200px]'
        },
        // {
        //     header: 'Customer',
        //     accessor: (vehicle) => (
        //         <div className="flex flex-col">
        //             <div className="font-medium">{vehicle.customer.firstName} {vehicle.customer.lastName}</div>
        //             <div className="text-sm text-gray-500">{vehicle.customer.email}</div>
        //             <div className="text-sm text-gray-600">{vehicle.customer.phone}</div>
        //         </div>
        //     ),
        //     sortable: true,
        //     className: 'min-w-[250px]'
        // },
        {
            header: 'Details',
            accessor: (vehicle) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        <span>{vehicle.color || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.mileage.toLocaleString()} miles</span>
                    </div>
                    {vehicle.vin && (
                        <div className="text-sm text-gray-500">
                            VIN: {vehicle.vin}
                        </div>
                    )}
                </div>
            ),
            sortable: false,
            className: 'min-w-[200px]'
        },
        {
            header: 'Service History',
            accessor: (vehicle) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Registered: {formatDate(vehicle.registrationDate)}</span>
                    </div>
                    {vehicle.lastServiceDate && (
                        <div className="text-sm text-gray-500">
                            Last Service: {formatDate(vehicle.lastServiceDate)}
                        </div>
                    )}
                </div>
            ),
            sortable: true,
            className: 'min-w-[200px]'
        },
        {
            header: 'Actions',
            accessor: (vehicle) => (
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {/* TODO: Implement view vehicle details */}}
                    >
                        View Details
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Implement view customer details */}}
                    >
                        View Customer
                    </Button>
                </div>
            ),
            sortable: false,
            className: 'min-w-[200px]'
        }
    ];

    // Generate unique makes for filter dropdown
    const uniqueMakes = Array.from(new Set(vehicles.map(v => v.make))).sort();
    
    // Generate year options for filter dropdown
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vehicle Management</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {/* TODO: Implement export functionality */}}
                    >
                        Export Data
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {/* TODO: Implement add vehicle */}}
                    >
                        <Car className="w-4 h-4 mr-2" />
                        Add Vehicle
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
                        <p className="text-2xl font-bold">{vehicles.length}</p>
                    </div>
                </Card>
                <Card>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
                        <p className="text-2xl font-bold">
                            {Array.from(new Set(vehicles.map(v => v.customerId))).length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Avg. Mileage</h3>
                        <p className="text-2xl font-bold">
                            {vehicles.length > 0 
                                ? Math.round(vehicles.reduce((sum, v) => sum + v.mileage, 0) / vehicles.length).toLocaleString()
                                : '0'
                            }
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Recent Registrations</h3>
                        <p className="text-2xl font-bold">
                            {vehicles.filter(v => {
                                const regDate = new Date(v.registrationDate);
                                const thirtyDaysAgo = new Date();
                                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                return regDate >= thirtyDaysAgo;
                            }).length}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search vehicles, customers, or license plates..."
                                    value={searchTerm}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Select
                                value={makeFilter}
                                onChange={(value: string) => setMakeFilter(value)}
                                options={[
                                    { value: '', label: 'All Makes' },
                                    ...uniqueMakes.map(make => ({ value: make, label: make }))
                                ]}
                                className="pl-10"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Select
                                value={yearFilter}
                                onChange={(value: string) => setYearFilter(value)}
                                options={[
                                    { value: '', label: 'All Years' },
                                    ...yearOptions.map(year => ({ value: year.toString(), label: year.toString() }))
                                ]}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Vehicles Table */}
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
                    <Table<VehicleWithCustomerIndex>
                        columns={columns}
                        data={vehicles || []}
                        keyField="vehicleId"
                        pagination
                        pageSize={itemsPerPage}
                        hoverable
                        striped
                        bordered
                        emptyMessage="No vehicles found"
                    />
                </Card>
            )}
        </div>
    );
};

export default VehiclesPage; 