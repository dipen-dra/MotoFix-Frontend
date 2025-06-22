import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api'; // Assuming this is your configured Axios instance

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                // This API call will now work after fixing your backend routes
                const response = await api.get(`/admin/bookings/${id}`);
                setBooking(response.data.data); // Use response.data.data if your API wraps it
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    if (!booking) {
        return <div className="text-center mt-10">Booking not found.</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Booking Details</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">User Information</h2>
                        <div className="space-y-3 text-gray-600">
                            {/* FIX: Use 'customer' and optional chaining */}
                            <p><strong>Name:</strong> {booking.customer?.fullName || 'N/A'}</p>
                            <p><strong>Email:</strong> {booking.customer?.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {booking.customer?.phoneNumber || 'N/A'}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Booking Information</h2>
                        <div className="space-y-3 text-gray-600">
                            {/* FIX: Use 'serviceType' as it's a direct string */}
                            <p><strong>Service:</strong> {booking.serviceType || 'N/A'}</p>
                            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                            {/* Your schema doesn't have a 'time' field, so we use a fallback */}
                            <p><strong>Time:</strong> {booking.time || 'N/A'}</p>
                            <p><strong>Total Cost:</strong> रु{booking.totalCost}</p>
                            <p><strong>Status:</strong> <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>{booking.status}</span></p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Vehicle & Problem Details</h2>
                    <div className="bg-gray-100 p-4 rounded-lg space-y-3 text-gray-600">
                        {/* FIX: Use 'bikeModel' instead of 'vehicleDetails' */}
                        <p><strong>Vehicle Details:</strong> {booking.bikeModel || 'Not provided'}</p>
                        {/* FIX: Use 'notes' instead of 'problemDescription' */}
                        <p><strong>Problem Description:</strong> {booking.notes || 'Not provided'}</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/admin/dashboard" className="text-blue-500 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;