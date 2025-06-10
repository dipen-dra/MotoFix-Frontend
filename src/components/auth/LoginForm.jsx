// import React from 'react';
// import { EmailIcon, LockIcon } from '../../assets/icons';
// import { FormInputWithLabel } from './FormInputWithLabel';

// // export const LoginForm = ({ onSwitch }) => {
// //     const handleSubmit = (e) => e.preventDefault();
// //     return (
// //         <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
// //             <div className="text-center">
// //                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
// //                 <p className="text-gray-500 dark:text-gray-400 mt-2">Login to access your account</p>
// //             </div>
// //             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
// //                 <FormInputWithLabel id="email" label="Email" type="email" placeholder="Enter your email" icon={<EmailIcon />} />
// //                 <FormInputWithLabel id="password" label="Password" type="password" placeholder="Enter your password" icon={<LockIcon />} />
// //                 <div className="flex justify-end text-sm">
// //                     <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</a>
// //                 </div>
// //                 <button type="submit" className="mt-4 bg-gray-900 dark:bg-blue-600 border-none text-white text-base font-medium rounded-lg h-12 w-full cursor-pointer hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors">
// //                     Sign In
// //                 </button>
// //             </form>
// //             <p className="text-center text-sm text-gray-500 dark:text-gray-400">
// //                 Don't have an account?
// //                 <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1">Sign Up</button>
// //             </p>
// //         </div>
// //     );
// // };

// const LoginForm = ({ onSwitch }) => {
//     const handleSubmit = (e) => e.preventDefault();
//     return (
//         <>
//             <div className="text-center">
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to your account.</p>
//             </div>
            
//             <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
//                 <FormInputWithLabel id="email" label="Email" type="email" placeholder="you@example.com" icon={<EmailIcon />} />
//                 <FormInputWithLabel id="password" label="Password" type="password" placeholder="••••••••" icon={<LockIcon />} />
                
//                 <div className="flex justify-end text-sm">
//                     <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</a>
//                 </div>
                
//                 <button type="submit" className="mt-4 bg-gray-900 dark:bg-blue-600 border-transparent text-white text-base font-medium rounded-lg h-12 w-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors duration-200">
//                     Sign In
//                 </button>
//             </form>
            
//             <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
//                 Don't have an account?
//                 <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1 bg-transparent border-none p-0 cursor-pointer">Sign Up</button>
//             </p>
//         </>
//     );
// };
// export { LoginForm };


// src/components/auth/LoginForm.js

// import React, { useState } from 'react';
// import { EmailIcon, LockIcon } from '../../assets/icons';
// import { FormInputWithLabel } from './FormInputWithLabel';
// import { loginUser } from '../../services/authServices'; // Import the API function

// export const LoginForm = ({ onSwitch }) => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         // Use e.target.id to update the correct state field
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         if (!formData.email || !formData.password) {
//             setError('Please enter both email and password.');
//             return;
//         }

//         setLoading(true);
//         try {
//             const data = await loginUser(formData);
            
//             // On successful login, save the token
//             localStorage.setItem('token', data.token);
            
//             // Redirect to a protected route (e.g., dashboard)
//             // Using window.location.href is a simple way to redirect.
//             // In a larger app, you'd use React Router's `useNavigate`.
//             window.location.href = '/dashboard'; 
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <div className="text-center">
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to your account.</p>
//             </div>
            
//             <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
//                 <FormInputWithLabel id="email" label="Email" type="email" placeholder="you@example.com" icon={<EmailIcon />} value={formData.email} onChange={handleChange} />
//                 <FormInputWithLabel id="password" label="Password" type="password" placeholder="••••••••" icon={<LockIcon />} value={formData.password} onChange={handleChange} />
                
//                 <div className="flex justify-end text-sm">
//                     <a href="#/forgot-password" className="font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</a>
//                 </div>
                
//                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//                 <button type="submit" disabled={loading} className="mt-4 bg-gray-900 dark:bg-blue-600 border-transparent text-white text-base font-medium rounded-lg h-12 w-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400">
//                     {loading ? 'Signing In...' : 'Sign In'}
//                 </button>
//             </form>
            
//             <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
//                 Don't have an account?
//                 <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1 bg-transparent border-none p-0 cursor-pointer">Sign Up</button>
//             </p>
//         </>
//     );
// };


import React, { useState } from 'react';
import { EmailIcon, LockIcon } from '../../assets/icons';
import { FormInputWithLabel } from './FormInputWithLabel';
import { toast } from 'react-toastify'; // Import toast
import { loginUserApi } from '../../api/authApi';

export const LoginForm = ({ onSwitch }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    // We no longer need the 'error' state
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password.'); // Show error toast
            return;
        }

        setLoading(true);
        try {
            const data = await loginUserApi(formData);
            
            // Show a success toast before redirecting
            toast.success('Login successful! Redirecting...');

            localStorage.setItem('token', data.token);
            
            // Redirect after a short delay to allow the user to see the toast
            setTimeout(() => {
                window.location.href = '/dashboard'; 
            }, 1500); // 1.5-second delay

        } catch (err) {
            toast.error(err.message); // Show error toast from API
        } finally {
            setLoading(false);
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
                
                <div className="flex justify-end text-sm">
                    <a href="#/forgot-password" className="font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</a>
                </div>
                
                {/* The error p tag is no longer needed */}

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