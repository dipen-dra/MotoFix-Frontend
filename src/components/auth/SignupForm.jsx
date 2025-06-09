import React from 'react';
import { UserIcon } from './UserIcon';
import { EmailIcon } from './EmailIcon';
import { LockIcon } from './LockIcon';

const styles = {
  input: "w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:border-blue-500 focus:outline-none transition duration-300",
  button: "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105",
  link: "text-blue-500 hover:text-blue-400 font-semibold transition duration-300",
  inputIcon: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400",
};

export const SignupForm = ({ onSwitch }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Signup form submitted");
    };

    return (
        <div className="p-8 md:p-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-4">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Get started with MotoFix today!</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <div className={styles.inputIcon}><UserIcon /></div>
                    <input type="text" placeholder="Full Name" className={styles.input} required />
                </div>
                <div className="relative">
                    <div className={styles.inputIcon}><EmailIcon /></div>
                    <input type="email" placeholder="Email Address" className={styles.input} required />
                </div>
                <div className="relative">
                    <div className={styles.inputIcon}><LockIcon /></div>
                    <input type="password" placeholder="Password" className={styles.input} required />
                </div>
                <div>
                    <button type="submit" className={styles.button}>Create Account</button>
                </div>
            </form>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
                Already have an account?{' '}
                <button onClick={onSwitch} className={styles.link}>Sign in</button>
            </p>
        </div>
    );
};