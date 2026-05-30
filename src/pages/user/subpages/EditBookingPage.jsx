import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Calendar, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EditBookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
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
                        navigate('/user/bookings');
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
                navigate('/user/bookings');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchInitialData();
    }, [id, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await apiFetchUser(`/bookings/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to update booking.");
            }
            
            toast.success(data.message || "Booking updated successfully!");
            navigate('/user/bookings');
        } catch (err) {
            toast.error(err.message || "Failed to update booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center py-32 space-y-4">
                <div className="w-10 h-10 border-4 border-[rgba(245,192,0,0.2)] border-t-[#F5C000] rounded-full animate-spin"></div>
                <p className="text-sm text-[#4A4A65] font-semibold animate-pulse">Loading Booking Specifications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto text-[#111118]">
            {/* Header section with back option */}
            <div className="flex items-center gap-4 border-b border-black/08 pb-5">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2.5 rounded-xl bg-[#FDFDF8] hover:bg-[#F5F3E7] border border-black/10 text-[#4A4A65] hover:text-[#B8860B] transition-all duration-200 cursor-pointer"
                    title="Go Back"
                >
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-none">
                        Revise Booking Sheet
                    </h1>
                    <p className="text-xs text-[#8A8AA8] mt-1.5">
                        Modify your requested schedule, vehicle description details, or service tier category.
                    </p>
                </div>
            </div>

            <Card className="bg-white border border-black/08 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
                {/* Glowing side line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#F5C000]" />
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="serviceId" className="block text-xs font-bold text-[#4A4A65] uppercase tracking-wider mb-1.5">
                            Service Category Blueprint*
                        </label>
                        <select 
                            id="serviceId" 
                            name="serviceId" 
                            value={formData.serviceId} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-2.5 bg-[#FDFDF8] border border-black/10 focus:border-[#F5C000] focus:outline-none focus:ring-1 focus:ring-[#F5C000]/30 text-[#111118] text-sm rounded-xl placeholder:text-[#8A8AA8] transition-colors cursor-pointer"
                        >
                            {services.map(service => (
                                <option key={service._id} value={service._id}>
                                    {service.name} (रु{service.price})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input 
                            id="bikeModel" 
                            name="bikeModel" 
                            label="Bike Model Specs*" 
                            value={formData.bikeModel} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. Pulsar 220F"
                        />
                        <Input 
                            id="date" 
                            name="date" 
                            label="Rescheduled Date*" 
                            type="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            required 
                            min={new Date().toISOString().split("T")[0]} 
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="notes" className="block text-xs font-bold text-[#4A4A65] uppercase tracking-wider">
                            Diagnosis Log Symptoms / Notes
                        </label>
                        <textarea 
                            id="notes" 
                            name="notes" 
                            rows="4" 
                            value={formData.notes || ''} 
                            onChange={handleChange} 
                            className="w-full px-4 py-2.5 bg-[#FDFDF8] border border-black/10 focus:border-[#F5C000] focus:outline-none focus:ring-1 focus:ring-[#F5C000]/30 text-[#111118] text-sm rounded-xl placeholder:text-[#8A8AA8] transition-colors"
                            placeholder="Explain the problems you want serviced on the workshop floor..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-black/07">
                        <Button 
                            variant="secondary" 
                            type="button" 
                            onClick={() => navigate('/user/bookings')}
                            className="!px-6 !py-2.5 text-xs font-semibold !bg-[#F5F3E7] hover:!bg-black/05 text-[#111118] transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            Cancel Changes
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="!px-6 !py-2.5 text-xs font-semibold text-[#0D0D14] bg-gradient-to-r from-[#F5C000] to-[#E6B000]"
                        >
                            {isSubmitting ? 'Saving Specifications...' : 'Save Revisions'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditBookingPage;