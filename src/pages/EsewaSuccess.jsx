import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EsewaSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your payment, please wait...');

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const data = params.get('data');

      if (data) {
        try {
          const response = await fetch(`http://localhost:5050/api/payment/esewa/verify?data=${data}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || result.message || 'An unknown verification error occurred.');
          }

          setMessage(result.message);
          toast.success('Payment successful!');
          setTimeout(() => {
            navigate('/dashboard#/user/my-payments');
          }, 2000);
        } catch (error) {
          setMessage(error.message);
          toast.error(error.message);
          setTimeout(() => {
            navigate('/dashboard#/user/my-payments');
          }, 2000);
        }
      } else {
        setMessage('No payment data received from eSewa.');
        toast.error('Could not verify payment.');
        setTimeout(() => {
          navigate('/dashboard#/user/my-payments');
        }, 2000);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        <p>You will be redirected to your payments page shortly...</p>
      </div>
    </div>
  );
};

export default EsewaSuccess;
