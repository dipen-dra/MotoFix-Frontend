import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import Lottie from 'lottie-react';

import loginAnimation from '../animations/loginanimation.json';
export default function App() {
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const handleHashChange = () => {
            setIsLogin(window.location.hash !== '#/signup');
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-sans p-4 antialiased">
            {/* The main card container - I've changed max-w-4xl to max-w-5xl */}
            <div className="max-w-5xl w-full grid md:grid-cols-2 items-stretch rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Animation Section */}
                <div className="hidden md:flex items-center justify-center bg-gray-200 dark:bg-gray-800 p-6">
                    <Lottie 
                        animationData={loginAnimation}
                        loop={true}
                        className="w-full h-full"
                    />
                </div>

                {/* Form Section */}
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


