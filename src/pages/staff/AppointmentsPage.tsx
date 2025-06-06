import React, { useState, useEffect } from 'react';
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
import useAppointments from '../../hooks/useAppointments';
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
  
  // Custom filter object for the useAppointments hook
  const dateRange = {
    from: format(startOfDay(currentDate), 'yyyy-MM-dd'),
    to: format(endOfDay(addDays(currentDate, 6)), 'yyyy-MM-dd'),
  };
  
  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAllAppointments, 
    updateAppointmentStatus 
  } = useAppointments({ 
    initialFetch: true,
    filters: dateRange
  });

  // Fetch appointments when date range changes
  useEffect(() => {
    fetchAllAppointments(dateRange);
  }, [currentDate, fetchAllAppointments]);

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
      await updateAppointmentStatus(appointmentId, { status });
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
      appointment.customerInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customerInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.vehicleInfo.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.vehicleInfo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.vehicleInfo.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                {appointment.customerInfo.firstName} {appointment.customerInfo.lastName}
              </div>
              <div className="text-sm text-gray-600">{appointment.customerInfo.phone}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Car className="w-4 h-4 mr-1 mt-0.5 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Vehicle</div>
              <div className="text-sm text-gray-600">
                {appointment.vehicleInfo.year} {appointment.vehicleInfo.make} {appointment.vehicleInfo.model}
              </div>
              <div className="text-sm text-gray-600">{appointment.vehicleInfo.licensePlate}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div className="flex space-x-2">
            {appointment.status === 'PENDING' && (
              <Button
                variant="outline"
                size="sm"
                icon={CheckCircle}
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
                icon={CheckCircle}
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
                icon={CheckCircle}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(appointment.appointmentId, 'COMPLETED');
                }}
              >
                Complete
              </Button>
            )}
          </div>
          
          {(appointment.status === 'CONFIRMED' || appointment.status === 'IN_PROGRESS') && !appointment.workOrder && (
            <Button
              variant="primary"
              size="sm"
              icon={Clipboard}
              onClick={(e) => {
                e.stopPropagation();
                handleCreateWorkOrder(appointment.appointmentId);
              }}
            >
              Create Work Order
            </Button>
          )}
          
          {appointment.workOrder && (
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/staff/work-orders/${appointment.workOrder.workOrderId}`);
              }}
            >
              View Work Order
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

  const weekStart = startOfWeek(currentDate);
  const dateRangeText = `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex mt-4 sm:mt-0">
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'outline'}
            size="sm"
            icon={Calendar}
            className="mr-2"
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            icon={List}
            onClick={() => setViewMode('list')}
          >
            List
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
                <AlertCircle className="h-5 w-5 text-red-400" />
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
            <div className="flex items-center space-x-4">
              <Button
                              variant="outline"
                              size="sm"
                              icon={ChevronLeft}
                              onClick={goToPrevPeriod} children={undefined}              />
              <div className="text-lg font-medium">{dateRangeText}</div>
              <Button
                              variant="outline"
                              size="sm"
                              icon={ChevronRight}
                              onClick={goToNextPeriod} children={undefined}              />
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>
            </div>
            
            <div className="flex mt-4 md:mt-0">
              <div className="relative mr-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-40">
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

          {viewMode === 'calendar' ? (
            <AppointmentCalendar />
          ) : (
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
        </div>
      </Card>
    </div>
  );
};

export default AppointmentsPage;