import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewBookingPage = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiFetchUser('/services');
                const data = await response.json();
                setServices(data.data || []);
            } catch (err) {
                toast.error(err.message || "Could not load services.");
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
            toast.error("Please fill all required fields.");
            return;
        }
        setIsSubmitting(true);
        try {
            await apiFetchUser('/bookings', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            toast.success("Booking submitted! Please proceed to payment.");
            window.location.hash = '#/user/my-payments';
        } catch (err) {
            toast.error(err.message || "Failed to submit booking.");
        } finally {
            setIsSubmitting(false);
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
                    <Input id="bikeModel" name="bikeModel" label="Bike Model (e.g., Pulsar 220F)*" value={formData.bikeModel} onChange={handleChange} required />
                    <Input id="date" name="date" label="Preferred Date*" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Description</label>
                        <textarea id="notes" name="notes" rows="4" value={formData.notes || ""} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="Describe any issues..."></textarea>
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default NewBookingPage;