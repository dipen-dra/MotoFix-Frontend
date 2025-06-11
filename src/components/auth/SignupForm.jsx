// // import React from 'react';
// // import { UserIcon, EmailIcon, PhoneIcon, LockIcon } from '../../assets/icons';
// // import { FormInputWithLabel } from './FormInputWithLabel';

// // // export const SignupForm = ({ onSwitch }) => {
// // //     const handleSubmit = (e) => e.preventDefault();
// // //     return (
// // //         <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
// // //              <div className="text-center">
// // //                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
// // //                 <p className="text-gray-500 dark:text-gray-400 mt-2">Join us and get your bike serviced!</p>
// // //             </div>
// // //             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
// // //                 <FormInputWithLabel id="name" label="Full Name" type="text" placeholder="Enter your full name" icon={<UserIcon />} />
// // //                 <FormInputWithLabel id="email" label="Email" type="email" placeholder="Enter your email" icon={<EmailIcon />} />
// // //                 <FormInputWithLabel id="phone" label="Phone Number" type="tel" placeholder="Enter your phone number" icon={<PhoneIcon />} />
// // //                 <FormInputWithLabel id="password" label="Password" type="password" placeholder="Enter your password" icon={<LockIcon />} />
// // //                 <button type="submit" className="mt-4 bg-gray-900 dark:bg-blue-600 border-none text-white text-base font-medium rounded-lg h-12 w-full cursor-pointer hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors">
// // //                     Create Account
// // //                 </button>
// // //             </form>
// // //             <p className="text-center text-sm text-gray-500 dark:text-gray-400">
// // //                 Already have an account?
// // //                 <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1">Sign In</button>
// // //             </p>
// // //         </div>
// // //     );
// // // };


// // const SignupForm = ({ onSwitch }) => {
// //     const handleSubmit = (e) => e.preventDefault();
// //     return (
// //         <>
// //             <div className="text-center">
// //                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
// //                 <p className="text-gray-500 dark:text-gray-400 mt-2">Join us and start your journey.</p>
// //             </div>
            
// //             <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
// //                 <FormInputWithLabel id="fullName" label="Full Name" type="text" placeholder="John Doe" icon={<UserIcon />} />
// //                 <FormInputWithLabel id="signup-email" label="Email Address" type="email" placeholder="you@example.com" icon={<EmailIcon />} />
// //                 <FormInputWithLabel id="signup-password" label="Password" type="password" placeholder="Create a strong password" icon={<LockIcon />} />

// //                 <button type="submit" className="mt-4 bg-gray-900 dark:bg-blue-600 border-transparent text-white text-base font-medium rounded-lg h-12 w-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors duration-200">
// //                     Create Account
// //                 </button>
// //             </form>
            
// //             <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
// //                 Already have an account?
// //                 <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1 bg-transparent border-none p-0 cursor-pointer">Sign In</button>
// //             </p>
// //         </>
// //     );
// // };

// // export { SignupForm };


// // src/components/auth/SignupForm.js

// import React, { useState } from 'react';
// import { UserIcon, EmailIcon, LockIcon } from '../../assets/icons';
// import { FormInputWithLabel } from './FormInputWithLabel';
// import { toast } from 'react-toastify'; // Import toast
// import { registerUserApi } from '../../api/authApi';


// export const SignupForm = ({ onSwitch }) => {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         password: '',
//     });
//     // We no longer need 'error' and 'success' states
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.fullName || !formData.email || !formData.password) {
//             toast.error('Please fill in all fields.'); // Show error toast
//             return;
//         }
        
//         setLoading(true);
//         try {
//             const data = await registerUserApi(formData);
//             toast.success(data.message + " You can now sign in."); // Show success toast
//             setFormData({ fullName: '', email: '', password: '' }); 
//         } catch (err) {
//             toast.error(err.message); // Show error toast from API
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <div className="text-center">
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-2">Join us and start your journey.</p>
//             </div>
            
//             <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
//                 <FormInputWithLabel id="fullName" label="Full Name" type="text" placeholder="John Doe" icon={<UserIcon />} value={formData.fullName} onChange={handleChange} />
//                 <FormInputWithLabel id="email" label="Email Address" type="email" placeholder="you@example.com" icon={<EmailIcon />} value={formData.email} onChange={handleChange} />
//                 <FormInputWithLabel id="password" label="Password" type="password" placeholder="Create a strong password" icon={<LockIcon />} value={formData.password} onChange={handleChange} />

//                 {/* The error and success p tags are no longer needed */}

//                 <button type="submit" disabled={loading} className="mt-4 bg-gray-900 dark:bg-blue-600 border-transparent text-white text-base font-medium rounded-lg h-12 w-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400">
//                     {loading ? 'Creating Account...' : 'Create Account'}
//                 </button>
//             </form>
            
//             <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
//                 Already have an account?
//                 <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1 bg-transparent border-none p-0 cursor-pointer">Sign In</button>
//             </p>
//         </>
//     );
// };


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