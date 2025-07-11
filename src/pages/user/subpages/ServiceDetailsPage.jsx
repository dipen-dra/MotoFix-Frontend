import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Wrench, Tag, ClipboardCheck } from 'lucide-react';

import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full py-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            setIsLoading(true);
            try {
                // The backend route is likely singular for a single resource
                const response = await apiFetchUser(`/services/${id}`);
                const data = await response.json();
                if (data.data) {
                    setService(data.data);
                } else {
                    throw new Error('Service not found.');
                }
            } catch (error) {
                toast.error(error.message || "Failed to fetch service details.");
                navigate('/user/dashboard'); // Redirect if service not found
            } finally {
                setIsLoading(false);
            }
        };

        fetchServiceDetails();
    }, [id, navigate]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!service) {
        return null; // Or a "Not Found" component
    }
    
    const placeholderImage = `https://placehold.co/1200x600/e2e8f0/4a5568?text=${encodeURIComponent(service.name)}`;
    const imageUrl = service.image ? `http://localhost:5050/${service.image}` : placeholderImage;

    return (
        <div className="max-w-4xl mx-auto">
            <Button 
                variant="secondary" 
                onClick={() => navigate('/user/dashboard')} 
                className="mb-6 !gap-1.5"
            >
                <ArrowLeft size={18} />
                Back to Services
            </Button>

            <Card className="overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={service.name} 
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                />
                <div className="p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <Wrench className="text-blue-500" size={32} />
                        {service.name}
                    </h1>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                        {service.description}
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">Price</p>
                            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                <Tag size={30} />
                                रु{service.price}
                            </span>
                        </div>
                        <Link to={`/user/book-service/${service._id}`} className="w-full md:w-auto">
                           <Button className="w-full !py-3 !text-lg !gap-2.5">
                               <ClipboardCheck size={22} />
                               Book This Service Now
                           </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ServiceDetailsPage;
