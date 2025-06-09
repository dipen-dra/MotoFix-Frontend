import React from 'react';
import { MotoFixLogo } from '../assets/MotoFixLogo';
import { SocialIcon } from '../assets/icons';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
                 <div className="flex items-center space-x-2"><MotoFixLogo /><span className="text-2xl font-bold text-white">MotoFix</span></div>
                 <p className="text-gray-400 text-base">Your one-stop workshop for 2-wheeler servicing with hassle-free pick and drop.</p>
                 <div className="flex space-x-6">
                    <SocialIcon href="https://www.instagram.com/messipaaglu/" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.2,5.2 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.2,5.2 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                    <SocialIcon href="https://x.com/seducedop" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    <SocialIcon href="https://www.linkedin.com/in/dipendra-ghimire-62b25a345/" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-8 12H7V9h4v6zm-2-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 7h-4v-3a2 2 0 0 0-4 0v3H7V9h4v1.1c.5-.9 1.6-1.6 3.2-1.6 3.5 0 4.8 2.3 4.8 5.3V15z" />
                </div>
            </div>
            <div>
                 <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Quick Links</h3>
                 <ul className="mt-4 space-y-4">
                     <li><a href="#services" className="text-base text-gray-400 hover:text-white">Services</a></li>
                     <li><a href="#about" className="text-base text-gray-400 hover:text-white">About Us</a></li>
                     <li><a href="#contact" className="text-base text-gray-400 hover:text-white">Contact Us</a></li>
                 </ul>
            </div>
            <div>
                 <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact Info</h3>
                 <ul className="mt-4 space-y-4">
                     <li className="text-base text-gray-400">Kathmandu, Nepal</li>
                     <li className="text-base text-gray-400">(+977) 9849423853</li>
                     <li className="text-base text-gray-400">contact@motofix.com</li>
                 </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Newsletter</h3>
                <p className="mt-4 text-base text-gray-400">Subscribe for updates.</p>
                <form className="mt-4 sm:flex sm:max-w-md">
                    <input type="email" required className="appearance-none min-w-0 w-full bg-white dark:bg-gray-700 border border-transparent rounded-md py-2 px-4 text-base text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400" placeholder="Enter your email" />
                    <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                        <button type="submit" className="w-full bg-blue-600 flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none">
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8"><p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} MotoFix. All rights reserved.</p></div>
      </div>
    </footer>
  );
};