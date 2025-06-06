import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clipboard, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Car, 
  ArrowRight
} from 'lucide-react';
import useWorkOrders from '../../hooks/useWorkOrders';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import Table, { TableColumn } from '../../components/common/Table';
import { WorkOrder, WorkOrderStatus } from '../../types/workOrder.types';

const WorkOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const { 
    workOrders, 
    isLoading, 
    error, 
    fetchAllWorkOrders, 
    updateStatus,
    calculatePartsCost,
    calculateLaborCost,
    calculateTotalCost
  } = useWorkOrders({ initialFetch: true });
  
  const navigate = useNavigate();

  const handleStatusChange = async (workOrderId: number, status: WorkOrderStatus) => {
    try {
      await updateStatus(workOrderId, status);
      setNotification({
        type: 'success',
        message: `Work order status updated to ${status}`
      });
      
      // Refresh work orders
      fetchAllWorkOrders();
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: 'Failed to update work order status'
      });
    }
  };

  const handleViewWorkOrder = (workOrderId: number) => {
    navigate(`/staff/work-orders/${workOrderId}`);
  };

  // Filter and sort work orders
  const filteredAndSortedWorkOrders = [...workOrders]
    .filter(workOrder => {
      const matchesSearch = 
        workOrder.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        workOrder.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'appointmentDate':
          aValue = new Date(a.appointment.appointmentDate).getTime();
          bValue = new Date(b.appointment.appointmentDate).getTime();
          break;
        case 'customerName':
          aValue = `${a.customer.lastName}, ${a.customer.firstName}`.toLowerCase();
          bValue = `${b.customer.lastName}, ${b.customer.firstName}`.toLowerCase();
          break;
        case 'totalCost':
          aValue = a.totalCost;
          bValue = b.totalCost;
          break;
        default:
          aValue = a[sortBy as keyof WorkOrder];
          bValue = b[sortBy as keyof WorkOrder];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadgeVariant = (status: WorkOrderStatus): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'primary';
      case 'ON_HOLD':
        return 'danger';
      case 'COMPLETED':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'IN_PROGRESS':
        return <Clipboard className="w-4 h-4 mr-1" />;
      case 'ON_HOLD':
        return <AlertTriangle className="w-4 h-4 mr-1" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  // Table columns for table view
  const columns: TableColumn<WorkOrder>[] = [
    {
      header: 'ID',
      accessor: 'workOrderId',
      className: 'font-medium',
    },
    {
      header: 'Service',
      accessor: (workOrder) => workOrder.appointment.serviceType,
    },
    {
      header: 'Customer',
      accessor: (workOrder) => `${workOrder.customer.firstName} ${workOrder.customer.lastName}`,
    },
    {
      header: 'Vehicle',
      accessor: (workOrder) => `${workOrder.vehicle.make} ${workOrder.vehicle.model} (${workOrder.vehicle.licensePlate})`,
    },
    {
      header: 'Created',
      accessor: (workOrder) => new Date(workOrder.createdAt).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (workOrder) => (
        <Badge
          label={workOrder.status}
          variant={getStatusBadgeVariant(workOrder.status)}
          icon={getStatusIcon(workOrder.status)}
          size="sm"
        />
      ),
    },
    {
      header: 'Total',
      accessor: (workOrder) => `$${workOrder.totalCost.toFixed(2)}`,
      className: 'text-right font-medium',
    },
    {
      header: 'Actions',
      accessor: (workOrder) => workOrder,
      cell: (workOrder) => (
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            onClick={() => handleViewWorkOrder(workOrder.workOrderId)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  const renderWorkOrderCard = (workOrder: WorkOrder) => {
    return (
      <div 
        key={workOrder.workOrderId}
        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => handleViewWorkOrder(workOrder.workOrderId)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{workOrder.appointment.serviceType}</h3>
              <span className="ml-2 text-sm text-gray-500">#{workOrder.workOrderId}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Created: {new Date(workOrder.createdAt).toLocaleString()}
            </div>
          </div>
          <Badge
            label={workOrder.status}
            variant={getStatusBadgeVariant(workOrder.status)}
            icon={getStatusIcon(workOrder.status)}
            size="md"
            rounded
          />
        </div>
        
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <User className="w-4 h-4 mr-1 mt-0.5 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Customer</div>
              <div className="text-sm text-gray-600">
                {workOrder.customer.firstName} {workOrder.customer.lastName}
              </div>
              <div className="text-sm text-gray-600">{workOrder.customer.phone}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Car className="w-4 h-4 mr-1 mt-0.5 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Vehicle</div>
              <div className="text-sm text-gray-600">
                {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
              </div>
              <div className="text-sm text-gray-600">{workOrder.vehicle.licensePlate}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <div>
                <div className="text-xs text-gray-500">Parts</div>
                <div className="font-medium">${calculatePartsCost(workOrder.workOrderId).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Labor</div>
                <div className="font-medium">${calculateLaborCost(workOrder.workOrderId).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-medium text-lg">${workOrder.totalCost.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {workOrder.status === 'PENDING' && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Clipboard}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(workOrder.workOrderId, 'IN_PROGRESS');
                  }}
                >
                  Start Work
                </Button>
              )}
              
              {workOrder.status === 'IN_PROGRESS' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={AlertTriangle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(workOrder.workOrderId, 'ON_HOLD');
                    }}
                  >
                    Hold
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={CheckCircle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(workOrder.workOrderId, 'COMPLETED');
                    }}
                  >
                    Complete
                  </Button>
                </>
              )}
              
              {workOrder.status === 'ON_HOLD' && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Clipboard}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(workOrder.workOrderId, 'IN_PROGRESS');
                  }}
                >
                  Resume
                </Button>
              )}

              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewWorkOrder(workOrder.workOrderId);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Spinner size="lg" text="Loading work orders..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Work Orders</h1>
        <div className="flex mt-4 sm:mt-0">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            icon={Clipboard}
            className="mr-2"
            onClick={() => setViewMode('list')}
          >
            Card View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline'}
            size="sm"
            icon={Filter}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
        </div>
      </div>

      {notification && (
        <div className={`bg-${notification.type === 'success' ? 'green' : 'red'}-50 border-l-4 border-${notification.type === 'success' ? 'green' : 'red'}-400 p-4`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm text-${notification.type === 'success' ? 'green' : 'red'}-700`}>{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search work orders..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex mt-4 md:mt-0 md:ml-4">
              <div className="w-40 mr-4">
                <Select
                  id="statusFilter"
                  label="Status"
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'IN_PROGRESS', label: 'In Progress' },
                    { value: 'ON_HOLD', label: 'On Hold' },
                    { value: 'COMPLETED', label: 'Completed' },
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                />
              </div>
              
              <div className="w-40">
                <Select
                  id="sortBy"
                  label="Sort By"
                  options={[
                    { value: 'createdAt', label: 'Created Date' },
                    { value: 'updatedAt', label: 'Updated Date' },
                    { value: 'appointmentDate', label: 'Appointment Date' },
                    { value: 'customerName', label: 'Customer Name' },
                    { value: 'totalCost', label: 'Total Cost' },
                  ]}
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                />
              </div>
              
              <div className="ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={sortOrder === 'asc' ? ArrowRight : ArrowRight}
                  className="mt-6"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                </Button>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <Table
              columns={columns}
              data={filteredAndSortedWorkOrders}
              keyField="workOrderId"
              onRowClick={(row) => handleViewWorkOrder(row.workOrderId)}
              pagination
              hoverable
              striped
              bordered
              pageSize={10}
              emptyMessage="No work orders match your filters"
            />
          ) : (
            <div className="space-y-4">
              {filteredAndSortedWorkOrders.length > 0 ? (
                filteredAndSortedWorkOrders.map(workOrder => renderWorkOrderCard(workOrder))
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <Clipboard className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No work orders found for the selected filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WorkOrdersPage;