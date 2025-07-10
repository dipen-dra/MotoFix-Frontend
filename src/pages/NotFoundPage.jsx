import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4 dark:bg-gray-900">
      <div className="max-w-md">
        {/* You can add an animation or an SVG icon here for more visual appeal */}
        <h1 className="text-8xl font-bold text-indigo-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2 text-gray-800 dark:text-white">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;