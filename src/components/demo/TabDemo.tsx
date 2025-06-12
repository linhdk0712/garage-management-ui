import React from 'react';
import { User, Car, Calendar, Settings, Star, Heart, Zap, Shield } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import BeautifulTabs, { BeautifulTab } from '../common/BeautifulTabs';
import { Card } from '../ui/card';

const TabDemo: React.FC = () => {
    const demoContent = {
        profile: (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <p className="text-slate-600">Manage your personal information and preferences.</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="font-medium">Name</p>
                        <p className="text-slate-600">John Doe</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="font-medium">Email</p>
                        <p className="text-slate-600">john@example.com</p>
                    </div>
                </div>
            </div>
        ),
        vehicles: (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">My Vehicles</h3>
                <p className="text-slate-600">View and manage your registered vehicles.</p>
                <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                        <p className="font-medium">2020 Toyota Camry</p>
                        <p className="text-slate-600">License: ABC-123</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <p className="font-medium">2018 Honda Civic</p>
                        <p className="text-slate-600">License: XYZ-789</p>
                    </div>
                </div>
            </div>
        ),
        appointments: (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Appointments</h3>
                <p className="text-slate-600">Schedule and manage your service appointments.</p>
                <div className="space-y-3">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-medium text-blue-800">Oil Change</p>
                        <p className="text-blue-600">Tomorrow at 10:00 AM</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800">Tire Rotation</p>
                        <p className="text-green-600">Next Week</p>
                    </div>
                </div>
            </div>
        ),
        settings: (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="text-slate-600">Configure your account preferences and notifications.</p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-slate-600">Receive updates via email</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-slate-600">Receive updates via SMS</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        ),
    };

    const beautifulTabsData: BeautifulTab[] = [
        {
            id: 'profile',
            label: 'Profile',
            icon: <User className="w-4 h-4" />,
            content: demoContent.profile,
        },
        {
            id: 'vehicles',
            label: 'Vehicles',
            icon: <Car className="w-4 h-4" />,
            content: demoContent.vehicles,
        },
        {
            id: 'appointments',
            label: 'Appointments',
            icon: <Calendar className="w-4 h-4" />,
            content: demoContent.appointments,
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <Settings className="w-4 h-4" />,
            content: demoContent.settings,
        },
    ];

    return (
        <div className="space-y-8 p-6">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">Beautiful Tab Components</h3>
                <p className="text-slate-600">Enhanced tab components with modern styling and smooth animations</p>
            </div>

            {/* ShadCN Tabs */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">ShadCN Enhanced Tabs</h2>
                <Tabs defaultValue="profile">
                    <TabsList>
                        <TabsTrigger value="profile">
                            <User className="w-4 h-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="vehicles">
                            <Car className="w-4 h-4" />
                            Vehicles
                        </TabsTrigger>
                        <TabsTrigger value="appointments">
                            <Calendar className="w-4 h-4" />
                            Appointments
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="w-4 h-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">{demoContent.profile}</TabsContent>
                    <TabsContent value="vehicles">{demoContent.vehicles}</TabsContent>
                    <TabsContent value="appointments">{demoContent.appointments}</TabsContent>
                    <TabsContent value="settings">{demoContent.settings}</TabsContent>
                </Tabs>
            </Card>

            {/* Beautiful Tabs - Glass Variant */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Beautiful Tabs - Glass Variant</h2>
                <BeautifulTabs
                    tabs={beautifulTabsData}
                    variant="glass"
                    defaultTabId="profile"
                />
            </Card>

            {/* Beautiful Tabs - Gradient Variant */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Beautiful Tabs - Gradient Variant</h2>
                <BeautifulTabs
                    tabs={beautifulTabsData}
                    variant="gradient"
                    defaultTabId="vehicles"
                />
            </Card>

            {/* Beautiful Tabs - Minimal Variant */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Beautiful Tabs - Minimal Variant</h2>
                <BeautifulTabs
                    tabs={beautifulTabsData}
                    variant="minimal"
                    defaultTabId="appointments"
                />
            </Card>

            {/* Beautiful Tabs - Elegant Variant */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Beautiful Tabs - Elegant Variant</h2>
                <BeautifulTabs
                    tabs={beautifulTabsData}
                    variant="elegant"
                    defaultTabId="settings"
                />
            </Card>

            {/* Feature Comparison */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Features & Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-green-600">Enhanced Styling</h3>
                        <ul className="space-y-2 text-slate-600">
                            <li className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                Glass morphism effects
                            </li>
                            <li className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                Gradient backgrounds
                            </li>
                            <li className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-500" />
                                Smooth animations
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold text-blue-600">User Experience</h3>
                        <ul className="space-y-2 text-slate-600">
                            <li className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                Better accessibility
                            </li>
                            <li className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-500" />
                                Hover effects
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-orange-500" />
                                Dark mode support
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TabDemo; 