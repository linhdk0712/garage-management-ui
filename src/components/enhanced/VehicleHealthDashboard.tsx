import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wrench, Calendar, Activity } from 'lucide-react';
import { fetchVehicleHealth, fetchMaintenanceSchedule } from '../../api/vehicles';
import { HealthData, MaintenanceItem } from '../../types/vehicle.types';

interface VehicleHealthDashboardProps {
  vehicleId: number;
}

const VehicleHealthDashboard: React.FC<VehicleHealthDashboardProps> = ({ vehicleId }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'history'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [health, maintenance] = await Promise.all([
          fetchVehicleHealth(vehicleId),
          fetchMaintenanceSchedule(vehicleId)
        ]);
        
        setHealthData(health);
        setMaintenanceItems(maintenance);
      } catch (error) {
        console.error('Error fetching vehicle health data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [vehicleId]);

  const getHealthScore = () => {
    if (!healthData) return 0;
    // Calculate overall health score (0-100)
    return Math.round(
      (healthData.engine.score +
        healthData.transmission.score +
        healthData.brakes.score +
        healthData.suspension.score +
        healthData.electrical.score) / 5
    );
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMaintenanceStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'Overdue', class: 'bg-red-100 text-red-800' };
    if (diffDays <= 30) return { status: 'Due Soon', class: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Scheduled', class: 'bg-blue-100 text-blue-800' };
  };

  const healthScoreData = healthData
    ? [
        { name: 'Engine', score: healthData.engine.score },
        { name: 'Transmission', score: healthData.transmission.score },
        { name: 'Brakes', score: healthData.brakes.score },
        { name: 'Suspension', score: healthData.suspension.score },
        { name: 'Electrical', score: healthData.electrical.score },
      ]
    : [];

  const healthStatusPieData = [
    { name: 'Good', value: healthData?.componentsStatus.good || 0 },
    { name: 'Fair', value: healthData?.componentsStatus.fair || 0 },
    { name: 'Poor', value: healthData?.componentsStatus.poor || 0 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'maintenance'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('maintenance')}
        >
          Scheduled Maintenance
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'history'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Health History
        </button>
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Overall Health Score</h3>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex items-end">
                <div className={`text-5xl font-bold ${getStatusColor(getHealthScore())}`}>
                  {getHealthScore()}
                </div>
                <div className="text-lg text-gray-500 ml-1 mb-1">/100</div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {getHealthScore() >= 80
                  ? 'Vehicle is in excellent condition'
                  : getHealthScore() >= 60
                  ? 'Vehicle is in good condition, some maintenance recommended'
                  : 'Vehicle requires attention and service'}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Component Status</h3>
                <Wrench className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex items-center justify-around h-32">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {healthData?.componentsStatus.good || 0}
                  </div>
                  <div className="text-sm text-gray-600">Good</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {healthData?.componentsStatus.fair || 0}
                  </div>
                  <div className="text-sm text-gray-600">Fair</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {healthData?.componentsStatus.poor || 0}
                  </div>
                  <div className="text-sm text-gray-600">Poor</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-medium mb-4">Health by System</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={healthScoreData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar
                      dataKey="score"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      label={{ position: 'top', fill: '#6B7280', fontSize: 12 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-medium mb-4">Component Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthStatusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {healthStatusPieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div>
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="font-medium">Upcoming Maintenance</h3>
            </div>
            <div className="divide-y">
              {maintenanceItems.length > 0 ? (
                maintenanceItems.map((item, index) => {
                  const status = getMaintenanceStatus(item.dueDate);
                  return (
                    <div key={index} className="p-4 flex items-start">
                      <div className="mr-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.description}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Due on {new Date(item.dueDate).toLocaleDateString()}
                              {item.mileage && ` or at ${item.mileage.toLocaleString()} miles`}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${status.class}`}>
                            {status.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">{item.notes}</p>
                          <p className="text-sm font-medium text-blue-500 mt-2 cursor-pointer hover:text-blue-700">
                            Schedule this service
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No upcoming maintenance items scheduled
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-medium">Health Score History</h3>
          </div>
          <div className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={healthData?.historyData || []}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Your vehicle's health score has {' '}
                {healthData?.trending === 'up' 
                  ? 'improved by' 
                  : healthData?.trending === 'down' 
                    ? 'decreased by' 
                    : 'changed by'} {' '}
                {healthData?.changeSinceLastService || 0} points since your last service.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleHealthDashboard;