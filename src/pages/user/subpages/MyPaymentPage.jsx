import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import KhaltiCheckout from "khalti-checkout-web";
import { Gift, CreditCard } from 'lucide-react';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadMoreControl from '../../../components/ui/LoadMoreControl';
import StatusBadge from '../../../components/ui/Statusbadge';

const MyPaymentsPage = ({ loyaltyPoints, onDiscountApplied }) => {
    const [unpaidBookings, setUnpaidBookings] = useState([]);
    const [paidBookings, setPaidBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllHistory, setShowAllHistory] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch pending and historical bookings concurrently
            const [pendingRes, historyRes] = await Promise.all([
                apiFetchUser('/bookings/pending'),
                apiFetchUser('/bookings/history')
            ]);
            const pendingData = await pendingRes.json();
            const historyData = await historyRes.json();
            setUnpaidBookings(pendingData.data || []);
            setPaidBookings(historyData.data || []);
        } catch (error) {
            toast.error(error.message || 'Could not fetch your payment information.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Check for payment status from URL params (e.g., after redirect from eSewa)
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const message = params.get('message');

        if (status && message) {
            if (status === 'success') {
                toast.success(message);
            } else {
                toast.error(message);
            }
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        }
    }, []);

    const handleSuccessfulPayment = async () => {
        await fetchData(); // Refresh payment lists
        onDiscountApplied(); // Notify parent to refresh user points
    };

    const handleApplyDiscount = async (bookingId) => {
        try {
            await apiFetchUser(`/bookings/${bookingId}/apply-discount`, { method: 'PUT' });
            toast.success('Discount applied successfully!');
            handleSuccessfulPayment();
        } catch (error) {
            toast.error(error.message || "Failed to apply discount.");
        }
    };

    const handlePayment = async (booking, method) => {
        const amountToPay = booking.finalAmount ?? booking.totalCost;

        if (method === 'COD') {
            try {
                await apiFetchUser(`/bookings/${booking._id}/pay`, {
                    method: 'PUT',
                    body: JSON.stringify({ paymentMethod: 'COD' })
                });
                toast.success("COD Payment Confirmed! Your booking is being processed.");
                handleSuccessfulPayment();
            } catch (error) {
                toast.error(error.message || "COD confirmation failed.");
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

                if (!response.ok) throw new Error('eSewa initiation failed.');

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
                publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234", // Replace with your Public Key
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
                            toast.success('Khalti Payment Successful & Verified!');
                            handleSuccessfulPayment();
                        } catch (error) {
                            toast.error(error.message || 'Khalti payment verification failed.');
                        }
                    },
                    onError: () => toast.error('Khalti payment process was interrupted.'),
                    onClose: () => console.log('Khalti widget closed.'),
                },
                paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
            };
            const checkout = new KhaltiCheckout(khaltiConfig);
            checkout.show({ amount: amountToPay * 100 }); // Amount in paisa
        }
    };

    const displayedHistory = showAllHistory ? paidBookings : paidBookings.slice(0, 10);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Payments</h1>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pending Payments</h2>
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Gift size={20} />
                        <span className="font-semibold">{loyaltyPoints} Points</span>
                    </div>
                </div>
                {isLoading && unpaidBookings.length === 0 ? (<div className="text-center p-12">Loading...</div>) :
                    unpaidBookings.length > 0 ? (
                        <div className="space-y-4">
                            {unpaidBookings.map(booking => (
                                <div key={booking._id} className="p-4 border rounded-lg dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="font-bold">{booking.serviceType} for {booking.bikeModel}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                        <div className="text-lg font-semibold mt-1">
                                            {booking.discountApplied ? (
                                                <>
                                                    <span className="text-base text-gray-500 line-through mr-2">रु{booking.totalCost}</span>
                                                    <span className="text-green-600">रु{booking.finalAmount}</span>
                                                </>
                                            ) : (
                                                <span>Total: रु{booking.totalCost}</span>
                                            )}
                                        </div>
                                        {booking.discountApplied && <p className="text-sm font-bold text-green-500">Discount: -रु{booking.discountAmount}</p>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {loyaltyPoints >= 100 && !booking.discountApplied && (
                                            <Button variant="special" onClick={() => handleApplyDiscount(booking._id)}>
                                                <Gift size={16} /> Apply 20% Discount
                                            </Button>
                                        )}
                                        <Button onClick={() => handlePayment(booking, 'COD')}>Pay with COD</Button>
                                        <Button variant="secondary" onClick={() => handlePayment(booking, 'Khalti')} className="bg-white"><img src="/khaltilogo.png" alt="Khalti" style={{ height: '24px' }} /></Button>
                                        <Button variant="secondary" onClick={() => handlePayment(booking, 'eSewa')} className="bg-white hover:bg-gray-100"><img src="/esewa_logo.png" alt="eSewa" style={{ height: '24px' }} /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CreditCard size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-xl font-semibold">No Pending Payments</h3>
                            <p className="mt-1 text-sm text-gray-500">All your payments are up to date!</p>
                        </div>
                    )}
            </Card>

            <Card className="flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Payment History</h2>
                <div className="overflow-x-auto flex-grow">
                    {isLoading && paidBookings.length === 0 ? (<div className="text-center p-12">Loading history...</div>) :
                        displayedHistory.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="p-3">Service</th><th className="p-3">Bike</th>
                                        <th className="p-3">Date</th><th className="p-3">Amount Paid</th><th className="p-3">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedHistory.map(booking => (
                                        <tr key={booking._id} className="border-b dark:border-gray-700">
                                            <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                            <td className="p-3 font-semibold">
                                                {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
                                                रु{booking.finalAmount ?? booking.totalCost}
                                            </td>
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
                <LoadMoreControl
                    onToggle={() => setShowAllHistory(!showAllHistory)}
                    isExpanded={showAllHistory}
                    hasMore={paidBookings.length > 10}
                />
            </Card>
        </div>
    );
};

export default MyPaymentsPage;