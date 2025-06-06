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
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Tabs from '../../components/common/Tabs';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';
import AppointmentForm from '../../components/customer/appointments/AppointmentForm';
import { Appointment } from '../../types/appointment.types';
import AppointmentList from '../../components/customer/appointments/AppointmentList';
import Modal from '../../components/common/Modal';
import { cancelAppointment } from '../../api/appointments';

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
      await cancelAppointment(appointmentId);
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

  const getStatusColor = (status: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
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
                    {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model} ({appointment.vehicle.licensePlate})
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge
                  label={appointment.status}
                  variant={getStatusColor(appointment.status)}
                  size="md"
                  rounded
                />
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
        <Notification
          type="error"
          title="Error"
          message={error}
          onClose={() => {}}
        />
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
        <Notification
          type={notification.type}
          title={notification.type === 'success' ? 'Success' : 'Error'}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {vehicles.length === 0 ? (
        <Card>{noVehiclesMessage}</Card>
      ) : (
        <Card>
          <Tabs
            tabs={[
              {
                id: 'upcoming',
                label: `Upcoming (${upcomingAppointments.length})`,
                content: renderAppointmentList(upcomingAppointments),
              },
              {
                id: 'inProgress',
                label: `In Progress (${inProgressAppointments.length})`,
                content: renderAppointmentList(inProgressAppointments),
              },
              {
                id: 'past',
                label: `Past (${pastAppointments.length})`,
                content: renderAppointmentList(pastAppointments),
              },
            ]}
            defaultTabId="upcoming"
          />
        </Card>
      )}

      <AppointmentList onEditAppointment={handleEditAppointment} />

      {/* Add Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title="Schedule New Appointment"
      >
        <AppointmentForm
          onClose={handleCloseModal}
          mode="add"
        />
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={!!editingAppointment}
        onClose={handleCloseModal}
        title="Edit Appointment"
      >
        <AppointmentForm
          onClose={handleCloseModal}
          mode="edit"
          appointmentId={editingAppointment!}
        />
      </Modal>
    </div>
  );
};

export default AppointmentsPage;