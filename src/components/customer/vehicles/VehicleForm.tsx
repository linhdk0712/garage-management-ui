import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema, VehicleFormData } from '../../../lib/validations';
import { Vehicle } from '../../../types/vehicle.types';
import { addVehicle, updateVehicle, fetchVehicleDetails } from '../../../api/vehicles';
import { extractValidationErrors, isValidationError } from '../../../utils/errorHandler';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { Plus } from 'lucide-react';
import { AxiosError } from 'axios';

interface VehicleFormProps {
    onClose: () => void;
    mode: 'add' | 'edit';
    vehicleId?: number;
    onSuccess?: () => void;
    initialData?: Vehicle;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onClose, mode, vehicleId, onSuccess, initialData }) => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            licensePlate: '',
            vin: '',
            color: '',
            mileage: 0,
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const loadVehicle = useCallback(async () => {
        try {
            setIsLoading(true);
            if (!vehicleId) {
                throw new Error('Vehicle ID is required');
            }
            const vehicle = await fetchVehicleDetails(vehicleId);
            reset({
                vehicleId: vehicle.vehicleId,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                licensePlate: vehicle.licensePlate,
                vin: vehicle.vin || '',
                color: vehicle.color || '',
                mileage: vehicle.mileage,
            });
        } catch (err) {
            setGeneralError('Failed to load vehicle details. Please try again later.');
            console.error('Error loading vehicle:', err);
        } finally {
            setIsLoading(false);
        }
    }, [vehicleId, reset]);

    useEffect(() => {
        if (mode === 'edit' && vehicleId) {
            if (initialData) {
                reset({
                    vehicleId: initialData.vehicleId,
                    make: initialData.make,
                    model: initialData.model,
                    year: initialData.year,
                    licensePlate: initialData.licensePlate,
                    vin: initialData.vin || '',
                    color: initialData.color || '',
                    mileage: initialData.mileage,
                });
            } else {
                loadVehicle();
            }
        }
    }, [mode, vehicleId, initialData, loadVehicle, reset]);

    const onSubmit = async (data: VehicleFormData) => {
        try {
            setIsLoading(true);
            setGeneralError(null);

            if (mode === 'add') {
                await addVehicle(data);
            } else if (vehicleId) {
                await updateVehicle(vehicleId, data);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            if (err instanceof AxiosError && isValidationError(err)) {
                const validationErrors = extractValidationErrors(err);
                Object.entries(validationErrors).forEach(([field, message]) => {
                    if (field !== 'general') {
                        setError(field as keyof VehicleFormData, { message });
                    }
                });
                if (validationErrors.general) {
                    setGeneralError(validationErrors.general);
                }
            } else {
                setGeneralError(mode === 'add' 
                    ? 'Failed to add vehicle. Please try again later.'
                    : 'Failed to update vehicle. Please try again later.'
                );
            }
            console.error(`Error ${mode}ing vehicle:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    if (mode === 'edit' && isLoading && !initialData) {
        return <div className="text-center py-4 text-gray-700">Loading vehicle details...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {generalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {generalError}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                    label="Make"
                    id="make"
                    {...register('make')}
                    error={errors.make?.message}
                />

                <Input
                    label="Model"
                    id="model"
                    {...register('model')}
                    error={errors.model?.message}
                />

                <Input
                    label="Year"
                    id="year"
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    error={errors.year?.message}
                />

                <Input
                    label="License Plate"
                    id="licensePlate"
                    {...register('licensePlate')}
                    error={errors.licensePlate?.message}
                />

                <Input
                    label="VIN (Optional)"
                    id="vin"
                    {...register('vin')}
                    error={errors.vin?.message}
                />

                <Input
                    label="Color (Optional)"
                    id="color"
                    {...register('color')}
                    error={errors.color?.message}
                />

                <Input
                    label="Mileage"
                    id="mileage"
                    type="number"
                    {...register('mileage', { valueAsNumber: true })}
                    error={errors.mileage?.message}
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
                    icon={<Plus className="w-4 h-4" />}
                >
                    {mode === 'add' ? 'Add Vehicle' : 'Update Vehicle'}
                </Button>
            </div>
        </form>
    );
};

export default VehicleForm; 