import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, User } from 'lucide-react';
import { addVehicle } from '../../api/vehicles';
import { fetchAllCustomers } from '../../api/customers';
import { VehicleFormData } from '../../types/vehicle.types';
import { CustomerProfile } from '../../types/customer.types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Select from '../../components/common/Select';
import Spinner from '../../components/common/Spinner';
import Notification from '../../components/common/Notification';

interface AddVehicleFormData extends VehicleFormData {
    customerId: number;
}

const AddVehiclePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [customersLoading, setCustomersLoading] = useState(true);
    
    const [formData, setFormData] = useState<AddVehicleFormData>({
        customerId: 0,
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        vin: '',
        color: '',
        mileage: 0
    });

    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    // Fetch customers for the dropdown
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setCustomersLoading(true);
                const response = await fetchAllCustomers();
                if (response?.content) {
                    setCustomers(response.content || []);
                }
            } catch (err) {
                console.error('Error fetching customers:', err);
                setError('Failed to load customers. Please try again.');
            } finally {
                setCustomersLoading(false);
            }
        };

        loadCustomers();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string | undefined } = {};

        if (!formData.customerId || formData.customerId === 0) {
            newErrors.customerId = 'Customer is required';
        }

        if (!formData.make.trim()) {
            newErrors.make = 'Make is required';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Model is required';
        }

        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Please enter a valid year';
        }

        if (!formData.licensePlate.trim()) {
            newErrors.licensePlate = 'License plate is required';
        }

        if (formData.mileage < 0) {
            newErrors.mileage = 'Mileage cannot be negative';
        }

        // VIN validation (optional field)
        if (formData.vin?.trim() && formData.vin.length !== 17) {
            newErrors.vin = 'VIN must be 17 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof AddVehicleFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleNumberInputChange = (field: 'year' | 'mileage' | 'customerId', value: string) => {
        const numValue = parseInt(value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: numValue
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Remove customerId from the data sent to the API
            const { customerId, ...vehicleData } = formData;
            
            await addVehicle(vehicleData);
            
            setSuccess('Vehicle added successfully!');
            
            // Redirect to vehicles page after a short delay
            setTimeout(() => {
                navigate('/manager/vehicles');
            }, 1500);
            
        } catch (err) {
            console.error('Error adding vehicle:', err);
            
            let errorMessage = 'Failed to add vehicle. Please try again.';
            
            if (err instanceof Error) {
                if (err.message.includes('409') || err.message.includes('Conflict')) {
                    errorMessage = 'A vehicle with this license plate already exists.';
                } else if (err.message.includes('400') || err.message.includes('Bad Request')) {
                    errorMessage = 'Please check your input and try again.';
                } else if (err.message.includes('Network Error') || err.message.includes('ECONNREFUSED')) {
                    errorMessage = 'Unable to connect to server. Please check your internet connection.';
                } else {
                    errorMessage = `Error: ${err.message}`;
                }
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/manager/vehicles');
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

    const popularMakes = [
        'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
        'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Jeep',
        'Dodge', 'Chrysler', 'Lexus', 'Acura', 'Infiniti', 'Volvo', 'Porsche',
        'Jaguar', 'Land Rover', 'Mini', 'Fiat', 'Alfa Romeo', 'Mitsubishi',
        'Suzuki', 'Scion', 'Saturn', 'Pontiac', 'Oldsmobile', 'Buick', 'Cadillac',
        'Lincoln', 'Mercury', 'Plymouth', 'Eagle', 'Saab', 'Isuzu', 'Daewoo'
    ];

    const popularColors = [
        'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow',
        'Orange', 'Purple', 'Brown', 'Beige', 'Gold', 'Bronze', 'Pink', 'Teal'
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Vehicles
                    </Button>
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Car className="w-6 h-6" />
                            Add New Vehicle
                        </h3>
                        <p className="text-gray-600">Register a new vehicle in the system</p>
                    </div>
                </div>

                {/* Notifications */}
                {error && (
                    <Notification
                        type="error"
                        title="Error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

                {success && (
                    <Notification
                        type="success"
                        title="Success"
                        message={success}
                        onClose={() => setSuccess(null)}
                    />
                )}

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Selection */}
                            <div className="md:col-span-2">
                                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Customer *
                                </label>
                                <Select
                                    id="customer"
                                    value={formData.customerId?.toString() || '0'}
                                    onChange={(value: string) => handleNumberInputChange('customerId', value)}
                                    options={[
                                        { value: '0', label: 'Select a customer...' },
                                        ...customers.map(customer => ({
                                            value: customer.userId?.toString() || '0',
                                            label: `${customer.firstName} ${customer.lastName} - ${customer.email}`
                                        }))
                                    ]}
                                    disabled={customersLoading}
                                    className={errors.customerId ? 'border-red-500' : ''}
                                />
                                {errors.customerId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
                                )}
                                {customersLoading && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Spinner size="sm" />
                                        <span className="text-sm text-gray-500">Loading customers...</span>
                                    </div>
                                )}
                            </div>

                            {/* Make */}
                            <div>
                                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                                    Make *
                                </label>
                                <Select
                                    id="make"
                                    value={formData.make}
                                    onChange={(value: string) => handleInputChange('make', value)}
                                    options={[
                                        { value: '', label: 'Select make...' },
                                        ...popularMakes.map(make => ({ value: make, label: make })),
                                        { value: 'Other', label: 'Other' }
                                    ]}
                                    className={errors.make ? 'border-red-500' : ''}
                                />
                                {errors.make && (
                                    <p className="text-red-500 text-sm mt-1">{errors.make}</p>
                                )}
                            </div>

                            {/* Model */}
                            <div>
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                                    Model *
                                </label>
                                <Input
                                    id="model"
                                    type="text"
                                    value={formData.model}
                                    onChange={(e) => handleInputChange('model', e.target.value)}
                                    placeholder="e.g., Camry, Accord, F-150"
                                    className={errors.model ? 'border-red-500' : ''}
                                />
                                {errors.model && (
                                    <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                                )}
                            </div>

                            {/* Year */}
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                    Year *
                                </label>
                                <Select
                                    id="year"
                                    value={formData.year?.toString() || ''}
                                    onChange={(value: string) => handleNumberInputChange('year', value)}
                                    options={yearOptions.map(year => ({ value: year.toString(), label: year.toString() }))}
                                    className={errors.year ? 'border-red-500' : ''}
                                />
                                {errors.year && (
                                    <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                                )}
                            </div>

                            {/* License Plate */}
                            <div>
                                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
                                    License Plate *
                                </label>
                                <Input
                                    id="licensePlate"
                                    type="text"
                                    value={formData.licensePlate}
                                    onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                                    placeholder="e.g., ABC-123"
                                    className={errors.licensePlate ? 'border-red-500' : ''}
                                />
                                {errors.licensePlate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>
                                )}
                            </div>

                            {/* VIN */}
                            <div>
                                <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
                                    VIN (Optional)
                                </label>
                                <Input
                                    id="vin"
                                    type="text"
                                    value={formData.vin || ''}
                                    onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                                    placeholder="17-character VIN"
                                    maxLength={17}
                                    className={errors.vin ? 'border-red-500' : ''}
                                />
                                {errors.vin && (
                                    <p className="text-red-500 text-sm mt-1">{errors.vin}</p>
                                )}
                            </div>

                            {/* Color */}
                            <div>
                                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                                    Color
                                </label>
                                <Select
                                    id="color"
                                    value={formData.color || ''}
                                    onChange={(value: string) => handleInputChange('color', value)}
                                    options={[
                                        { value: '', label: 'Select color...' },
                                        ...popularColors.map(color => ({ value: color, label: color })),
                                        { value: 'Other', label: 'Other' }
                                    ]}
                                />
                            </div>

                            {/* Mileage */}
                            <div>
                                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Mileage
                                </label>
                                <Input
                                    id="mileage"
                                    type="number"
                                    value={formData.mileage || ''}
                                    onChange={(e) => handleNumberInputChange('mileage', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className={errors.mileage ? 'border-red-500' : ''}
                                />
                                {errors.mileage && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading || customersLoading}
                                className="flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" />
                                        Adding Vehicle...
                                    </>
                                ) : (
                                    <>
                                        <Car className="w-4 h-4" />
                                        Add Vehicle
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AddVehiclePage; 