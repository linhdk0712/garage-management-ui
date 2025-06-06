import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign, Wrench, Car } from 'lucide-react';
import { RepairHistory } from '../../../types/repair.types';
import { fetchRepairHistory } from '../../../api/repairs';


const RepairHistoryList: React.FC = () => {
    const [repairs, setRepairs] = useState<RepairHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRepairHistory();
    }, []);

    const loadRepairHistory = async () => {
        try {
            setIsLoading(true);
            const data = await fetchRepairHistory();
            setRepairs(data);
        } catch (err) {
            setError('Failed to load repair history. Please try again later.');
            console.error('Error loading repair history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
            </div>
        );
    }

    if (repairs.length === 0) {
        return (
            <div className="text-center py-8">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No repair history</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't had any repairs yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {repairs.map((repair) => (
                <div
                    key={repair.repairId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {repair.vehicle.make} {repair.vehicle.model}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(repair.status)}`}>
                                    {repair.status}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{repair.description}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                                ${repair.totalCost.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">Total Cost</p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{new Date(repair.repairDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{repair.duration} hours</span>
                        </div>
                        <div className="flex items-center">
                            <Wrench className="h-4 w-4 mr-2" />
                            <span>{repair.serviceType}</span>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>${repair.laborCost.toFixed(2)} labor</span>
                        </div>
                    </div>

                    {repair.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                            <p className="mt-1 text-sm text-gray-500">{repair.notes}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RepairHistoryList; 