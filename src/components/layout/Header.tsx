import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Bell,
    User,
    LogOut,
    Settings,
    HelpCircle,
    Home,
    Calendar,
    Clipboard,
    Car,
    ShoppingBag,
    BarChart2,
    Users,
    CreditCard,
    FileText,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../common/Badge';
import FeatureGate from '../common/FeatureGate';

interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isActive: (path: string) => boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, isActive }) => (
    <Link
        to={to}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive(to)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
        <span className="mr-2">{icon}</span>
        {children}
    </Link>
);

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();

    const getProfileRoute = () => {
        if (user?.roles[0] === 'CUSTOMER') return '/customer/profile';
        if (user?.roles[0] === 'STAFF') return '/staff/profile';
        if (user?.roles[0] === 'MANAGER') return '/manager/profile';
        return '/profile';
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
        if (showNotifications) setShowNotifications(false);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (showUserMenu) setShowUserMenu(false);
    };

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const CustomerNavLinks = () => (
        <>
            <NavLink to="/" icon={<Home className="h-5 w-5" />} isActive={isActive}>Dashboard</NavLink>
            <FeatureGate feature="enableVehicleManagement">
                <NavLink to="/customer/vehicles" icon={<Car className="h-5 w-5" />} isActive={isActive}>My Vehicles</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableAppointments">
                <NavLink to="/customer/appointments" icon={<Calendar className="h-5 w-5" />} isActive={isActive}>Appointments</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableRepairHistory">
                <NavLink to="/customer/repair-history" icon={<Clipboard className="h-5 w-5" />} isActive={isActive}>Repair History</NavLink>
            </FeatureGate>
            <FeatureGate feature="enablePayments">
                <NavLink to="/customer/payments" icon={<CreditCard className="h-5 w-5" />} isActive={isActive}>Payments</NavLink>
            </FeatureGate>
        </>
    );

    const StaffNavLinks = () => (
        <>
            <NavLink to="/" icon={<Home className="h-5 w-5" />} isActive={isActive}>Dashboard</NavLink>
            <FeatureGate feature="enableAppointments">
                <NavLink to="/staff/appointments" icon={<Calendar className="h-5 w-5" />} isActive={isActive}>Appointments</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableWorkOrders">
                <NavLink to="/staff/work-orders" icon={<Clipboard className="h-5 w-5" />} isActive={isActive}>Work Orders</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableVehicleManagement">
                <NavLink to="/staff/vehicles" icon={<Car className="h-5 w-5" />} isActive={isActive}>Vehicles</NavLink>
            </FeatureGate>
        </>
    );

    const ManagerNavLinks = () => (
        <>
            <NavLink to="/" icon={<Home className="h-5 w-5" />} isActive={isActive}>Dashboard</NavLink>
            <FeatureGate feature="enableAppointments">
                <NavLink to="/manager/appointments" icon={<Calendar className="h-5 w-5" />} isActive={isActive}>Appointments</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableVehicleManagement">
                <NavLink to="/manager/vehicles" icon={<Car className="h-5 w-5" />} isActive={isActive}>Vehicles</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableWorkOrders">
                <NavLink to="/manager/work-orders" icon={<Clipboard className="h-5 w-5" />} isActive={isActive}>Work Orders</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableCustomerManagement">
                <NavLink to="/manager/customers" icon={<Users className="h-5 w-5" />} isActive={isActive}>Customers</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableInventory">
                <NavLink to="/manager/inventory" icon={<ShoppingBag className="h-5 w-5" />} isActive={isActive}>Inventory</NavLink>
            </FeatureGate>
            <FeatureGate feature="enablePurchaseOrders">
                <NavLink to="/manager/purchase-orders" icon={<FileText className="h-5 w-5" />} isActive={isActive}>Purchase Orders</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableStaffManagement">
                <NavLink to="/manager/staff" icon={<Users className="h-5 w-5" />} isActive={isActive}>Staff Management</NavLink>
            </FeatureGate>
            <FeatureGate feature="enableReports">
                <NavLink to="/manager/reports" icon={<BarChart2 className="h-5 w-5" />} isActive={isActive}>Reports</NavLink>
            </FeatureGate>
        </>
    );

    const renderNavLinks = () => {
        if (!user) return null;

        switch (user.roles[0]) {
            case 'CUSTOMER':
                return <CustomerNavLinks />;
            case 'STAFF':
                return <StaffNavLinks />;
            case 'MANAGER':
                return <ManagerNavLinks />;
            default:
                return <NavLink to="/" icon={<Home className="h-5 w-5" />} isActive={isActive}>Dashboard</NavLink>;
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="ml-2 text-lg font-semibold text-gray-900">
                                Garage Management System
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-1 ml-8">
                            {renderNavLinks()}
                        </nav>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center">
                        {/* Notifications */}
                        <FeatureGate feature="enableNotifications">
                            <div className="relative">
                                <button
                                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={toggleNotifications}
                                >
                                    <span className="sr-only">View notifications</span>
                                    <Bell className="h-6 w-6" />
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                                </button>

                                {/* Notifications dropdown */}
                                {showNotifications && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-2 px-4 border-b border-gray-200">
                                            <h3 className="text-sm font-medium">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                                                        <Bell className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div className="ml-3 w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900">New appointment scheduled</p>
                                                        <p className="text-sm text-gray-500">John Doe scheduled a repair for tomorrow at 2:00 PM</p>
                                                        <p className="mt-1 text-xs text-gray-500">10 minutes ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                                                        <Bell className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div className="ml-3 w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Work order #1234 completed</p>
                                                        <p className="text-sm text-gray-500">Staff member Mike finished the repair</p>
                                                        <p className="mt-1 text-xs text-gray-500">1 hour ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2 px-4 text-center text-sm">
                                                <Link to="/notifications" className="text-blue-600 hover:text-blue-800 font-medium">
                                                    View all notifications
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FeatureGate>

                        {/* User profile */}
                        <div className="relative ml-4">
                            <button
                                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={toggleUserMenu}
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <span className="ml-2 font-medium text-gray-700 hidden md:block">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <Badge
                                    label={user?.roles[0] ?? 'USER'}
                                    variant="primary"
                                    size="sm"
                                    rounded
                                    className="ml-2 hidden md:flex"
                                />
                            </button>

                            {/* User dropdown */}
                            {showUserMenu && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <Link
                                            to={getProfileRoute()}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <User className="mr-3 h-4 w-4 text-gray-500" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Settings className="mr-3 h-4 w-4 text-gray-500" />
                                            Settings
                                        </Link>
                                        <Link
                                            to="/help"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                                            Help & Support
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="mr-3 h-4 w-4 text-red-500" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;