import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    DollarSign,
    Users,
    Clock,
    Calendar,
    Filter
} from 'lucide-react';
import { fetchPerformanceAnalytics } from '../../api/reports';

interface AnalyticsData {
    revenue: {
        daily: { date: string; amount: number }[];
        weekly: { week: string; amount: number }[];
        monthly: { month: string; amount: number }[];
    };
    customers: {
        newCustomers: number;
        returningCustomers: number;
        customerSatisfaction: number;
        customersByService: { service: string; count: number }[];
    };
    repairs: {
        totalRepairs: number;
        avgCompletionTime: number;
        repairsByType: { type: string; count: number }[];
        repairStatus: { status: string; count: number }[];
    };
    inventory: {
        partsUsage: { part: string; count: number }[];
        lowStockItems: number;
        inventoryValue: number;
    };
    staffPerformance: {
        staffUtilization: { staff: string; utilization: number }[];
        avgTimePerRepair: { staff: string; time: number }[];
    };
}

const PerformanceAnalytics: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');
    const [revenueView, setRevenueView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchPerformanceAnalytics({ period: dateRange });
                const data = (response as any)?.data || response;
                // Ensure the data has the expected structure with default values
                const normalizedData: AnalyticsData = {
                    revenue: {
                        daily: (data as any)?.revenue?.daily || [],
                        weekly: (data as any)?.revenue?.weekly || [],
                        monthly: (data as any)?.revenue?.monthly || []
                    },
                    customers: {
                        newCustomers: (data as any)?.customers?.newCustomers || 0,
                        returningCustomers: (data as any)?.customers?.returningCustomers || 0,
                        customerSatisfaction: (data as any)?.customers?.customerSatisfaction || 0,
                        customersByService: (data as any)?.customers?.customersByService || []
                    },
                    repairs: {
                        totalRepairs: (data as any)?.repairs?.totalRepairs || 0,
                        avgCompletionTime: (data as any)?.repairs?.avgCompletionTime || 0,
                        repairsByType: (data as any)?.repairs?.repairsByType || [],
                        repairStatus: (data as any)?.repairs?.repairStatus || []
                    },
                    inventory: {
                        partsUsage: (data as any)?.inventory?.partsUsage || [],
                        lowStockItems: (data as any)?.inventory?.lowStockItems || 0,
                        inventoryValue: (data as any)?.inventory?.inventoryValue || 0
                    },
                    staffPerformance: {
                        staffUtilization: (data as any)?.staffPerformance?.staffUtilization || [],
                        avgTimePerRepair: (data as any)?.staffPerformance?.avgTimePerRepair || []
                    }
                };
                setAnalyticsData(normalizedData);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
                // Set default data structure on error
                setAnalyticsData({
                    revenue: { daily: [], weekly: [], monthly: [] },
                    customers: { newCustomers: 0, returningCustomers: 0, customerSatisfaction: 0, customersByService: [] },
                    repairs: { totalRepairs: 0, avgCompletionTime: 0, repairsByType: [], repairStatus: [] },
                    inventory: { partsUsage: [], lowStockItems: 0, inventoryValue: 0 },
                    staffPerformance: { staffUtilization: [], avgTimePerRepair: [] }
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const getRevenueData = () => {
        if (!analyticsData) return [];

        switch (revenueView) {
            case 'daily':
                return analyticsData.revenue.daily || [];
            case 'weekly':
                return analyticsData.revenue.weekly || [];
            case 'monthly':
                return analyticsData.revenue.monthly || [];
            default:
                return analyticsData.revenue.weekly || [];
        }
    };

    const getRevenueDataKey = () => {
        switch (revenueView) {
            case 'daily':
                return 'date';
            case 'weekly':
                return 'week';
            case 'monthly':
                return 'month';
            default:
                return 'week';
        }
    };

    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return 100;
        return ((current - previous) / previous) * 100;
    };

   

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    if (isLoading || !analyticsData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Performance Analytics Dashboard</h2>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-white" />
                        <select
                            className="bg-white bg-opacity-20 text-white text-sm rounded-md border-0 px-3 py-1.5 focus:outline-none"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'quarter')}
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="quarter">Last Quarter</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold">${(analyticsData.revenue.weekly || []).reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</p>
                                <div className="flex items-center text-sm">
                  <span className={`${
                      (analyticsData.revenue.weekly || []).length > 1 && 
                      calculateChange(
                          (analyticsData.revenue.weekly || [])[(analyticsData.revenue.weekly || []).length - 1]?.amount || 0,
                          (analyticsData.revenue.weekly || [])[0]?.amount || 0
                      ) > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                  }`}>
                    {calculateChange(
                        (analyticsData.revenue.weekly || [])[(analyticsData.revenue.weekly || []).length - 1]?.amount || 0,
                        (analyticsData.revenue.weekly || [])[0]?.amount || 0
                    ).toFixed(1)}%
                  </span>
                                    <span className="text-gray-500 ml-1">vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">New Customers</p>
                                <p className="text-2xl font-bold">{analyticsData.customers.newCustomers}</p>
                                <div className="flex items-center text-sm">
                                    <span className="text-green-500">+12.5%</span>
                                    <span className="text-gray-500 ml-1">vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Avg. Completion Time</p>
                                <p className="text-2xl font-bold">{analyticsData.repairs.avgCompletionTime} hrs</p>
                                <div className="flex items-center text-sm">
                                    <span className="text-red-500">+3.2%</span>
                                    <span className="text-gray-500 ml-1">vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Repairs</p>
                                <p className="text-2xl font-bold">{analyticsData.repairs.totalRepairs}</p>
                                <div className="flex items-center text-sm">
                                    <span className="text-green-500">+8.3%</span>
                                    <span className="text-gray-500 ml-1">vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-lg border p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Revenue Trend</h3>
                        <div className="flex space-x-2">
                            <button
                                className={`px-2 py-1 text-xs rounded-md ${
                                    revenueView === 'daily'
                                        ? 'bg-blue-100 text-blue-600 font-medium'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                onClick={() => setRevenueView('daily')}
                            >
                                Daily
                            </button>
                            <button
                                className={`px-2 py-1 text-xs rounded-md ${
                                    revenueView === 'weekly'
                                        ? 'bg-blue-100 text-blue-600 font-medium'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                onClick={() => setRevenueView('weekly')}
                            >
                                Weekly
                            </button>
                            <button
                                className={`px-2 py-1 text-xs rounded-md ${
                                    revenueView === 'monthly'
                                        ? 'bg-blue-100 text-blue-600 font-medium'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                onClick={() => setRevenueView('monthly')}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={getRevenueData()}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={getRevenueDataKey()} />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                    name="Revenue"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Repairs by Service Type</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={analyticsData.repairs.repairsByType || []}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    barSize={20}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#3B82F6"
                                        name="Repairs"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Repair Status Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData.repairs.repairStatus || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="status"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {(analyticsData.repairs.repairStatus || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name, props) => [`${value} repairs`, props.payload.status]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Staff Performance */}
                <div className="bg-white rounded-lg border p-4 mb-6">
                    <h3 className="text-lg font-medium mb-4">Staff Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={analyticsData.staffPerformance.avgTimePerRepair || []}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                barSize={20}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="staff" type="category" width={100} />
                                <Tooltip formatter={(value) => [`${value} hours`, 'Avg. Time Per Repair']} />
                                <Legend />
                                <Bar
                                    dataKey="time"
                                    fill="#8B5CF6"
                                    name="Avg. Time Per Repair"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Customer Service Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData.customers.customersByService || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="service"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {(analyticsData.customers.customersByService || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name, props) => [`${value} customers`, props.payload.service]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Most Used Parts</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={analyticsData.inventory.partsUsage || []}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="part" type="category" width={120} />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#10B981"
                                        name="Usage Count"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceAnalytics;