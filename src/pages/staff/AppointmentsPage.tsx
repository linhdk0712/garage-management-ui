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
  ArrowRight
} from 'lucide-react';
import useStaffAppointments from '../../hooks/useStaffAppointments';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import AppointmentCalendar from '../../components/staff/AppointmentCalendar';
import { Appointment } from '../../types/appointment.types';
import { format, addDays, subDays, startOfWeek, startOfDay, endOfDay, parseISO, isToday } from 'date-fns';

const AppointmentsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const navigate = useNavigate();
  
  // Memoize the date range to prevent unnecessary re-renders
  const dateRange = useMemo(() => ({
    from: format(startOfDay(currentDate), 'yyyy-MM-dd'),
    to: format(endOfDay(addDays(currentDate, 6)), 'yyyy-MM-dd'),
  }), [currentDate]);
  
  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAllAppointments, 
    updateStatus
  } = useStaffAppointments({ 
    initialFetch: true,
    filters: dateRange
  });

  // Fetch appointments when date range changes
  useEffect(() => {
    fetchAllAppointments(dateRange);
  }, [dateRange]);

  const goToNextPeriod = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const goToPrevPeriod = () => {
    setCurrentDate(subDays(currentDate, 7));
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
    navigate(`/staff/work-orders/create/${appointmentId}`);
  };

  const handleViewAppointment = (appointmentId: number) => {
    navigate(`/staff/appointments/${appointmentId}`);
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
            <User className="w-4 h-4 mr-1 mt-0.5 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Customer</div>
              <div className="text-sm text-gray-600">
                <span className="text-gray-400">Customer information not available</span>
              </div>
              <div className="text-sm text-gray-600">
                Customer ID: {appointment.vehicle?.customerId || 'N/A'}
              </div>
            </div>
          </div>
          
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
    const weekStart = startOfWeek(currentDate);
    return `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Staff Appointments</h1>
        <div className="flex mt-4 sm:mt-0 space-x-2">
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
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{notification.message}</p>
            </div>
          </div>
        </div>
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
            <AppointmentCalendar />
          )}
        </div>
      </Card>
    </div>
  );
};

export default AppointmentsPage;