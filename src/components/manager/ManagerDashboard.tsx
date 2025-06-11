import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart2,
    Calendar,
    ShoppingBag,
    Users,
    CreditCard,
    Clipboard,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Filter
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { fetchDashboardStats } from '../../api/reports';
import { fetchLowStockItems } from '../../api/inventory';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Select from '../common/Select';
import Spinner from '../common/Spinner';
import PerformanceAnalytics from '../enhanced/PerformanceAnalytics';
import { SparePart } from '../../types/inventory.types';
interface DashboardStats {
    revenue: {
        today: number;
        yesterday: number;
        thisWeek: number;
        lastWeek: number;
        thisMonth: number;
        lastMonth: number;
        changePercentage: number;
    };
    customers: {
        new: number;
        active: number;
        total: number;
        changePercentage: number;
    };
    appointments: {
        today: number;
        pending: number;
        confirmed: number;
        inProgress: number;
        completed: number;
        cancelled: number;
    };
    workOrders: {
        open: number;
        completed: number;
        changePercentage: number;
    };
    inventory: {
        lowStockCount: number;
        totalValue: number;
        mostUsedParts: Array<{ name: string; count: number }>;
    };
    servicesByType: Array<{ name: string; value: number }>;
    revenueByDay: Array<{ name: string; value: number }>;
    staffPerformance: Array<{ name: string; completed: number; hours: number }>;
}

const ManagerDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [lowStockItems, setLowStockItems] = useState<Array<SparePart>>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [statsResponse, inventoryResponse] = await Promise.all([
                    fetchDashboardStats({ period: timeRange }),
                    fetchLowStockItems()
                ]);

                const statsData = (statsResponse as any)?.data || statsResponse;
                setStats(statsData as DashboardStats);
                setLowStockItems(inventoryResponse.data.content || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value as 'week' | 'month' | 'quarter');
    };

    const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#6B7280'];

    if (isLoading || !stats) {
        return <Spinner size="lg" text="Loading dashboard..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manager Dashboard</h1>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <Select
                            options={[
                                { value: 'week', label: 'Last Week' },
                                { value: 'month', label: 'Last Month' },
                                { value: 'quarter', label: 'Last Quarter' },
                            ]}
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                        />
                    </div>
                    <Button
                        variant="primary"
                        icon={<BarChart2 className="h-4 w-4" />}
                        onClick={() => navigate('/manager/reports')}
                    >
                        View All Reports
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Revenue</p>
                            <p className="text-2xl font-bold">${stats.revenue.thisWeek.toLocaleString()}</p>
                            <div className="mt-1 flex items-center text-sm">
                                {stats.revenue.changePercentage > 0 ? (
                                    <>
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-600">+{stats.revenue.changePercentage}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                        <span className="text-red-600">{stats.revenue.changePercentage}%</span>
                                    </>
                                )}
                                <span className="text-gray-500 ml-1">vs last period</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Customers</p>
                            <p className="text-2xl font-bold">{stats.customers.active}</p>
                            <div className="mt-1 flex items-center text-sm">
                                <span className="text-green-600">+{stats.customers.new}</span>
                                <span className="text-gray-500 ml-1">new this period</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Work Orders</p>
                            <p className="text-2xl font-bold">{stats.workOrders.open}</p>
                            <div className="mt-1 flex items-center text-sm">
                                <span className="text-green-600">{stats.workOrders.completed}</span>
                                <span className="text-gray-500 ml-1">completed</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Clipboard className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Inventory Value</p>
                            <p className="text-2xl font-bold">${stats.inventory.totalValue.toLocaleString()}</p>
                            <div className="mt-1 flex items-center text-sm">
                <span className={stats.inventory.lowStockCount > 0 ? "text-red-600" : "text-green-600"}>
                  {stats.inventory.lowStockCount} items
                </span>
                                <span className="text-gray-500 ml-1">low in stock</span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <ShoppingBag className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Revenue Trend" className="bg-white">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.revenueByDay}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                <Bar dataKey="value" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Services by Type" className="bg-white">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.servicesByType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.servicesByType.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} services`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card
                    title="Today's Appointments"
                    className="bg-white lg:col-span-1"
                    footer={
                        <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate('/manager/appointments')}
                        >
                            View All Appointments
                        </Button>
                    }
                >
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <Badge label={`Total: ${stats.appointments.today}`} variant="primary" size="sm" />
                            <div className="flex space-x-2">
                                <Badge label={`Pending: ${stats.appointments.pending}`} variant="warning" size="sm" />
                                <Badge label={`Confirmed: ${stats.appointments.confirmed}`} variant="info" size="sm" />
                            </div>
                        </div>

                        <div className="h-60 overflow-y-auto">
                            {stats.appointments.today > 0 ? (
                                [1, 2, 3, 4, 5].map((id) => (
                                    <div
                                        key={id}
                                        className="p-3 border rounded-lg mb-2 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/manager/appointments/${id}`)}
                                    >
                                        <div className="flex justify-between">
                                            <p className="font-medium">John Doe</p>
                                            <Badge
                                                label={id % 2 === 0 ? "Confirmed" : "Pending"}
                                                variant={id % 2 === 0 ? "info" : "warning"}
                                                size="sm"
                                                rounded
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600">Oil Change & Filter</p>
                                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                                            <span>Toyota Camry (ABC-123)</span>
                                            <span>2:30 PM</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-gray-500">No appointments for today</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card
                    title="Low Stock Items"
                    className="bg-white lg:col-span-1"
                    footer={
                        <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate('/manager/inventory')}
                        >
                            Manage Inventory
                        </Button>
                    }
                >
                    <div>
                        {stats.inventory.lowStockCount > 0 ? (
                            <div className="mb-3">
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertTriangle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">
                                                {stats.inventory.lowStockCount} items are below minimum stock level
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className="h-60 overflow-y-auto">
                            {lowStockItems.length > 0 ? (
                                lowStockItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border rounded-lg mb-2 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/manager/inventory/${item.partId}`)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">{item.category}</p>
                                            </div>
                                            <Badge
                                                label="Low Stock"
                                                variant="danger"
                                                size="sm"
                                            />
                                        </div>
                                        <div className="mt-2 flex justify-between text-sm">
                                            <span className="text-gray-600">In Stock: <strong className="text-red-600">{item.quantityInStock}</strong></span>
                                            <span className="text-gray-600">Min Level: {item.minimumStockLevel}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-gray-500">All items have adequate stock</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card
                    title="Staff Performance"
                    className="bg-white lg:col-span-1"
                    footer={
                        <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate('/manager/staff')}
                        >
                            View Staff Details
                        </Button>
                    }
                >
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.staffPerformance}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        value,
                                        name === 'completed' ? 'Completed Orders' : 'Hours Worked'
                                    ]}
                                />
                                <Legend />
                                <Bar dataKey="completed" name="Completed Orders" fill="#3B82F6" />
                                <Bar dataKey="hours" name="Hours Worked" fill="#8B5CF6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Analytics Dashboard */}
            <Card title="Performance Analytics">
                <PerformanceAnalytics />
            </Card>
        </div>
    );
};

export default ManagerDashboard;