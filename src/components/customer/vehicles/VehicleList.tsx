import React from 'react';
import { Car, Edit2, Trash2 } from 'lucide-react';
import Spinner from '../../common/Spinner';
import Button from '../../common/Button';
import useVehicles from '../../../hooks/useVehicles';

interface VehicleListProps {
    onEditVehicle: (vehicleId: number) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ onEditVehicle }) => {
    const {
        vehicles,
        isLoading,
        error,
        fetchVehicles,
        removeVehicle
    } = useVehicles();

    const handleDelete = async (vehicleId: number) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) {
            return;
        }

        try {
            await removeVehicle(vehicleId);
        } catch (err) {
            console.error('Error deleting vehicle:', err);
        }
    };

    if (isLoading) {
        return <Spinner size="lg" text="Loading vehicles..." />;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchVehicles} variant="primary">
                    Try Again
                </Button>
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <div className="text-center py-8">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new vehicle.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
                <div
                    key={vehicle.vehicleId}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {vehicle.year} • {vehicle.licensePlate}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditVehicle(vehicle.vehicleId)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(vehicle.vehicleId)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">VIN:</span> {vehicle.vin || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Color:</span> {vehicle.color || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()} miles
                        </p>
                        {vehicle.lastServiceDate && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Last Service:</span>{' '}
                                {new Date(vehicle.lastServiceDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VehicleList; 