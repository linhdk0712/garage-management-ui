import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  AlertCircle,
  User,
} from 'lucide-react';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Notification from '../../components/common/Notification';
import Modal from '../../components/common/Modal';
import { Staff } from '../../types/staff.types';
import { ROUTES } from '../../config/routes';
import { fetchAllStaff } from '../../api/staff';

const StaffManagementPage: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await fetchAllStaff(ROUTES.manager.staff);
            setStaff(response.content || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch staff data');
            console.error('Error fetching staff:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditStaff = (staffId: number) => {
        navigate(`/manager/staff/${staffId}/edit`);
    };

    const handleDeleteClick = (staff: Staff) => {
        setSelectedStaff(staff);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedStaff) return;

        try {
            await fetchStaff(); // Refresh the list
            setDeleteDialogOpen(false);
            setSelectedStaff(null);
            setNotification({
                type: 'success',
                message: 'Staff member deleted successfully'
            });
        } catch (err) {
            setNotification({
                type: 'error',
                message: 'Failed to delete staff member'
            });
            console.error('Error deleting staff:', err);
        }
    };

    const handleAddStaff = () => {
        navigate('/manager/staff/new');
    };

    const getRoleBadgeVariant = (role: string): 'primary' | 'secondary' => {
        return role === 'MANAGER' ? 'primary' : 'secondary';
    };

    const getStatusBadgeVariant = (status: string): 'success' | 'danger' => {
        return status === 'ACTIVE' ? 'success' : 'danger';
    };

    const filteredStaff = staff.filter(member => 
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Spinner size="lg" text="Loading staff data..." />;
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-bold">Staff Management</h3>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={handleAddStaff}
                >
                    Add New Staff
                </Button>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.type === 'success' ? 'Success' : 'Error'}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <Card>
                <div className="p-4">
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((staffMember) => (
                                        <tr key={staffMember.staffId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <User className="h-10 w-10 text-gray-400" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {staffMember.firstName} {staffMember.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{staffMember.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{staffMember.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    label={staffMember.position}
                                                    variant={getRoleBadgeVariant(staffMember.position)}
                                                    size="md"
                                                    rounded
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    label={staffMember.employmentStatus}
                                                    variant={getStatusBadgeVariant(staffMember.employmentStatus)}
                                                    size="md"
                                                    rounded
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        icon={<Edit className="w-4 h-4" />}
                                                        onClick={() => handleEditStaff(staffMember.staffId)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        icon={<Trash2 className="w-4 h-4" />}
                                                        onClick={() => handleDeleteClick(staffMember)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center">
                                            <User className="w-12 h-12 mx-auto text-gray-400" />
                                            <p className="mt-2 text-gray-500">No staff members found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                title="Confirm Delete"
            >
                <div className="p-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete {selectedStaff?.firstName} {selectedStaff?.lastName}? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StaffManagementPage; 