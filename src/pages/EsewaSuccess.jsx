import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
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
          const response = await api.get(`/payment/esewa/verify?data=${data}`);
          setMessage(response.data.message);
          toast.success('Payment successful!');
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Payment verification failed.';
          setMessage(errorMessage);
          toast.error(errorMessage);
        } finally {
            setTimeout(() => {
                navigate('/user/my-payments'); 
            }, 3000);
        }
      } else {
        setMessage('No payment data received from eSewa.');
        toast.error('Could not verify payment.');
        setTimeout(() => {
            navigate('/user/my-payments');
        }, 3000);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        <p>You will be redirected shortly...</p>
      </div>
    </div>
  );
};

export default EsewaSuccess;