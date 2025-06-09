import React from 'react';
import { EmailIcon, LockIcon } from '../../assets/icons';
import { FormInputWithLabel } from './FormInputWithLabel';

// export const LoginForm = ({ onSwitch }) => {
//     const handleSubmit = (e) => e.preventDefault();
//     return (
//         <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
//             <div className="text-center">
//                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-2">Login to access your account</p>
//             </div>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                 <FormInputWithLabel id="email" label="Email" type="email" placeholder="Enter your email" icon={<EmailIcon />} />
//                 <FormInputWithLabel id="password" label="Password" type="password" placeholder="Enter your password" icon={<LockIcon />} />
//                 <div className="flex justify-end text-sm">
//                     <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</a>
//                 </div>
//                 <button type="submit" className="mt-4 bg-gray-900 dark:bg-blue-600 border-none text-white text-base font-medium rounded-lg h-12 w-full cursor-pointer hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors">
//                     Sign In
//                 </button>
//             </form>
//             <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//                 Don't have an account?
//                 <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1">Sign Up</button>
//             </p>
//         </div>
//     );
// };

const LoginForm = ({ onSwitch }) => {
    const handleSubmit = (e) => e.preventDefault();
    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to your account.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <FormInputWithLabel id="email" label="Email" type="email" placeholder="you@example.com" icon={<EmailIcon />} />
                <FormInputWithLabel id="password" label="Password" type="password" placeholder="••••••••" icon={<LockIcon />} />
                
                <div className="flex justify-end text-sm">
                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</a>
                </div>
                
                <button type="submit" className="mt-4 bg-gray-900 dark:bg-blue-600 border-transparent text-white text-base font-medium rounded-lg h-12 w-full hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors duration-200">
                    Sign In
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Don't have an account?
                <button onClick={onSwitch} className="font-semibold text-blue-600 hover:text-blue-500 ml-1 bg-transparent border-none p-0 cursor-pointer">Sign Up</button>
            </p>
        </>
    );
};
export { LoginForm };
