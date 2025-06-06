import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { fetchVehicleDetails } from '../../api/vehicles';
import { Vehicle } from '../../types/vehicle.types';
import VehicleForm from '../../components/customer/vehicles/VehicleForm';

const EditVehiclePage: React.FC = () => {
    const params = useParams<{ vehicleId: string }>();
    const { vehicleId } = params;
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('URL Parameters:', params); // Log all URL parameters at component level

        const loadVehicle = async () => {
            try {
                setIsLoading(true);
                console.log('Loading vehicle with ID:', vehicleId); // Debug log

                if (!vehicleId) {
                    console.error('No vehicle ID provided in URL');
                    toast.error('Vehicle ID is required');
                    navigate('/customer/vehicles');
                    return;
                }

                const parsedId = parseInt(vehicleId, 10);
                console.log('Parsed vehicle ID:', parsedId); // Debug log

                if (isNaN(parsedId)) {
                    console.error('Invalid vehicle ID format:', vehicleId);
                    toast.error('Invalid vehicle ID');
                    navigate('/customer/vehicles');
                    return;
                }

                if (parsedId <= 0) {
                    console.error('Invalid vehicle ID value:', parsedId);
                    toast.error('Invalid vehicle ID');
                    navigate('/customer/vehicles');
                    return;
                }

                const vehicleData = await fetchVehicleDetails(parsedId);
                console.log('Fetched vehicle data:', vehicleData); // Debug log
                setVehicle(vehicleData);
            } catch (error) {
                console.error('Error loading vehicle:', error);
                toast.error(error instanceof Error ? error.message : 'Failed to load vehicle details');
                navigate('/customer/vehicles');
            } finally {
                setIsLoading(false);
            }
        };

        loadVehicle();
    }, [vehicleId, navigate, params]);

    const handleClose = () => {
        navigate('/customer/vehicles');
    };

    const handleSuccess = () => {
        toast.success('Vehicle updated successfully');
        navigate('/customer/vehicles');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Not Found</h2>
                    <p className="text-gray-600 mb-4">The vehicle you're looking for could not be found.</p>
                    <button
                        onClick={() => navigate('/customer/vehicles')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Vehicles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Vehicle</h2>
                <p className="text-gray-600 mb-6">Update your vehicle information below.</p>
                <VehicleForm
                    onClose={handleClose}
                    mode="edit"
                    vehicleId={vehicle.vehicleId}
                    onSuccess={handleSuccess}
                    initialData={vehicle}
                />
            </div>
        </div>
    );
};

export default EditVehiclePage; 