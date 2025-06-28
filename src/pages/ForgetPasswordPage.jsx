

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { MotoFixLogo } from '../assets/MotoFixLogo';
// import { EmailIcon } from '../components/auth/EmailIcon';
// import { CheckCircleIcon } from '@heroicons/react/24/solid';

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState('');
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Password reset request for:', email);
//     setIsSubmitted(true);
//   };

//   // Style for the background image
//   const backgroundStyle = {
//     backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1750869942/gpt4o_images/fs0fegc302qccocfwsea.png')`,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//   };

//   return (
//     <div className="min-h-screen relative" style={backgroundStyle}>
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black opacity-60"></div>

//       <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-opacity duration-700 ease-in-out relative" style={{ opacity: isVisible ? 1 : 0 }}>
//           <div className="w-full max-w-lg space-y-8">
//             <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 pt-10 pb-8 animate-fade-in-up">
//               <div className="flex justify-center mb-6 animate-fade-in-down">
//                 <Link to="/">
//                   <MotoFixLogo className="h-28 w-auto" />
//                 </Link>
//               </div>
              
//               <div className="text-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   Forgot Password?
//                 </h2>
//                 <p className="mt-2 text-sm text-gray-600">
//                   No worries. We'll send a reset link to your email.
//                 </p>
//               </div>

//               {isSubmitted ? (
//                 <div className="text-center space-y-4 animate-fade-in">
//                   <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 animate-pulse" />
//                   <h3 className="text-xl font-semibold text-gray-800">Request Sent!</h3>
//                   <p className="text-sm text-gray-600">
//                     If an account with that email exists, a password reset link has been sent.
//                   </p>
//                   <Link
//                     to="/auth"
//                     className="inline-block bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
//                   >
//                     Return to Sign In
//                   </Link>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <EmailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//                       </div>
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         required
//                         autoComplete="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
//                         placeholder="you@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <button
//                       type="submit"
//                       className="w-full bg-gray-800 hover:bg-black text-white text-sm font-semibold py-3 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                     >
//                       Send Reset Link
//                     </button>
//                   </div>

//                   <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm">
//                     <span className="text-gray-600">Remembered your password?</span>{' '}
//                     <Link to="/auth" className="text-gray-800 hover:text-black font-medium">
//                       Sign In
//                     </Link>
//                   </div>
//                 </form>
//               )}
//             </div>
//              <p className="text-center text-xs text-white/80">
//                 &copy; {new Date().getFullYear()} MotoFix. All rights reserved.
//             </p>
//           </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { MotoFixLogo } from '../assets/MotoFixLogo';
import { EmailIcon } from '../components/auth/EmailIcon';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading indicator

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Make the API call to your backend
            await axios.post('/api/auth/forgot-password', { email });
            setIsSubmitted(true);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const backgroundStyle = {
        backgroundImage: `url('https://pplx-res.cloudinary.com/image/upload/v1750869942/gpt4o_images/fs0fegc302qccocfwsea.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="min-h-screen relative" style={backgroundStyle}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-opacity duration-700 ease-in-out relative" style={{ opacity: isVisible ? 1 : 0 }}>
                <div className="w-full max-w-lg space-y-8">
                    <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 pt-10 pb-8 animate-fade-in-up">
                        <div className="flex justify-center mb-6 animate-fade-in-down">
                            <Link to="/">
                                <MotoFixLogo className="h-28 w-auto" />
                            </Link>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Forgot Password?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                No worries. We'll send a reset link to your email.
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div className="text-center space-y-4 animate-fade-in">
                                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 animate-pulse" />
                                <h3 className="text-xl font-semibold text-gray-800">Request Sent!</h3>
                                <p className="text-sm text-gray-600">
                                    If an account with that email exists, a password reset link has been sent. Please check your inbox (and spam folder).
                                </p>
                                <Link
                                    to="/auth"
                                    className="inline-block bg-gray-800 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                                >
                                    Return to Sign In
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EmailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gray-800 hover:bg-black text-white text-sm font-semibold py-3 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </div>

                                <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm">
                                    <span className="text-gray-600">Remembered your password?</span>{' '}
                                    <Link to="/auth" className="text-gray-800 hover:text-black font-medium">
                                        Sign In
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                     <p className="text-center text-xs text-white/80">
                        &copy; {new Date().getFullYear()} MotoFix. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;