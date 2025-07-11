import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Wrench, Tag, Info } from 'lucide-react';

import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

// --- Reusable Service Card Component ---
const ServiceCard = ({ service }) => {
    const placeholderImage = `https://placehold.co/600x400/e2e8f0/4a5568?text=${encodeURIComponent(service.name)}`;
    const imageUrl = service.image ? `http://localhost:5050/${service.image}` : placeholderImage;

    return (
        <Card className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-blue-500/20">
            <img 
                src={imageUrl} 
                alt={service.name} 
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
            />
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Wrench size={20} className="text-blue-500" />
                    {service.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow mb-4">
                    {service.description}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Tag size={20} />
                        रु{service.price}
                    </span>
                    <Link to={`/user/service/${service._id}`}>
                        <Button variant="secondary">
                            <Info size={16} />
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};


// --- Main User Home Page Component ---
const UserHomePage = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const response = await apiFetchUser('/services');
                const data = await response.json();
                setServices(data.data || []);
            } catch (error) {
                toast.error(error.message || "Failed to fetch available services.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">Our Services</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Choose from our wide range of expert services to keep your bike in top condition.
            </p>
            
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {services.map(service => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-16">
                    <Wrench size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold">No Services Available</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        We are currently updating our service list. Please check back later.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default UserHomePage;
