import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { fetchCustomerVehicles, deleteVehicle } from '../../api/vehicles';
import { Vehicle } from '../../types/vehicle.types';
import { Button } from '../../components/ui/button';
import { toast } from 'react-hot-toast';

const VehiclesPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loadVehicles = async () => {
        try {
            setIsLoading(true);
            const data = await fetchCustomerVehicles();
            setVehicles(data.data?.content || []);
        } catch (error) {
            console.error('Error loading vehicles:', error);
            toast.error('Failed to load vehicles');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const handleDelete = async (vehicleId: number) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) {
            return;
        }

        try {
            await deleteVehicle(vehicleId);
            toast.success('Vehicle deleted successfully');
            loadVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Failed to delete vehicle');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
                <Button
                    variant="primary"
                    onClick={() => navigate('/customer/vehicles/add')}
                    icon={<Plus className="w-4 h-4" />}
                >
                    Add Vehicle
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    License Plate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Year
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.vehicleId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {vehicle.make} {vehicle.model}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{vehicle.licensePlate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{vehicle.year}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                console.log('Edit button clicked for vehicle:', vehicle);
                                                console.log('Vehicle ID:', vehicle.vehicleId);
                                                navigate(`/customer/vehicles/edit/${vehicle.vehicleId}`);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vehicle.vehicleId)}
                                            className="text-red-600 hover:text-red-900"
                                            aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VehiclesPage; 