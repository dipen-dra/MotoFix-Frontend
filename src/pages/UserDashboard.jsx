import React, { useState, useEffect, useRef } from 'react';
import { BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, CalendarDays, User, LogOut, Menu, X, Sun, Moon, PlusCircle, Bike, Wrench, Edit, Trash2, AlertTriangle, Camera, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';


const API_BASE_URL_USER = "http://localhost:5050/api/user";

const apiFetchUser = async (endpoint, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL_USER}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An API error occurred.');
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return;
};


const getStatusColor = (status) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'Paid': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
        case 'COD': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        case 'Khalti': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'eSewa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${className}`}>{children}</div>);
const StatusBadge = ({ status }) => (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>{status}</span>);
const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
    };
    return (<button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
};
const Input = React.forwardRef(({ id, label, ...props }, ref) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input id={id} {...props} ref={ref} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600" />
    </div>
));
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmButtonVariant = 'danger', Icon = AlertTriangle, iconColor = 'text-red-600 dark:text-red-400', iconBgColor = 'bg-red-100 dark:bg-red-900/50' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <Card className="w-full max-w-md">
                <div className="text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                    <div className="mt-2 px-7 py-3"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div>
                    <div className="flex justify-center gap-3 mt-4">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button variant={confirmButtonVariant} onClick={onConfirm}>{confirmText}</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};


