// src/pages/ResetPasswordPage.js

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MotoFixLogo } from '../assets/MotoFixLogo'; // Adjust path if needed
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Import icons

const ResetPasswordPage = () => {
    // Get the token from the URL using useParams hook
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Basic client-side validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Make the API call to your new backend endpoint
            const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
            
            setSuccessMessage(response.data.message + " You will be redirected to the login page shortly.");
            
            // Redirect to login page after a few seconds
            setTimeout(() => {
                navigate('/auth'); // Or your login route
            }, 5000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // Using the same background style as your forgot password page for consistency
    const backgroundStyle = {
        backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1750869942/gpt4o_images/fs0fegc302qccocfwsea.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="min-h-screen relative" style={backgroundStyle}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative">
                <div className="w-full max-w-lg space-y-8">
                    <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 pt-10 pb-8">
                        <div className="flex justify-center mb-6">
                            <Link to="/">
                                <MotoFixLogo className="h-28 w-auto" />
                            </Link>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Set a New Password
                            </h2>
                        </div>

                        {successMessage ? (
                             <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                                {successMessage}
                             </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* New Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 pr-10 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            placeholder="Enter your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {/* Confirm New Password Input */}
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 pr-10 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            placeholder="Confirm your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gray-800 hover:bg-black text-white text-sm font-semibold py-3 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        {loading ? 'Resetting Password...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
