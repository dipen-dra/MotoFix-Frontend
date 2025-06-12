
// src/components/auth/SignupForm.js

import React, { useState } from 'react';
import { UserIcon, EmailIcon, LockIcon } from '../../assets/icons';
import { FormInputWithLabel } from './FormInputWithLabel';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../api/authApi';

export const SignupForm = ({ onSwitch }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.password) {
            toast.error('Please fill in all fields.');
            return;
        }
        
        setLoading(true);
        try {
            const data = await registerUserApi(formData);
            toast.success("Sign up Succesfull");
            
            // Clear form data
            setFormData({ fullName: '', email: '', password: '' });
            
            // Navigate to login page after a brief delay to show the success message
            setTimeout(() => {
                onSwitch(); // This will switch to the login form
            }, 1500);
            
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Join us and start your journey.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <FormInputWithLabel 
                    id="fullName" 
                    label="Full Name" 
                    type="text" 
                    placeholder="John Doe" 
                    icon={<UserIcon />} 
                    value={formData.fullName} 
                    onChange={handleChange} 
                />
                <FormInputWithLabel 
                    id="email" 
                    label="Email Address" 
                    type="email" 
                    placeholder="you@example.com" 
                    icon={<EmailIcon />} 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                <FormInputWithLabel 
                    id="password" 
                    label="Password" 
                    type="password" 
                    placeholder="Create a strong password" 
                    icon={<LockIcon />} 
                    value={formData.password} 
                    onChange={handleChange} 
                />

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="mt-4 bg-gray-900 dark:bg-blue-600 border-transparent text-white text-base font-medium rounded-lg h-12 w-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Already have an account?
                <button 
                    onClick={onSwitch} 
                    className="font-semibold text-blue-600 hover:text-blue-500 ml-1 bg-transparent border-none p-0 cursor-pointer"
                >
                    Sign In
                </button>
            </p>
        </>
    );
};