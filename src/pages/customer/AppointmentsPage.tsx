import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Car
} from 'lucide-react';
import useAppointments from '../../hooks/useAppointments';
import useVehicles from '../../hooks/useVehicles';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import Spinner from '../../components/common/Spinner';
import AppointmentForm from '../../components/customer/appointments/AppointmentForm';
import { Appointment } from '../../types/appointment.types';
import AppointmentList from '../../components/customer/appointments/AppointmentList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { cancelAppointment } from '../../api/appointments';
import { ROUTES } from '../../config/routes';

const AppointmentsPage: React.FC = () => {
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const { appointments, isLoading, error, fetchAllAppointments } = useAppointments({ initialFetch: true });
  const { vehicles, isLoading: vehiclesLoading } = useVehicles({ initialFetch: true });
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<number | null>(null);
  
  const upcomingAppointments = appointments.filter(
    appointment => ['PENDING', 'CONFIRMED'].includes(appointment.status)
  );
  
  const pastAppointments = appointments.filter(
    appointment => ['COMPLETED', 'CANCELLED'].includes(appointment.status)
  );
  
  const inProgressAppointments = appointments.filter(
    appointment => appointment.status === 'IN_PROGRESS'
  );

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await cancelAppointment(ROUTES.customer.appointments, appointmentId);
      setNotification({
        type: 'success',
        message: 'Appointment cancelled successfully.'
      });
      // Refresh the list
      fetchAllAppointments();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to cancel appointment. Please try again.'
      });
    }
  };

  
  const handleViewDetails = (appointmentId: number) => {
    navigate(`/customer/appointments/${appointmentId}`);
  };

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'default';
      case 'IN_PROGRESS':
        return 'default';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleAddAppointment = () => {
    setIsAddModalOpen(true);
  };

  const handleEditAppointment = (appointmentId: number) => {
    setEditingAppointment(appointmentId);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingAppointment(null);
  };

  const renderAppointmentList = (appointmentList: Appointment[]) => {
    if (appointmentList.length === 0) {
      return (
        <div className="text-center py-10">
          <Calendar className="w-12 h-12 mx-auto text-gray-500" />
          <p className="mt-2 text-gray-700">No appointments found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {appointmentList.map((appointment) => (
          <button
            key={appointment.appointmentId}
            className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleViewDetails(appointment.appointmentId)}
            type="button"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{appointment.serviceType}</h3>
                <div className="flex items-center mt-1 text-gray-700">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-gray-700">
                  <Car className="w-4 h-4 mr-1" />
                  <span>
                    {appointment.vehicle ? (
                      <>
                        {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model} ({appointment.vehicle.licensePlate})
                      </>
                    ) : (
                      <span className="text-gray-400">No vehicle information</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge
                  variant={getStatusColor(appointment.status)}
                >
                  {appointment.status}
                </Badge>
                {appointment.status === 'PENDING' && (
                  <button
                    className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelAppointment(appointment.appointmentId);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  if (isLoading || vehiclesLoading) {
    return <Spinner size="lg" text="Loading appointments..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const noVehiclesMessage = (
    <div className="text-center py-10">
      <Car className="w-12 h-12 mx-auto text-gray-500" />
      <p className="mt-2 text-gray-700">You need to register a vehicle before scheduling appointments</p>
      <Button
        variant="primary"
        className="mt-4"
        onClick={() => navigate('/customer/vehicles')}
      >
        Register a Vehicle
      </Button>
    </div>
  );

  const scheduleButton = (
    <Button 
      variant="primary" 
      icon={<Plus className="w-5 h-5" />}
      onClick={handleAddAppointment}
      disabled={vehicles.length === 0}
    >
      Schedule Appointment
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        {scheduleButton}
      </div>

      {notification && (
        <div className={`p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.type === 'success' ? 'Success' : 'Error'}
              </h3>
              <div className="mt-2 text-sm text-gray-700">
                <p>{notification.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {vehicles.length === 0 ? (
        <Card>{noVehiclesMessage}</Card>
      ) : (
        <Card>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress ({inProgressAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              {renderAppointmentList(upcomingAppointments)}
            </TabsContent>
            <TabsContent value="inProgress">
              {renderAppointmentList(inProgressAppointments)}
            </TabsContent>
            <TabsContent value="past">
              {renderAppointmentList(pastAppointments)}
            </TabsContent>
          </Tabs>
        </Card>
      )}

      <AppointmentList onEditAppointment={handleEditAppointment} />

      {/* Add Appointment Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={handleCloseModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <DialogContent className="col-span-4">
                <AppointmentForm
                  onClose={handleCloseModal}
                  mode="add"
                />
              </DialogContent>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Modal */}
      <Dialog
        open={!!editingAppointment}
        onOpenChange={handleCloseModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <DialogContent className="col-span-4">
                <AppointmentForm
                  onClose={handleCloseModal}
                  mode="edit"
                  appointmentId={editingAppointment!}
                />
              </DialogContent>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage;