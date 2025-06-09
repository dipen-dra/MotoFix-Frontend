import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

const cardStyle = "bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden";

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const handleHashChange = () => {
            setIsLogin(window.location.hash !== '#/signup');
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on initial load
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full grid md:grid-cols-2 items-center gap-0">
                <div className="hidden md:block">
                     <img 
                        src="https://i.pinimg.com/736x/94/3c/ab/943cab838d74c0ae940d2a239b82e3f6.jpg" 
                        alt="Motorbike workshop" 
                        className="w-full h-full object-cover rounded-l-2xl"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x800/374151/ffffff?text=MotoFix'; }}
                    />
                </div>
                <div className={cardStyle + " md:rounded-l-none rounded-r-2xl"}>
                    {isLogin ? <LoginForm onSwitch={() => { window.location.hash = '#/signup'; }} /> : <SignupForm onSwitch={() => { window.location.hash = '#/login'; }} />}
                </div>
            </div>
        </div>
    );
};