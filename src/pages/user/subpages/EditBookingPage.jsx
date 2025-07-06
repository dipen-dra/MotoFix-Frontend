import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EditBookingPage = () => {
    const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const id = window.location.hash.split('/').pop();
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const servicesRes = await apiFetchUser('/services');
                const { data: allServices } = await servicesRes.json();
                setServices(allServices || []);

                const bookingRes = await apiFetchUser(`/bookings/${id}`);
                const { data: booking } = await bookingRes.json();

                if (booking) {
                    if (booking.isPaid || booking.discountApplied || booking.status !== 'Pending') {
                        toast.error("This booking cannot be edited.");
                        window.location.hash = '#/user/bookings';
                        return;
                    }
                    const service = (allServices || []).find(s => s.name === booking.serviceType);
                    setFormData({
                        serviceId: service ? service._id : '',
                        bikeModel: booking.bikeModel,
                        date: new Date(booking.date).toISOString().split('T')[0],
                        notes: booking.notes
                    });
                } else {
                    throw new Error("Booking not found.");
                }
            } catch (err) {
                toast.error(err.message || "Failed to load booking data.");
                window.location.hash = '#/user/bookings';
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchInitialData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const bookingId = window.location.hash.split('/').pop();
            const response = await apiFetchUser(`/bookings/${bookingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            toast.success(data.message || "Booking updated successfully!");
            window.location.hash = '#/user/bookings';
        } catch (err) {
            toast.error(err.message || "Failed to update booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center p-12">Loading editor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Booking</h1>
            </div>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service*</label>
                        <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                            {services.map(service => (
                                <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
                            ))}
                        </select>
                    </div>
                    <Input id="bikeModel" name="bikeModel" label="Bike Model" value={formData.bikeModel} onChange={handleChange} required />
                    <Input id="date" name="date" label="Date" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem</label>
                        <textarea id="notes" name="notes" rows="4" value={formData.notes || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"></textarea>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => window.location.hash = '#/user/bookings'}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditBookingPage;