import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

// Import your 404 animation JSON file
import notFoundAnimation from '../animations/404.json';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4 dark:bg-gray-900">
      <div className="max-w-3xl w-full p-4 md:p-8 rounded-lg">
        
        {/* Lottie Animation - Made larger */}
        <Lottie 
          animationData={notFoundAnimation} 
          loop={true}
          autoplay={true}
          style={{ width: '90%', maxWidth: '550px', margin: '0 auto' }}
        />

        {/* Centered Content */}
        <div className="mt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-6">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4 mb-8 max-w-md mx-auto">
              It seems the page you're looking for has taken a wrong turn or doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 shadow-lg"
            >
              Go Back to Home
            </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
