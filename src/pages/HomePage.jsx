import React from 'react';

const containerStyle = "container mx-auto px-4 py-8";

export const HomePage = () => {
    return (
        <div className={containerStyle}>
            <div className="text-center py-20">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-gray-900 dark:text-white">
                    Reliable Bike Service,
                </h1>
                <h2 className="text-5xl md:text-7xl font-extrabold text-blue-600 mb-6">
                    Delivered to Your Door.
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                    MotoFix offers premium 2-wheeler servicing with a convenient pick-up and drop-off facility. 
                    Your bike's health is our top priority.
                </p>
                <a href="#/login" className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 inline-block">
                    Book a Service
                </a>
            </div>
        </div>
    )
}