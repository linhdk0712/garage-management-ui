import React from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleForm from '../../components/customer/vehicles/VehicleForm';

const AddVehiclePage: React.FC = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/customer/vehicles');
    };

    const handleSuccess = () => {
        navigate('/customer/vehicles');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Please fill in the details of your vehicle below.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <VehicleForm
                    onClose={handleClose}
                    mode="add"
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    );
};

export default AddVehiclePage; 