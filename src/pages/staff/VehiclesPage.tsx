import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,  
  Car, 
  Calendar, 
  MapPin, 
  Eye,
  Wrench,
  Clock,
  User,
  ChevronRight
} from 'lucide-react';
import { fetchStaffVehicles } from '../../api/vehicles';
import { Vehicle } from '../../types/vehicle.types';
import { PaginatedResponseData } from '../../types/response.types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Select from '../../components/common/Select';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/dateUtils';

interface VehiclesPageState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<VehiclesPageState>({
    vehicles: [],
    isLoading: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Memoized filter parameters
  const filterParams = useMemo(() => ({
    search: searchTerm,
    make: makeFilter,
    model: modelFilter,
    year: yearFilter ? parseInt(yearFilter) : undefined,
    sortBy,
    sortDirection,
    page: state.currentPage,
    size: state.pageSize
  }), [searchTerm, makeFilter, modelFilter, yearFilter, sortBy, sortDirection, state.currentPage, state.pageSize]);

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetchStaffVehicles(filterParams);
      
      console.log('fetchStaffVehicles response:', response);
      
      // The apiClient returns the data property directly, so response is PaginatedResponse<Vehicle>
      if (!response) {
        throw new Error('Invalid response from server - no data received');
      }
      
      if (typeof response !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      let vehicles: Vehicle[] = [];
      let paginationData: any = null;
      
      // Handle different possible response structures
      if ('content' in response && Array.isArray((response as any).content)) {
        vehicles = (response as any).content;
        paginationData = response;
      } else if ('data' in response && response.data && 'content' in response.data) {
        vehicles = response.data.content || [];
        paginationData = response.data;
      } else if (Array.isArray(response)) {
        vehicles = response;
        paginationData = {
          content: vehicles,
          page: 0,
          size: vehicles.length,
          totalElements: vehicles.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true
        };
      } else {
        throw new Error('Unexpected response structure from server');
      }
      
      setState(prev => ({
        ...prev,
        vehicles: vehicles,
        totalPages: paginationData.totalPages || 0,
        totalElements: paginationData.totalElements || 0,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch vehicles',
        isLoading: false
      }));
      setNotification({
        type: 'error',
        message: 'Failed to fetch vehicles. Please try again.'
      });
    }
  };

  // Fetch vehicles when filters change
  useEffect(() => {
    fetchVehicles();
  }, [filterParams]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setState(prev => ({ ...prev, currentPage: 0 })); // Reset to first page
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'make':
        setMakeFilter(value);
        break;
      case 'model':
        setModelFilter(value);
        break;
      case 'year':
        setYearFilter(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'sortDirection':
        setSortDirection(value as 'asc' | 'desc');
        break;
    }
    setState(prev => ({ ...prev, currentPage: 0 })); // Reset to first page
  };

  // Handle vehicle actions
  const handleViewVehicle = (vehicleId: number) => {
    navigate(`/staff/vehicles/${vehicleId}`);
  };

  const handleViewAppointments = (vehicleId: number) => {
    navigate(`/staff/appointments?vehicleId=${vehicleId}`);
  };

  const handleViewWorkOrders = (vehicleId: number) => {
    navigate(`/staff/work-orders?vehicleId=${vehicleId}`);
  };

  // Get unique makes and models for filters
  const uniqueMakes = useMemo(() => {
    const makes = new Set(state.vehicles.map(v => v.make).filter(Boolean));
    return Array.from(makes).sort();
  }, [state.vehicles]);

  const uniqueModels = useMemo(() => {
    const models = new Set(state.vehicles.map(v => v.model).filter(Boolean));
    return Array.from(models).sort();
  }, [state.vehicles]);

  const uniqueYears = useMemo(() => {
    const years = new Set(state.vehicles.map(v => v.year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a); // Descending order
  }, [state.vehicles]);

  // Render vehicle card
  const renderVehicleCard = (vehicle: Vehicle) => (
    <Card key={vehicle.vehicleId} className="hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Car className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-500">
                License: {vehicle.licensePlate}
                {vehicle.vin && ` • VIN: ${vehicle.vin}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewVehicle(vehicle.vehicleId)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Customer</p>
              <p className="text-xs text-gray-500">
                Customer ID: {vehicle.customerId}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Registered</p>
              <p className="text-xs text-gray-500">
                {formatDate(vehicle.registrationDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Mileage</p>
              <p className="text-xs text-gray-500">
                {vehicle.mileage.toLocaleString()} miles
              </p>
            </div>
          </div>
        </div>

        {vehicle.color && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Color:</span> {vehicle.color}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewAppointments(vehicle.vehicleId)}
            >
              <Clock className="w-4 h-4 mr-1" />
              Appointments
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewWorkOrders(vehicle.vehicleId)}
            >
              <Wrench className="w-4 h-4 mr-1" />
              Work Orders
            </Button>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Card>
  );

  if (state.isLoading && state.vehicles.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Vehicles</h3>
          <p className="text-gray-600">Manage and view vehicle information</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Make Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make
              </label>
              <Select
                value={makeFilter}
                onChange={(value) => handleFilterChange('make', value)}
                options={[
                  { value: '', label: 'All Makes' },
                  ...uniqueMakes.map(make => ({ value: make, label: make }))
                ]}
              />
            </div>

            {/* Model Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <Select
                value={modelFilter}
                onChange={(value) => handleFilterChange('model', value)}
                options={[
                  { value: '', label: 'All Models' },
                  ...uniqueModels.map(model => ({ value: model, label: model }))
                ]}
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <Select
                value={yearFilter}
                onChange={(value) => handleFilterChange('year', value)}
                options={[
                  { value: '', label: 'All Years' },
                  ...uniqueYears.map(year => ({ value: year.toString(), label: year.toString() }))
                ]}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select
                value={sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
                options={[
                  { value: 'registrationDate', label: 'Registration Date' },
                  { value: 'make', label: 'Make' },
                  { value: 'model', label: 'Model' },
                  { value: 'year', label: 'Year' },
                  { value: 'mileage', label: 'Mileage' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Direction
              </label>
              <Select
                value={sortDirection}
                onChange={(value) => handleFilterChange('sortDirection', value)}
                options={[
                  { value: 'desc', label: 'Descending' },
                  { value: 'asc', label: 'Ascending' }
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {state.error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{state.error}</p>
            <Button
              variant="outline"
              onClick={fetchVehicles}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : state.vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500">
              {searchTerm || makeFilter || modelFilter || yearFilter
                ? 'Try adjusting your filters'
                : 'No vehicles are currently available'}
            </p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {state.vehicles.length} of {state.totalElements} vehicles
              </p>
            </div>

            {/* Vehicle cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {state.vehicles.map(renderVehicleCard)}
            </div>

            {/* Pagination */}
            {state.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  pagination={{
                    content: state.vehicles,
                    page: state.currentPage,
                    size: state.pageSize,
                    totalElements: state.totalElements,
                    totalPages: state.totalPages,
                    hasNext: state.currentPage < state.totalPages - 1,
                    hasPrevious: state.currentPage > 0,
                    isFirst: state.currentPage === 0,
                    isLast: state.currentPage === state.totalPages - 1
                  }}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.type === 'success' ? 'Success' : 'Error'}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default VehiclesPage; 