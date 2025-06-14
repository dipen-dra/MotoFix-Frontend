

import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

// Main App component that handles the authentication page layout
// It switches between login and signup forms based on the URL hash.


export default function App() {
    const [isLogin, setIsLogin] = useState(true);

    // This effect handles switching between login and signup based on the URL hash.
    useEffect(() => {
        const handleHashChange = () => {
            setIsLogin(window.location.hash !== '#/signup');
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on initial load
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-sans p-4 antialiased">
            {/* The main card container */}
            <div className="max-w-4xl w-full grid md:grid-cols-2 items-stretch rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Image Section: This will now have the same height as the form */}
                <div className="hidden md:block">
                     <img 
                        src="https://pplx-res.cloudinary.com/image/upload/v1749478483/gpt4o_images/oziuai3wafnxufaqcfei.png"
                        alt="A classic motorbike in a workshop" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x800/1f2937/ffffff?text=MotoFix'; }}
                    />
                </div>

                {/* Form Section: Stretches to match image height and centers its content */}
                <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 flex flex-col justify-center">
                    {isLogin 
                        ? <LoginForm onSwitch={() => { window.location.hash = '#/signup'; }} /> 
                        : <SignupForm onSwitch={() => { window.location.hash = '#/login'; }} />
                    }
                </div>
                
            </div>
        </div>
    );
};

export { App as AuthPage };