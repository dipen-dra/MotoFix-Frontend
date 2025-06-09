import React from 'react';
import { MotoFixLogo } from '../assets/MotoFixLogo';

const footerStyle = "bg-gray-800 dark:bg-gray-900 text-white py-8";

export const Footer = () => {
  return (
    <footer className={footerStyle}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
                <MotoFixLogo />
                <span className="text-2xl font-bold text-white">MotoFix</span>
            </div>
            <p className="text-gray-400 text-base">
              Your one-stop workshop for 2-wheeler servicing with hassle-free pick and drop.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Services</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">General Service</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Engine Repair</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Insurance Claims</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">FAQ</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} MotoFix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};