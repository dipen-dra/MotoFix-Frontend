// src/components/Auth/LoginForm.jsx
import React, { useContext, useState } from 'react';
import { EmailIcon, LockIcon } from '../../assets/icons'; // Assuming these exist
import { FormInputWithLabel } from './FormInputWIthLabel'; // Assuming this exists
import { toast } from 'react-toastify';
import { loginUserApi } from '../../api/authApi'; // Assuming this API service exists
import { Link } from 'react-router-dom'; // Keep Link for forgot password
import { AuthContext } from '../../auth/AuthContext'; // Import AuthContext

export const LoginForm = ({ onSwitch }) => {
    const { login } = useContext(AuthContext); // Get login function from context
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false); // Use 'loading' for button state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password.');
            return;
        }

        setLoading(true); // Start loading state
        try {
            const data = await loginUserApi(formData); // Call your API service
            console.log("Login response from API:", data); // Log the full response from your API

            // Pass the entire data.data object (which contains role) and the token to AuthContext's login
            login(data.data.data, data.data.token); // Assuming data.data holds user info and data.data.token is the token

            // IMPORTANT: Remove any navigate() calls from here.
            // Redirection will now be handled centrally in App.jsx's useEffect.
            toast.success('Login successful!'); // Show success toast here

        } catch (err) {
            console.error("Login Error:", err); // Log the full error
            toast.error(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <FormInputWithLabel id="email" label="Email" type="email" placeholder="you@example.com" icon={<EmailIcon />} value={formData.email} onChange={handleChange} />
                <FormInputWithLabel id="password" label="Password" type="password" placeholder="••••••••" icon={<LockIcon />} value={formData.password} onChange={handleChange} />

                <div className="flex justify-end text-sm w-full">
                    <Link to="/forgot-password" className="font-semibold text-blue-600 hover:text-blue-500">
                        Forgot Password?
                    </Link>
                </div>

                <button type="submit" disabled={loading} className="mt-4 bg-gray-900 dark:bg-blue-600 border-transparent text-white text-base font-medium rounded-lg h-12 w-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400">
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Don't have an account?
                <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1 bg-transparent border-none p-0 cursor-pointer">Sign Up</button>
            </p>
        </>
    );
};