const UserDashboardPage = () => {
    const [stats, setStats] = useState({ upcomingBookings: 0, completedServices: 0 });
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiFetchUser('/dashboard-summary');
                const data = response.data;
                setStats({
                    upcomingBookings: data.upcomingBookings,
                    completedServices: data.completedServices
                });
                setRecentBookings(data.recentBookings || []);
            } catch (error) {
                console.error("Failed to fetch dashboard summary:", error);
                toast.error(error.message || "Failed to fetch dashboard summary.");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 hover:border-blue-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><CalendarDays className="text-blue-600 dark:text-blue-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Upcoming Bookings</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.upcomingBookings}</p>
                        </div>
                    </div>
                </Card>
                <Card className="md:col-span-1 hover:border-green-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><Wrench className="text-green-600 dark:text-green-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Completed Services</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedServices}</p>
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
                                        <td className="p-3 text-right font-medium text-gray-900 dark:text-white">रु{booking.totalCost}</td>
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

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await apiFetchUser('/bookings');
            setBookings(response.data || []);
        } catch (error) {
            console.error('Failed to fetch bookings:', error.message);
            toast.error(error.message || 'Failed to fetch your bookings.');
            setBookings([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async () => {
        if (!bookingToDelete) return;
        try {
            await apiFetchUser(`/bookings/${bookingToDelete}`, { method: 'DELETE' });
            toast.success('Booking cancelled successfully.');
            setBookingToDelete(null);
            fetchBookings(); // Refresh the list
        } catch (error) {
            toast.error(error.message || "Failed to cancel booking.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Bookings</h1>
                <Button onClick={() => window.location.hash = '#/user/new-booking'}><PlusCircle size={20} />New Booking</Button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    {isLoading ? (<div className="text-center p-12 text-gray-500 dark:text-gray-400">Loading bookings...</div>) : bookings.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Service</th>
                                    <th className="p-3">Bike</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Payment</th>
                                    <th className="p-3 text-right">Cost</th>
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
                                        <td className="p-3 text-right font-semibold">रु{booking.totalCost}</td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => window.location.hash = `#/user/edit-booking/${booking._id}`} disabled={booking.status !== 'Pending'}>
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => setBookingToDelete(booking._id)} disabled={booking.isPaid}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <Bike size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-xl font-semibold">No Bookings Yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Looks like you haven't booked any services with us.</p>
                        </div>
                    )}
                </div>
            </Card>
            <ConfirmationModal
                isOpen={!!bookingToDelete}
                onClose={() => setBookingToDelete(null)}
                onConfirm={handleDelete}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Yes, Cancel"
            />
        </div>
    );
};

const EditBookingPage = () => {
    const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
    const [services, setServices] = useState([]);
    const [bookingId, setBookingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hash = window.location.hash;
        const id = hash.split('/').pop();
        setBookingId(id);

        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [servicesRes, bookingsRes] = await Promise.all([
                    apiFetchUser('/services'),
                    apiFetchUser('/bookings')
                ]);

                setServices(servicesRes.data || []);

                const booking = bookingsRes.data.find(b => b._id === id);

                if (booking) {
                    const service = (servicesRes.data || []).find(s => s.name === booking.serviceType);
                    setFormData({
                        serviceId: service ? service._id : '',
                        bikeModel: booking.bikeModel,
                        date: new Date(booking.date).toISOString().split('T')[0],
                        notes: booking.notes
                    });
                } else {
                    toast.error("Booking not found.");
                    window.location.hash = '#/user/bookings';
                }
            } catch (err) {
                toast.error(err.message || "Failed to load data.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchInitialData();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetchUser(`/bookings/${bookingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            toast.success("Booking updated successfully!");
            window.location.hash = '#/user/bookings';
        } catch (err) {
            toast.error(err.message || "Failed to update booking.");
        }
    };

    if (isLoading) {
        return <div className="text-center p-12">Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => window.location.hash = '#/user/bookings'} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Booking</h1>
            </div>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
                        <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
                            <option value="" disabled>-- Choose a service --</option>
                            {services.map(service => (
                                <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
                            ))}
                        </select>
                    </div>

                    <Input id="bikeModel" name="bikeModel" label="Bike Model" value={formData.bikeModel} onChange={handleChange} required />
                    <Input id="date" name="date" label="Preferred Date" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Description</label>
                        <textarea id="notes" name="notes" rows="4" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => window.location.hash = '#/user/bookings'}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const NewBookingPage = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiFetchUser('/services');
                setServices(response.data || []);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                toast.error(err.message || "Could not load available services. Please try again later.");
            }
        };
        fetchServices();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.serviceId || !formData.bikeModel || !formData.date) {
            toast.error("Please fill out all required fields.");
            return;
        }

        try {
            await apiFetchUser('/bookings', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            toast.success("Booking submitted! Please proceed with payment.");
            window.location.hash = `#/user/my-payments`;

        } catch (err) {
            toast.error(err.message || "Failed to submit booking. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Request a New Service</h1>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
                        <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
                            <option value="" disabled>-- Choose a service --</option>
                            {services.map(service => (
                                <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
                            ))}
                        </select>
                    </div>
                    <Input id="bikeModel" name="bikeModel" label="Bike Model (e.g., Bajaj Pulsar 220F)*" value={formData.bikeModel} onChange={handleChange} required />
                    <Input id="date" name="date" label="Preferred Date*" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explain Your Problem Here*</label>
                        <textarea id="notes" name="notes" rows="4" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit">Submit Request</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const MyPaymentsPage = () => {
    const [unpaidBookings, setUnpaidBookings] = useState([]);
    const [paidBookings, setPaidBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await apiFetchUser('/bookings');
            const allBookings = response.data || [];
            setUnpaidBookings(allBookings.filter(b => b.paymentStatus === 'Pending'));
            setPaidBookings(allBookings.filter(b => b.paymentStatus === 'Paid'));
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            toast.error(error.message || 'Could not fetch your bookings.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handlePayment = async (booking, method) => {
        if (method === 'COD') {
            try {
                await apiFetchUser(`/bookings/${booking._id}/pay`, {
                    method: 'PUT',
                    body: JSON.stringify({ paymentMethod: 'COD' })
                });
                toast.success("Payment Confirmed! Your booking is now being processed.");
                fetchBookings();
            } catch (error) {
                toast.error(error.message || "Payment confirmation failed.");
            }
            return;
        }

        if (method === 'eSewa') {
            try {
                const response = await fetch('http://localhost:5050/api/payment/esewa/initiate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ bookingId: booking._id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'An API error occurred.');
                }

                const esewaResponse = await response.json();

                const form = document.createElement('form');
                form.setAttribute('method', 'POST');
                form.setAttribute('action', esewaResponse.ESEWA_URL);

                for (const key in esewaResponse) {
                    if (key !== 'ESEWA_URL') {
                        const hiddenField = document.createElement('input');
                        hiddenField.setAttribute('type', 'hidden');
                        hiddenField.setAttribute('name', key);
                        hiddenField.setAttribute('value', esewaResponse[key]);
                        form.appendChild(hiddenField);
                    }
                }

                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                toast.error(error.message || 'Error initiating eSewa payment.');
            }
            return;
        }

        if (method === 'Khalti') {
            const khaltiConfig = {
                publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234", // Your Live Public Key
                productIdentity: booking._id,
                productName: booking.serviceType,
                productUrl: window.location.href,
                eventHandler: {
                    async onSuccess(payload) {
                        try {
                            await apiFetchUser('/bookings/verify-khalti', {
                                method: 'POST',
                                body: JSON.stringify({
                                    token: payload.token,
                                    amount: payload.amount,
                                    booking_id: booking._id
                                })
                            });
                            toast.success('Payment Successful & Verified!');
                            fetchBookings();
                        } catch (error) {
                            toast.error(error.message || 'Payment verification failed.');
                        }
                    },
                    onError(error) {
                        console.error('Khalti Checkout Error:', error);
                        toast.error('Payment process was interrupted.');
                    },
                    onClose() {
                        console.log('Khalti widget closed');
                    }
                },
                paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
            };

            const checkout = new KhaltiCheckout(khaltiConfig);
            checkout.show({ amount: booking.totalCost * 100 });
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Payments</h1>

            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Pending Payments</h2>
                {isLoading ? (<div className="text-center p-12">Loading...</div>) :
                    unpaidBookings.length > 0 ? (
                        <div className="space-y-4">
                            {unpaidBookings.map(booking => (
                                <div key={booking._id} className="p-4 border rounded-lg dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="font-bold">{booking.serviceType} for {booking.bikeModel}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                        <p className="text-lg font-semibold">Total: रु{booking.totalCost}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handlePayment(booking, 'COD')}>Pay with COD</Button>
                                        <Button variant="secondary" onClick={() => handlePayment(booking, 'Khalti')}>
                                            <img src="/khaltilogo.png" alt="Khalti" style={{ height: '24px' }} />
                                        </Button>

                                        <Button variant="success" onClick={() => handlePayment(booking, 'eSewa')}>
                                            <img src="/esewa_logo.png" alt="eSewa" style={{ height: '24px' }} />
                                        </Button>

                                        {/* <Button variant="secondary" onClick={() => handlePayment(booking, 'Khalti')}>Pay with Khalti</Button>
                                        <Button variant="success" onClick={() => handlePayment(booking, 'eSewa')}>Pay with eSewa</Button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">You have no pending payments.</p>
                        </div>
                    )}
            </Card>

            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Payment History</h2>
                <div className="overflow-x-auto">
                    {isLoading ? (<div className="text-center p-12">Loading...</div>) :
                        paidBookings.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="p-3">Service</th>
                                        <th className="p-3">Bike</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidBookings.map(booking => (
                                        <tr key={booking._id} className="border-b dark:border-gray-700">
                                            <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                            <td className="p-3 font-semibold">रु{booking.totalCost}</td>
                                            <td className="p-3"><StatusBadge status={booking.paymentMethod} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No payment history found.</p>
                            </div>
                        )}
                </div>
            </Card>
        </div>
    );
};


const UserProfilePage = ({ currentUser, setCurrentUser }) => {
    const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', address: '', profilePicture: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [initialProfile, setInitialProfile] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetchUser('/profile');
                const profileData = { ...response.data, address: response.data.address || '' };
                setProfile(profileData);
                setInitialProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error(error.message || "Failed to fetch profile.");
            }
        };
        fetchProfile();
    }, []);

    const handleFetchLocation = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setIsFetchingLocation(true);
        toast.info("Fetching your location...");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    if (!response.ok) throw new Error('Failed to convert location to address.');

                    const data = await response.json();
                    if (data && data.display_name) {
                        setProfile(p => ({ ...p, address: data.display_name }));
                        toast.success("Location fetched successfully!");
                    } else {
                        throw new Error('Could not find a valid address for your location.');
                    }
                } catch (error) {
                    console.error("Reverse geocoding error:", error);
                    toast.error(error.message || "Could not fetch address. Please enter it manually.");
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                let message = "An unknown error occurred while fetching location.";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "You denied the request for Geolocation. Please enable it in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        message = "The request to get user location timed out.";
                        break;
                }

                toast.error(message);
                setIsFetchingLocation(false);
            }
        );
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('fullName', profile.fullName);
        formData.append('email', profile.email);
        formData.append('phone', profile.phone);
        formData.append('address', profile.address);
        if (profile.newProfilePicture) {
            formData.append('profilePicture', profile.newProfilePicture);
        }

        try {
            const response = await apiFetchUser('/profile', {
                method: 'PUT',
                body: formData
            });
            const updatedData = { ...response.data, address: response.data.address || '' };
            setProfile(updatedData);
            setInitialProfile(updatedData);
            setCurrentUser(updatedData);
            setIsEditing(false);
            toast.success(response.message || 'Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            toast.error(error.message || 'Failed to update profile.');
        }
    };

    const handleCancel = () => {
        setProfile(initialProfile);
        setIsEditing(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(p => ({ ...p, profilePictureUrl: URL.createObjectURL(file), newProfilePicture: file }));
        }
    };

    const handleImageError = (e) => { e.target.src = `https://placehold.co/128x128/e2e8f0/4a5568?text=${profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}`; };
    const profilePictureSrc = profile.profilePictureUrl || (profile.profilePicture ? `http://localhost:5050/${profile.profilePicture}` : `https://placehold.co/128x128/e2e8f0/4a5568?text=${profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}`);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
            <Card>
                <div className="flex justify-end mb-4">
                    {!isEditing && <Button onClick={() => setIsEditing(true)}><Edit size={16} /> Edit Profile</Button>}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 flex flex-col items-center text-center">
                        <img key={profilePictureSrc} src={profilePictureSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} />
                        {isEditing && (
                            <>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <Button variant="secondary" onClick={() => fileInputRef.current.click()}><Camera size={16} /> Change Picture</Button>
                            </>
                        )}
                        <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">{profile.fullName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                        <p className="text-gray-500 dark:text-gray-400">{profile.phone}</p>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <Input id="fullName" label="Full Name" name="fullName" value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} disabled={!isEditing} />
                        <Input id="email" label="Email Address" name="email" type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={!isEditing} />
                        <Input id="phone" label="Phone Number" name="phone" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} />

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <div className="flex items-center gap-2">
                                <textarea id="address" name="address" rows="3"
                                    className="flex-grow px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600"
                                    value={profile.address || ''}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    disabled={!isEditing || isFetchingLocation}
                                    placeholder="Click the button to fetch automatically or enter manually."
                                />
                                {isEditing && (
                                    <Button type="button" variant="secondary" onClick={handleFetchLocation} disabled={isFetchingLocation} className="shrink-0">
                                        <MapPin size={18} className={isFetchingLocation ? 'animate-pulse' : ''} />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};


const UserNavLink = ({ page, icon: Icon, children, activePage, onLinkClick }) => {
    const isActive = activePage === page;
    return (
        <a href={`#/user/${page}`} onClick={onLinkClick} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <Icon size={22} />
            <span className="text-md">{children}</span>
        </a>
    );
};

const UserSidebarContent = ({ activePage, onLinkClick, onLogoutClick, onMenuClose }) => {
    const handleLogoClick = () => {
        window.location.hash = '#/user/dashboard';
        if (onMenuClose) onMenuClose();
    };

    return (
        <>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/motofix-removebg-preview.png" alt="MotoFix Logo" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={handleLogoClick} title="Go to Dashboard" />
                </div>
                {onMenuClose && <button onClick={onMenuClose} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>}
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <UserNavLink page="dashboard" icon={LayoutDashboard} activePage={activePage} onLinkClick={onLinkClick}>Dashboard</UserNavLink>
                <UserNavLink page="bookings" icon={CalendarDays} activePage={activePage} onLinkClick={onLinkClick}>My Bookings</UserNavLink>
                <UserNavLink page="my-payments" icon={CreditCard} activePage={activePage} onLinkClick={onLinkClick}>My Payments</UserNavLink>
                <UserNavLink page="new-booking" icon={PlusCircle} activePage={activePage} onLinkClick={onLinkClick}>New Booking</UserNavLink>
                <UserNavLink page="profile" icon={User} activePage={activePage} onLinkClick={onLinkClick}>Profile</UserNavLink>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={onLogoutClick} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <LogOut size={22} />
                    <span className="text-md">Logout</span>
                </button>
            </div>
        </>
    );
};

const UserDashboard = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({ fullName: 'Guest', email: '', profilePicture: '' });
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('userTheme') === 'dark');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetchUser('/profile');
                setCurrentUser(response.data || { fullName: 'Guest', email: '' });
            } catch (error) {
                console.error("Failed to fetch current user", error);
                if (error.message.includes('Unauthorized')) {
                    handleLogoutConfirm();
                }
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('userTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/user/', '');
            if (hash.startsWith('edit-booking/')) {
                setActivePage('edit-booking');
            } else {
                setActivePage(hash || 'dashboard');
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleLogoutConfirm = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <UserDashboardPage />;
            case 'bookings': return <UserBookingsPage />;
            case 'new-booking': return <NewBookingPage />;
            case 'my-payments': return <MyPaymentsPage />;
            case 'edit-booking': return <EditBookingPage />;
            case 'profile': return <UserProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
            default:
                window.location.hash = '#/user/dashboard';
                return <UserDashboardPage />;
        }
    };

    const handleImageError = (e) => { e.target.src = `https://placehold.co/40x40/e2e8f0/4a5568?text=${currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}`; };
    const profilePictureSrc = currentUser.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://placehold.co/40x40/e2e8f0/4a5568?text=${currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}`;

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
            {/* Sidebar */}
            <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                    <UserSidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} />
                </div>
                <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
            </div>
            <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
                <UserSidebarContent activePage={activePage} onLinkClick={() => { }} onLogoutClick={() => setLogoutConfirmOpen(true)} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <img key={profilePictureSrc} src={profilePictureSrc} alt="User" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} />
                            <div>
                                <p className="font-semibold text-sm">{currentUser.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
                    {renderPage()}
                </main>
            </div>

            <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} onConfirm={handleLogoutConfirm} title="Confirm Logout" message="Are you sure you want to logout?" confirmText="Logout" confirmButtonVariant="danger" Icon={LogOut} />
        </div>
    );
};

export default UserDashboard;