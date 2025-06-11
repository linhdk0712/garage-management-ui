import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { AppointmentFormData } from '../../../types/appointment.types';
import { scheduleAppointment, updateAppointment, fetchAppointmentDetails } from '../../../api/appointments';
import { fetchAllVehicles } from '../../../api/vehicles';
import { Vehicle } from '../../../types/vehicle.types';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Select from '../../common/Select';
import { ROUTES } from '../../../config/routes';

interface AppointmentFormProps {
    onClose: () => void;
    mode: 'add' | 'edit';
    appointmentId?: number;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onClose, mode, appointmentId }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AppointmentFormData>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const loadAppointment = useCallback(async () => {
        try {
            setIsLoading(true);
            const appointment = await fetchAppointmentDetails(ROUTES.customer.appointments, appointmentId!);
            reset({
                vehicleId: appointment.vehicle?.vehicleId || 0,
                serviceType: appointment.serviceType,
                description: appointment.description,
                appointmentDate: appointment.appointmentDate,
                estimatedDuration: appointment.estimatedDuration,
                estimatedCost: appointment.estimatedCost,
                notes: appointment.notes,
            });
        } catch (err) {
            setError('Failed to load appointment details. Please try again later.');
            console.error('Error loading appointment:', err);
        } finally {
            setIsLoading(false);
        }
    }, [appointmentId, reset]);

    useEffect(() => {
        loadVehicles();
        if (mode === 'edit' && appointmentId) {
            loadAppointment();
        }
    }, [mode, appointmentId, loadAppointment]);

    const loadVehicles = async () => {
        try {
            const data = await fetchAllVehicles();
            setVehicles(data.data.content || []);
        } catch (err) {
            console.error('Error loading vehicles:', err);
            setError('Failed to load vehicles. Please try again later.');
        }
    };

    const onSubmit = async (data: AppointmentFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            if (mode === 'add') {
                await scheduleAppointment(ROUTES.customer.appointments, data);
            } else if (appointmentId) {
                await updateAppointment(ROUTES.customer.appointments, data);
            }

            onClose();
        } catch (err) {
            setError(mode === 'add' 
                ? 'Failed to create appointment. Please try again later.'
                : 'Failed to update appointment. Please try again later.'
            );
            console.error(`Error ${mode}ing appointment:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    if (mode === 'edit' && isLoading) {
        return <div className="text-center py-4">Loading appointment details...</div>;
    }

    return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-[1400px] mx-auto">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Select
                    label="Vehicle"
                    id="vehicleId"
                    options={vehicles.map(vehicle => ({
                        value: vehicle.vehicleId.toString(),
                        label: `${vehicle.make} ${vehicle.model}`
                    }))}
                    onChange={(value) => {
                        const event = { target: { value, name: 'vehicleId' } };
                        register('vehicleId').onChange(event);
                    }}
                    error={errors.vehicleId?.message}
                />

                <Input
                    label="Service Type"
                    id="serviceType"
                    {...register('serviceType', { required: 'Service type is required' })}
                    error={errors.serviceType?.message}
                />

                <Input
                    label="Appointment Date"
                    id="appointmentDate"
                    type="datetime-local"
                    {...register('appointmentDate', { required: 'Appointment date is required' })}
                    error={errors.appointmentDate?.message}
                />

                <Input
                    label="Estimated Duration (hours)"
                    id="estimatedDuration"
                    type="number"
                    step="0.5"
                    min="0.5"
                    {...register('estimatedDuration', {
                        required: 'Estimated duration is required',
                        min: { value: 0.5, message: 'Duration must be at least 0.5 hours' }
                    })}
                    error={errors.estimatedDuration?.message}
                />

                <Input
                    label="Estimated Cost"
                    id="estimatedCost"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('estimatedCost', {
                        required: 'Estimated cost is required',
                        min: { value: 0, message: 'Cost cannot be negative' }
                    })}
                    error={errors.estimatedCost?.message}
                />

                <Input
                    label="Description"
                    id="description"
                    {...register('description', { required: 'Description is required' })}
                    error={errors.description?.message}
                />

                <Input
                    label="Notes (Optional)"
                    id="notes"
                    {...register('notes')}
                    error={errors.notes?.message}
                />
            </div>

            <div className="flex justify-end space-x-3">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                >
                    {mode === 'add' ? 'Schedule Appointment' : 'Update Appointment'}
                </Button>
            </div>
        </form>
    );
};

export default AppointmentForm; 