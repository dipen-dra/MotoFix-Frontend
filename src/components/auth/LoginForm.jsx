
// import React, { useState } from 'react';
// import { EmailIcon, LockIcon } from '../../assets/icons';
// import { FormInputWithLabel } from './FormInputWithLabel';
// import { toast } from 'react-toastify'; // Import toast
// import { loginUserApi } from '../../api/authApi';

// export const LoginForm = ({ onSwitch }) => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     // We no longer need the 'error' state
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.email || !formData.password) {
//             toast.error('Please enter both email and password.'); // Show error toast
//             return;
//         }

//         setLoading(true);
//         try {
//             const data = await loginUserApi(formData);
            
//             // Show a success toast before redirecting
//             toast.success('Login successful!');

//             localStorage.setItem('token', data.token);
            
//             // Redirect after a short delay to allow the user to see the toast
//             setTimeout(() => {
//                 window.location.href = '#/'; 
//             }, 1500); // 1.5-second delay

//         } catch (err) {
//             toast.error(err.message); // Show error toast from API
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
                
//                 {/* The error p tag is no longer needed */}

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



// import React, { useState } from 'react';
// import { EmailIcon, LockIcon } from '../../assets/icons';
// import { FormInputWithLabel } from './FormInputWithLabel';
// import { toast } from 'react-toastify';
// import { loginUserApi } from '../../api/authApi';

// export const LoginForm = ({ onSwitch }) => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.email || !formData.password) {
//             toast.error('Please enter both email and password.');
//             return;
//         }

//         setLoading(true);
//         try {
//             const data = await loginUserApi(formData);
            
//             toast.success('Login successful!');
//             localStorage.setItem('token', data.token);
            
//             setTimeout(() => {
//                 window.location.href = '/'; 
//             }, 1500);

//         } catch (err) {
//             // --- MODIFICATION START ---
//             // Check if the error has a response from the server
//             if (err.response && err.response.data && err.response.data.message) {
//                 // Use the specific error message from your API response
//                 toast.error(err.response.data.message);
//             } else {
//                 // Handle network errors or other unexpected issues
//                 toast.error('An unexpected error occurred. Please try again.');
//             }
//             // --- MODIFICATION END ---
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

// export default LoginForm;


import React, { useState } from 'react';
import { EmailIcon, LockIcon } from '../../assets/icons';
import { FormInputWithLabel } from './FormInputWithLabel';
import { toast } from 'react-toastify';
import { loginUserApi } from '../../api/authApi';

export const LoginForm = ({ onSwitch }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const data = await loginUserApi(formData);
            
            toast.success('Login successful!');
            localStorage.setItem('token', data.token);
            
            setTimeout(() => {
                window.location.href = '/'; 
            }, 1500);

        } catch (err) {
            // --- MODIFICATION START ---
            // Check if the error has a response from the server
            if (err.response && err.response.data && err.response.data.message) {
                // Use the specific error message from your API response
                toast.error(err.response.data.message);
            } else {
                // Handle network errors or other unexpected issues
                toast.error('An unexpected error occurred. Please try again.');
            }
            // --- MODIFICATION END ---
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

export default LoginForm;