import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, Wrench, Gift, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/Statusbadge';

const UserDashboardPage = () => {
    const [stats, setStats] = useState({ upcomingBookings: 0, completedServices: 0, loyaltyPoints: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await apiFetchUser('/dashboard-summary');
                const data = await response.json();
                setStats({
                    upcomingBookings: data.data.upcomingBookings,
                    completedServices: data.data.completedServices,
                    loyaltyPoints: data.data.loyaltyPoints || 0
                });
                setRecentBookings(data.data.recentBookings || []);
            } catch (error) {
                toast.error(error.message || "Failed to fetch dashboard summary.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="text-center p-12">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:border-blue-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><CalendarDays className="text-blue-600 dark:text-blue-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Upcoming Bookings</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.upcomingBookings}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-green-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><Wrench className="text-green-600 dark:text-green-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Completed Services</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedServices}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-purple-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full"><Gift className="text-purple-600 dark:text-purple-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Loyalty Points</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.loyaltyPoints}</p>
                        </div>
                    </div>
                </Card>
                <a href="#/user/new-booking" className="md:col-span-1">
                    <Card className="h-full flex flex-col items-center justify-center text-center bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 border-2 border-dashed border-blue-400 hover:border-blue-600">
                        <PlusCircle className="text-blue-600 dark:text-blue-400 mb-2" size={32} />
                        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Book a New Service</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get your bike checked</p>
                    </Card>
                </a>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
                <div className="overflow-x-auto">
                    {recentBookings.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Service</th><th className="p-3">Bike Model</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map(booking => (
                                    <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="p-3"><StatusBadge status={booking.status} /></td>
                                        <td className="p-3 text-right font-medium text-gray-900 dark:text-white">रु{booking.finalAmount ?? booking.totalCost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">You have no recent bookings.</p>
                            <Button className="mt-4" onClick={() => window.location.hash = '#/user/new-booking'}>
                                Book Your First Service
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default UserDashboardPage;