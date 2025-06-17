
// Footer.jsx

import React, { useState } from 'react';
import { MotoFixLogo } from '../assets/MotoFixLogo';

const navbarStyle = "bg-white shadow-md sticky top-0 z-50";

// export const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className={navbarStyle}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">

//           {/* Left: Logo pushed more left */}
//           <div className="flex-shrink-0 mr-auto">
//             <a href="#/">
//               <MotoFixLogo />
//             </a>
//           </div>

//           {/* Center: Nav Links with slightly bigger font and less spacing */}
//           <div className="hidden md:flex flex-1 justify-center space-x-6">
//             <a href="#/" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Home</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Services</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">About Us</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Contact</a>
//           </div>

//           {/* Right: Slim & elegant Login / Signup with hover changes */}
//           <div className="hidden md:flex items-center space-x-3 ml-auto">
//             <a
//               href="#/login"
//               className="px-4 py-1.5 text-base font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
//             >
//               Login
//             </a>
//             <a
//               href="#/signup"
//               className="px-4 py-1.5 text-base font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
//             >
//               Register
//             </a>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="flex md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               type="button"
//               className="bg-gray-100 p-2 rounded-md text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
//             >
//               <span className="sr-only">Toggle menu</span>
//               {!isMenuOpen ? (
//                 <svg
//                   className="h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               ) : (
//                 <svg
//                   className="h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
//         <div className="px-4 pt-2 pb-3 space-y-1">
//           <a href="#/" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Home</a>
//           <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Services</a>
//           <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">About Us</a>
//           <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Contact</a>
//           <a href="#/login" className="block border border-blue-600 text-blue-600 px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-600 hover:text-white transition">Login</a>
//           <a href="#/signup" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-700 transition">Sign Up</a>
//         </div>
//       </div>
//     </nav>
//   );
// };


export const Footer = () => {
  return (
    
    <footer className="bg-white border-t">
      {/* Main padding reduced from py-12 to py-8 */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Gap between columns reduced from gap-8 to gap-6 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Spacing within this column reduced from space-y-4 to space-y-3 */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <MotoFixLogo />
                </div>
                <p className="text-gray-500 text-base">Your one-stop workshop for 2-wheeler servicing with hassle-free pick and drop.</p>
                <div className="flex items-center space-x-4">
                    {/* Instagram Icon */}
                    <a href="https://www.instagram.com/messipaaglu/" target="_blank" rel="noopener noreferrer" className="text-gray-400 group">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6 fill-current group-hover:fill-[#E1306C] transition-colors duration-300" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.2,5.2 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.2,5.2 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                        </svg>
                    </a>
                    {/* X (Twitter) Icon */}
                    <a href="https://x.com/seducedop" target="_blank" rel="noopener noreferrer" className="text-gray-400 group">
                        <span className="sr-only">X</span>
                        <svg className="h-6 w-6 fill-current group-hover:fill-black transition-colors duration-300" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                    {/* LinkedIn Icon with Hover Swap */}
                    <a href="https://www.linkedin.com/in/dipendra-ghimire-62b25a345/" target="_blank" rel="noopener noreferrer" className="text-gray-400 group">
                        <span className="sr-only">LinkedIn</span>
                        {/* Default SVG Icon */}
                        <svg className="h-6 w-6 fill-current block group-hover:hidden" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-8 12H7V9h4v6zm-2-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 7h-4v-3a2 2 0 0 0-4 0v3H7V9h4v1.1c.5-.9 1.6-1.6 3.2-1.6 3.5 0 4.8 2.3 4.8 5.3V15z" />
                        </svg>
                        {/* Hover Image Icon */}
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png"
                            alt="LinkedIn"
                            className="h-6 w-auto hidden group-hover:block"
                        />
                    </a>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Quick Links</h3>
                 {/* Spacing within this list reduced */}
                <ul className="mt-3 space-y-3">
                    <li><a href="#services" className="text-base text-gray-500 hover:text-gray-900">Services</a></li>
                    <li><a href="#about" className="text-base text-gray-500 hover:text-gray-900">About Us</a></li>
                    <li><a href="#contact" className="text-base text-gray-500 hover:text-gray-900">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Contact Info</h3>
                {/* Spacing within this list reduced */}
                <ul className="mt-3 space-y-3">
                    <li className="text-base text-gray-500">Kathmandu, Nepal</li>
                    <li className="text-base text-gray-500">(+977) 9849423853</li>
                    <li className="text-base text-gray-500">contact@motofix.com</li>
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Newsletter</h3>
                <p className="mt-3 text-base text-gray-500">Subscribe for updates.</p>
                <form className="mt-3 sm:flex sm:max-w-md">
                    <input type="email" required className="appearance-none min-w-0 w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" placeholder="Enter your email" />
                    <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                        <button type="submit" className="w-full bg-blue-600 flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none">
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
        </div>
        {/* Spacing for the copyright section reduced */}
        <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-base text-black xl:text-center">&copy; 2025 MotoFix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
