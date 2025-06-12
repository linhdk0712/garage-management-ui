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
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive(to)
                ? 'bg-[#D5BDAF] text-[#3D2C2E] border border-[#D5BDAF]'
                : 'text-[#6B5B47] hover:bg-[#E3D5CA] hover:text-[#5A4A42]'
        }`}
    >
        <span className="mr-3">{icon}</span>
        {children}
    </Link>
);

interface NavLinksProps {
    isActive: (path: string) => boolean;
}

const CustomerNavLinks: React.FC<NavLinksProps> = ({ isActive }) => (
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

const StaffNavLinks: React.FC<NavLinksProps> = ({ isActive }) => (
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

const ManagerNavLinks: React.FC<NavLinksProps> = ({ isActive }) => (
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

    const renderNavLinks = () => {
        if (!user) return null;

        switch (user.roles[0]) {
            case 'CUSTOMER':
                return <CustomerNavLinks isActive={isActive} />;
            case 'STAFF':
                return <StaffNavLinks isActive={isActive} />;
            case 'MANAGER':
                return <ManagerNavLinks isActive={isActive} />;
            default:
                return <NavLink to="/" icon={<Home className="h-5 w-5" />} isActive={isActive}>Dashboard</NavLink>;
        }
    };

    return (
        <header className="bg-[#EDEDE9] border-b border-[#D6CCC2] sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-semibold text-[#3D2C2E]">
                                Garage Management
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-2 ml-8">
                            {renderNavLinks()}
                        </nav>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <FeatureGate feature="enableNotifications">
                            <div className="relative">
                                <button
                                    className="p-2 rounded-lg text-[#6B5B47] hover:text-[#5A4A42] hover:bg-[#E3D5CA] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2 transition-colors duration-200"
                                    onClick={toggleNotifications}
                                    title="View notifications"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[#D5BDAF]"></span>
                                </button>

                                {/* Notifications dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 rounded-lg border border-[#D6CCC2] bg-[#EDEDE9] shadow-lg">
                                        <div className="py-3 px-4 border-b border-[#D6CCC2]">
                                            <h3 className="text-sm font-medium text-[#3D2C2E]">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            <div className="py-3 px-4 border-b border-[#E3D5CA] hover:bg-[#E3D5CA] transition-colors duration-200">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 bg-[#D5BDAF] rounded-full p-1">
                                                        <Bell className="h-4 w-4 text-[#3D2C2E]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#3D2C2E]">New appointment scheduled</p>
                                                        <p className="text-sm text-[#6B5B47] mt-1">John Doe scheduled a repair for tomorrow at 2:00 PM</p>
                                                        <p className="text-xs text-[#8B7355] mt-1">10 minutes ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-3 px-4 border-b border-[#E3D5CA] hover:bg-[#E3D5CA] transition-colors duration-200">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 bg-[#D5BDAF] rounded-full p-1">
                                                        <Bell className="h-4 w-4 text-[#3D2C2E]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#3D2C2E]">Work order #1234 completed</p>
                                                        <p className="text-sm text-[#6B5B47] mt-1">Staff member Mike finished the repair</p>
                                                        <p className="text-xs text-[#8B7355] mt-1">1 hour ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-3 px-4 text-center">
                                                <Link to="/notifications" className="text-[#8B7355] hover:text-[#6B5B47] font-medium text-sm">
                                                    View all notifications
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FeatureGate>

                        {/* User profile */}
                        <div className="relative">
                            <button
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#E3D5CA] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2 transition-colors duration-200"
                                onClick={toggleUserMenu}
                                title="Open user menu"
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-[#D6CCC2] flex items-center justify-center text-[#6B5B47]">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-[#5A4A42] hidden md:block text-sm">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <Badge
                                    label={user?.roles[0] ?? 'USER'}
                                    variant="primary"
                                    size="sm"
                                    rounded
                                    className="hidden md:flex"
                                />
                            </button>

                            {/* User dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#D6CCC2] bg-[#EDEDE9] shadow-lg">
                                    <div className="py-2">
                                        <Link
                                            to={getProfileRoute()}
                                            className="flex items-center px-4 py-2 text-sm text-[#5A4A42] hover:bg-[#E3D5CA] transition-colors duration-200"
                                            title="Profile"
                                        >
                                            <User className="mr-3 h-4 w-4 text-[#6B5B47]" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-[#5A4A42] hover:bg-[#E3D5CA] transition-colors duration-200"
                                            title="Settings"
                                        >
                                            <Settings className="mr-3 h-4 w-4 text-[#6B5B47]" />
                                            Settings
                                        </Link>
                                        <Link
                                            to="/help"
                                            className="flex items-center px-4 py-2 text-sm text-[#5A4A42] hover:bg-[#E3D5CA] transition-colors duration-200"
                                            title="Help & Support"
                                        >
                                            <HelpCircle className="mr-3 h-4 w-4 text-[#6B5B47]" />
                                            Help & Support
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-[#8B7355] hover:bg-[#E3D5CA] transition-colors duration-200"
                                            title="Sign out"
                                        >
                                            <LogOut className="mr-3 h-4 w-4 text-[#8B7355]" />
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