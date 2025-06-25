import React from 'react';
import { Link } from 'react-router-dom';

const EsewaFailure = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Payment Failed</h1>
        <p>Your payment could not be processed. Please try again.</p>
        <Link to="/user/my-payments" className="text-blue-500 hover:underline">
          Go back to My Payments
        </Link>
      </div>
    </div>
  );
};

export default EsewaFailure;