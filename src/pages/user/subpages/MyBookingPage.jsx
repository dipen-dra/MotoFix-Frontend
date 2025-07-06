import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Bike } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import StatusBadge from '../../../components/ui/Statusbadge';

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchBookings = async (page) => {
        setIsLoading(true);
        try {
            const response = await apiFetchUser(`/bookings?page=${page}&limit=10`);
            const data = await response.json();
            setBookings(data.data || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch your bookings.');
            setBookings([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(currentPage);
    }, [currentPage]);

    const handleDelete = async () => {
        if (!bookingToDelete) return;
        try {
            await apiFetchUser(`/bookings/${bookingToDelete}`, { method: 'DELETE' });
            toast.success('Booking cancelled successfully.');
            setBookingToDelete(null);
            fetchBookings(currentPage); // Refresh the list
        } catch (error) {
            toast.error(error.message || "Failed to cancel booking.");
        }
    };

    return (
        <div className="space-y-6 flex flex-col flex-grow">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Bookings</h1>
                <Button onClick={() => window.location.hash = '#/user/new-booking'}><PlusCircle size={20} />New Booking</Button>
            </div>
            <Card className="flex flex-col flex-grow">
                <div className="overflow-x-auto flex-grow">
                    {isLoading ? (<div className="text-center p-12 text-gray-500 dark:text-gray-400">Loading...</div>) : bookings.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Service</th><th className="p-3">Bike</th><th className="p-3">Date</th>
                                    <th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3 text-right">Cost</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="p-3"><StatusBadge status={booking.status} /></td>
                                        <td className="p-3"><StatusBadge status={booking.paymentStatus} /></td>
                                        <td className="p-3 text-right font-semibold">
                                            {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
                                            रु{booking.finalAmount ?? booking.totalCost}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => window.location.hash = `#/user/edit-booking/${booking._id}`} disabled={booking.status !== 'Pending' || booking.isPaid || booking.discountApplied}><Edit size={16} /></Button>
                                                <Button variant="danger" size="sm" onClick={() => setBookingToDelete(booking._id)} disabled={booking.isPaid}><Trash2 size={16} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <Bike size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-xl font-semibold">No Bookings Found</h3>
                            <p className="mt-1 text-sm text-gray-500">You haven't booked any services yet.</p>
                        </div>
                    )}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </Card>
            <ConfirmationModal isOpen={!!bookingToDelete} onClose={() => setBookingToDelete(null)} onConfirm={handleDelete} title="Cancel Booking" message="Are you sure you want to cancel this booking? This action cannot be undone." confirmText="Yes, Cancel" />
        </div>
    );
};

export default UserBookingsPage;