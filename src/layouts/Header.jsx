// // Header.jsx
// import React, { useState } from 'react';
// import { MotoFixLogo } from '../assets/MotoFixLogo';

// const navbarStyle = "bg-white shadow-md sticky top-0 z-50";

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



import React, { useState, useEffect } from 'react';
import { MotoFixLogo } from '../assets/MotoFixLogo';

const navbarStyle = "bg-white shadow-md sticky top-0 z-50";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isLoginPage = hash === '#/login';
  const isSignupPage = hash === '#/signup';

  const commonLinkClass = "px-4 py-1.5 text-base font-medium border border-blue-600 rounded-md transition";
  const activeLinkClass = "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed";
  const enabledLinkClass = "text-blue-600 hover:bg-blue-600 hover:text-white";

  return (
    <nav className={navbarStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 mr-auto">
            <a href="#/">
              <MotoFixLogo />
            </a>
          </div>

          {/* Center nav */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            <a href="#/" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Home</a>
            <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Services</a>
            <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">About Us</a>
            <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Contact</a>
          </div>

          {/* Right: Login/Signup */}
          <div className="hidden md:flex items-center space-x-3 ml-auto">
            <a
              href={isLoginPage ? undefined : "#/login"}
              className={`${commonLinkClass} ${isLoginPage ? activeLinkClass : enabledLinkClass}`}
              onClick={e => isLoginPage && e.preventDefault()}
            >
              Login
            </a>
            <a
              href={isSignupPage ? undefined : "#/signup"}
              className={`${commonLinkClass} ${isSignupPage ? activeLinkClass : enabledLinkClass}`}
              onClick={e => isSignupPage && e.preventDefault()}
            >
              Register
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-100 p-2 rounded-md text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          <a href="#/" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Home</a>
          <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Services</a>
          <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">About Us</a>
          <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Contact</a>
          <a
            href={isLoginPage ? undefined : "#/login"}
            className={`block px-3 py-2 rounded-md text-lg font-medium transition ${isLoginPage ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
            onClick={e => isLoginPage && e.preventDefault()}
          >
            Login
          </a>
          <a
            href={isSignupPage ? undefined : "#/signup"}
            className={`block px-3 py-2 rounded-md text-lg font-medium transition ${isSignupPage ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            onClick={e => isSignupPage && e.preventDefault()}
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
};
export default Header;
// This code defines a responsive header component for a web application.
// It includes a logo, navigation links, and login/signup buttons that adapt based on the current page.

