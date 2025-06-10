import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  List, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Car,
  User,
  CheckCircle,
  AlertCircle,
  Clipboard,
  ArrowRight,
  Filter,
  Download
} from 'lucide-react';
import useManagerAppointments from '../../hooks/useManagerAppointments';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import { Appointment } from '../../types/appointment.types';
import { format, addDays, subDays, startOfWeek, startOfDay, endOfDay, parseISO, isToday } from 'date-fns';
import Notification from '../../components/common/Notification';

const ManagerAppointmentsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('week');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const navigate = useNavigate();
  
  // Memoize the date range to prevent unnecessary re-renders
  const dateRange = useMemo(() => {
    const today = new Date();
    switch (dateRangeFilter) {
      case 'today':
        return {
          from: format(startOfDay(today), 'yyyy-MM-dd'),
          to: format(endOfDay(today), 'yyyy-MM-dd'),
        };
      case 'week':
        return {
          from: format(startOfDay(currentDate), 'yyyy-MM-dd'),
          to: format(endOfDay(addDays(currentDate, 6)), 'yyyy-MM-dd'),
        };
      case 'month':
        return {
          from: format(startOfDay(currentDate), 'yyyy-MM-dd'),
          to: format(endOfDay(addDays(currentDate, 29)), 'yyyy-MM-dd'),
        };
      default:
        return {
          from: format(startOfDay(currentDate), 'yyyy-MM-dd'),
          to: format(endOfDay(addDays(currentDate, 6)), 'yyyy-MM-dd'),
        };
    }
  }, [currentDate, dateRangeFilter]);
  
  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAllAppointments,
    updateStatus
  } = useManagerAppointments({ 
    initialFetch: true,
    filters: dateRange
  });

  // Fetch appointments when filters change
  useEffect(() => {
    fetchAllAppointments(dateRange);
  }, [dateRange]);

  const goToNextPeriod = () => {
    setCurrentDate(addDays(currentDate, dateRangeFilter === 'month' ? 30 : 7));
  };

  const goToPrevPeriod = () => {
    setCurrentDate(subDays(currentDate, dateRangeFilter === 'month' ? 30 : 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleStatusChange = async (appointmentId: number, status: string) => {
    try {
      await updateStatus(appointmentId, status);
      setNotification({
        type: 'success',
        message: `Appointment status updated to ${status}`
      });
      
      // Refresh appointments
      fetchAllAppointments(dateRange);
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: 'Failed to update appointment status'
      });
    }
  };

  const handleCreateWorkOrder = (appointmentId: number) => {
    navigate(`/manager/work-orders/create/${appointmentId}`);
  };

  const handleViewAppointment = (appointmentId: number) => {
    navigate(`/manager/appointments/${appointmentId}`);
  };

  const handleExportAppointments = () => {
    // TODO: Implement export functionality
    setNotification({
      type: 'success',
      message: 'Export functionality coming soon!'
    });
  };

  // Filter appointments based on search term and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      (appointment.vehicle?.make?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (appointment.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (appointment.vehicle?.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'primary';
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const appointmentTime = parseISO(appointment.appointmentDate);
    const isUpcoming = appointmentTime >= new Date();
    
    return (
      <div 
        key={appointment.appointmentId} 
        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => handleViewAppointment(appointment.appointmentId)}
      >
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{appointment.serviceType}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {format(appointmentTime, 'MMM d, yyyy')} at {format(appointmentTime, 'h:mm a')}
              </span>
              {isToday(appointmentTime) && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
          </div>
          <Badge
            label={appointment.status}
            variant={getStatusBadgeVariant(appointment.status)}
            size="md"
            rounded
          />
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <Car className="w-4 h-4 mr-1 mt-0.5 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Vehicle</div>
              <div className="text-sm text-gray-600">
                {appointment.vehicle ? (
                  <>
                    {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                  </>
                ) : (
                  <span className="text-gray-400">No vehicle information</span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {appointment.vehicle?.licensePlate || 'No license plate'}
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div>
              <div className="text-sm font-medium">Service Details</div>
              <div className="text-sm text-gray-600">
                Duration: {appointment.estimatedDuration || 0} minutes
              </div>
              <div className="text-sm text-gray-600">
                Estimated Cost: ${appointment.estimatedCost?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div className="flex space-x-2">
            {appointment.status === 'PENDING' && (
              <Button
                variant="outline"
                size="sm"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(appointment.appointmentId, 'CONFIRMED');
                }}
              >
                Confirm
              </Button>
            )}
            
            {appointment.status === 'CONFIRMED' && (
              <Button
                variant="outline"
                size="sm"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(appointment.appointmentId, 'IN_PROGRESS');
                }}
              >
                Start
              </Button>
            )}
            
            {appointment.status === 'IN_PROGRESS' && (
              <Button
                variant="outline"
                size="sm"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(appointment.appointmentId, 'COMPLETED');
                }}
              >
                Complete
              </Button>
            )}
          </div>
          
          {(appointment.status === 'CONFIRMED' || appointment.status === 'IN_PROGRESS') && (
            <Button
              variant="primary"
              size="sm"
              icon={<Clipboard className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleCreateWorkOrder(appointment.appointmentId);
              }}
            >
              Create Work Order
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Spinner size="lg" text="Loading appointments..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getDateRangeText = () => {
    switch (dateRangeFilter) {
      case 'today':
        return format(currentDate, 'MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">All Appointments</h1>
        <div className="flex mt-4 sm:mt-0 space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportAppointments}
          >
            Export
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'outline'}
            size="sm"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            icon={<List className="w-4 h-4" />}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          title={notification.type === 'success' ? 'Success' : 'Error'}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronLeft className="w-4 h-4" />}
                onClick={goToPrevPeriod}
              >
                Previous
              </Button>
              <div className="text-lg font-medium">{getDateRangeText()}</div>
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronRight className="w-4 h-4" />}
                onClick={goToNextPeriod}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Select
                  id="dateRangeFilter"
                  options={[
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                  ]}
                  value={dateRangeFilter}
                  onChange={(value) => setDateRangeFilter(value)}
                />
                
                <Select
                  id="statusFilter"
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'CONFIRMED', label: 'Confirmed' },
                    { value: 'IN_PROGRESS', label: 'In Progress' },
                    { value: 'COMPLETED', label: 'Completed' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                />
              </div>
            </div>
          </div>

          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appointment => renderAppointmentCard(appointment))
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No appointments found for the selected filters</p>
                </div>
              )}
            </div>
          )}

          {viewMode === 'calendar' && (
            <div className="text-center py-10 border rounded-lg">
              <Calendar className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Calendar view coming soon!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManagerAppointmentsPage; 