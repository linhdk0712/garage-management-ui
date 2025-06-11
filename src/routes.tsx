import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Customer Pages
import CustomerProfilePage from './pages/customer/ProfilePage';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CustomerVehiclesPage from './pages/customer/VehiclesPage';
import CustomerRepairHistoryPage from './pages/customer/RepairHistoryPage';
import CustomerAppointmentsPage from './pages/customer/AppointmentsPage';


// Manager Pages
import ManagerDashboard from './components/manager/ManagerDashboard';
import ProfilePage from './pages/ProfilePage';
import CreateStaffPage from './pages/manager/CreateStaffPage';
import CustomersPage from './pages/manager/CustomersPage';
import StaffManagementPage from './pages/manager/StaffManagementPage';
import VehiclesPage from './pages/manager/VehiclesPage';

// Protected route wrapper component
import ProtectedRoute from './components/auth/ProtectedRoute';
import AddVehiclePage from './pages/customer/AddVehiclePage';
import EditVehiclePage from './pages/customer/EditVehiclePage';
import AppointmentsPage from './pages/manager/AppointmentsPage';
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Authentication Routes */}
            <Route path="/auth/:authType" element={<AuthPage />} />

            {/* Main Application Routes */}
            <Route element={<Layout />}>
                {/* Root redirect to dashboard */}
                <Route index element={<DashboardPage />} />

                {/* Customer Routes */}
                <Route
                    path="customer/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="customer/profile"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <CustomerProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="customer/vehicles"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <CustomerVehiclesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="customer/vehicles/add"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <AddVehiclePage />
                        </ProtectedRoute>
                    }
                />
                  <Route
                    path="customer/vehicles/edit/:vehicleId"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <EditVehiclePage />
                        </ProtectedRoute>
                    }
                />
                 <Route
                    path="customer/repair-history"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <CustomerRepairHistoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="customer/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <CustomerAppointmentsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Staff Routes */}
                <Route
                    path="staff/profile"
                    element={
                        <ProtectedRoute allowedRoles={['STAFF']}>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Manager Routes */}
                <Route
                    path="manager/profile"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER']}>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="manager/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER']}>
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="manager/staff/new"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER']}>
                            <CreateStaffPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="manager/customers"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER']}>
                            <CustomersPage />
                        </ProtectedRoute>
                    }
                />
                 <Route
                    path="manager/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER']}>
                            <AppointmentsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="manager/staff"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER']}>
                            <StaffManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="manager/vehicles"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER']}>
                            <VehiclesPage />
                        </ProtectedRoute>
                    }
                />

                {/* Not Found Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Catch-all route for any undefined routes */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;