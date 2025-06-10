import React from 'react';
// Make sure to import the new icons
import { FeatureIcon, WrenchIcon, PriceTagIcon, TruckIcon, QuoteIcon, StarIcon, HalfStarIcon, EmptyStarIcon } from '../assets/icons';

export const HomePage = () => {
    const backgroundImageUrl = 'https://pplx-res.cloudinary.com/image/upload/v1749469010/gpt4o_images/pjh8vcy6nwxlipmugg1p.png';

    return (
        <>
            <div 
                className="relative bg-cover bg-center h-[calc(100vh-5rem)] flex items-center justify-center"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative text-center text-white p-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Reliable Bike Service,</h1>
                    <h2 className="text-5xl md:text-7xl font-extrabold text-blue-400 mb-6">Delivered to Your Door.</h2>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
                        MotoFix is your trusted two-wheeler partner offering hassle-free, high-quality servicing right from the comfort of your home. Schedule, track, and relax—your bike is in expert hands.
                    </p>
                    <a href="#/login" className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 inline-block">Book a Service</a>
                </div>
            </div>

            <section id="why-choose-us" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose MotoFix?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        
                        {/* Card size increased */}
                        <div 
                            className="group relative rounded-lg shadow-lg h-56 transform transition-transform duration-300 hover:scale-105 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1749555876/gpt4o_images/bybdnjs6xsay9lvrwxd1.png')` }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-70 transition-all duration-300"></div>
                            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-xl font-bold text-white">Expert Technicians</h3>
                                <p className="text-gray-200 text-base transition-all duration-300 ease-in-out opacity-0 max-h-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
                                    Our certified technicians bring dealership-level care to your doorstep, ensuring your ride is always road-ready.
                                </p>
                            </div>
                        </div>

                        {/* Card size increased and content centered */}
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 hover:ring-2 hover:ring-blue-500 h-56 flex flex-col justify-center">
                            <FeatureIcon><PriceTagIcon /></FeatureIcon>
                            <h3 className="text-xl font-bold mb-2 text-blue-600">Transparent Pricing</h3>
                            <p className="text-black">
                                Get detailed upfront estimates with no surprises. Our commitment to clear pricing ensures complete trust, with a breakdown of services and no hidden charges—ever.
                            </p>
                        </div>
                        
                        {/* Card size increased and content centered */}
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 hover:ring-2 hover:ring-blue-500 h-56 flex flex-col justify-center">
                            <FeatureIcon><TruckIcon /></FeatureIcon>
                            <h3 className="text-xl font-bold mb-2 text-blue-600">Pick-up & Drop</h3>
                            <p className="text-black">
                                Book your service online and we’ll take care of the rest. Our seamless pick-up and drop service is designed to give you maximum convenience and safety.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="services" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        
                        {/* Card size increased */}
                        <div 
                            className="group relative rounded-lg shadow-lg h-56 transform transition-transform duration-300 hover:scale-105 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1749554608/gpt4o_images/iqiqmts2nwcfackizvjy.png')` }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-70 transition-all duration-300"></div>
                            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-xl font-bold text-white">General Service</h3>
                                <p className="text-gray-200 text-base transition-all duration-300 ease-in-out opacity-0 max-h-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
                                    From oil changes to brake inspections, our general service covers every essential aspect to keep your bike in optimal condition.
                                </p>
                            </div>
                        </div>
                        
                        {/* Card size increased */}
                        <div 
                            className="group relative rounded-lg shadow-lg h-56 transform transition-transform duration-300 hover:scale-105 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1749554990/gpt4o_images/iwycnvpey4wfffv7q0dt.png')` }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-70 transition-all duration-300"></div>
                            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-xl font-bold text-white">Engine Repair</h3>
                                <p className="text-gray-200 text-base transition-all duration-300 ease-in-out opacity-0 max-h-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
                                    Facing unusual noise or performance drops? Our engine experts diagnose and fix problems efficiently using high-quality parts.
                                </p>
                            </div>
                        </div>

                        {/* Card size increased */}
                        <div 
                            className="group relative rounded-lg shadow-lg h-56 transform transition-transform duration-300 hover:scale-105 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1749555492/gpt4o_images/am0n8x501uzraegjm0ly.png')` }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-70 transition-all duration-300"></div>
                            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-xl font-bold text-white">Denting & Painting</h3>
                                <p className="text-gray-200 text-base transition-all duration-300 ease-in-out opacity-0 max-h-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
                                    Give your bike a makeover! We remove dents and provide precision paintwork to restore that brand-new shine.
                                </p>
                            </div>
                        </div>
                        
                        {/* Card size increased */}
                        <div 
                            className="group relative rounded-lg shadow-lg h-56 transform transition-transform duration-300 hover:scale-105 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1749555695/gpt4o_images/bdogajkde4cpf1bde5fc.png')` }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-70 transition-all duration-300"></div>
                            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-xl font-bold text-white">Insurance Claims</h3>
                                <p className="text-gray-200 text-base transition-all duration-300 ease-in-out opacity-0 max-h-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
                                    We simplify the insurance process by assisting you with paperwork, damage evaluation, and claim processing—quick, easy, and worry-free.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section id="testimonials" className="py-20 bg-white">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">What Our Customers Say</h1>
                    <div className="flex flex-wrap justify-center gap-5 mt-16 text-left">
                        
                        {/* Card size increased */}
                        <div className="w-96 flex flex-col items-start bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 hover:ring-2 hover:ring-blue-500">
                            <QuoteIcon />
                            <div className="flex items-center justify-center mt-3 gap-1">
                                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><EmptyStarIcon />
                            </div>
                            <p className="text-base mt-3 text-black">
                                "The best service I've ever had for my bike. Pick-up was timely, and the technician explained every detail before proceeding. Highly recommended!"
                            </p>
                            <div className="flex items-center gap-3 mt-4">
                                <img className="h-12 w-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop" alt="userImage1"/>
                                <div>
                                    <h2 className="text-base text-black font-medium">Aman Chaudhary</h2>
                                </div>
                            </div>
                        </div>

                        {/* Card size increased */}
                        <div className="w-96 flex flex-col items-start bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 hover:ring-2 hover:ring-blue-500">
                            <QuoteIcon />
                            <div className="flex items-center justify-center mt-3 gap-1">
                                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><HalfStarIcon />
                            </div>
                            <p className="text-base mt-3 text-black">
                                "MotoFix took care of a complicated engine issue without me needing to visit a workshop. Great experience, from diagnosis to delivery!"
                            </p>
                            <div className="flex items-center gap-3 mt-4">
                                <img className="h-12 w-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&h=100&auto=format&fit=crop" alt="userImage2"/>
                                <div>
                                    <h2 className="text-base text-black font-medium">Prajwol Neupane</h2>
                                </div>
                            </div>
                        </div>

                        {/* Card size increased */}
                        <div className="w-96 flex flex-col items-start bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 hover:ring-2 hover:ring-blue-500">
                            <QuoteIcon />
                            <div className="flex items-center justify-center mt-3 gap-1">
                                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                            </div>
                            <p className="text-base mt-3 text-black">
                                "They handled everything smoothly and the repair work was flawless. My bike looks brand new. Highly appreciate the quality and speed!"
                            </p>
                            <div className="flex items-center gap-3 mt-4">
                                <img className="h-12 w-12 rounded-full object-cover" src="https://www.mytalk1071.com/wp-content/uploads/2024/11/CMG0f2c85f7-b2a7-4ff7-99ca-0a3f9d6b00c0-1.jpg" alt="userImage3" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/374151/ffffff?text=S'; }}/>
                                <div>
                                    <h2 className="text-base text-black font-medium">Sydney Sweeney</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}