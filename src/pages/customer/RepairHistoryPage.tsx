import React from 'react';
import RepairHistoryList from '../../components/customer/repairs/RepairHistoryList';

const RepairHistoryPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Repair History</h3>
            </div>

            <RepairHistoryList />
        </div>
    );
};

export default RepairHistoryPage;