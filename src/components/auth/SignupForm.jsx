import React, { useState } from 'react';
import { UserIcon, EmailIcon, LockIcon } from '../../assets/icons';
import { FormInputWithLabel } from './FormInputWIthLabel';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../api/authApi';
import TermsModal from '../auth/TermsModals'; // Adjust path if needed

export const SignupForm = ({ onSwitch }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.password) {
            toast.error('Please fill in all fields.');
            return;
        }

        if (!agreed) {
            toast.error('You must agree to the terms and conditions.');
            return;
        }

        setLoading(true);
        try {
            await registerUserApi(formData);
            toast.success("Sign up Successful");
            setFormData({ fullName: '', email: '', password: '' });
            setAgreed(false);

            setTimeout(() => {
                onSwitch();
            }, 1500);
        } catch (err) {
            toast.error(err.message || 'Sign up failed');
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

                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                        className="mt-1"
                    />
                    <label htmlFor="terms" className="leading-snug">
                        I agree to the{' '}
                        <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Terms and Conditions
                        </button>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!agreed || loading}
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

            {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
        </>
    );
};
