// import React, { useState } from 'react';
// import { MotoFixLogo } from '../assets/MotoFixLogo';

// const navbarStyle ="bg-white dark:bg-white shadow-md sticky top-0 z-50";

// export const Header = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
    
//     return (
//         <nav className={navbarStyle}>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-20">
//                     <div className="flex items-center">
//                         <a href="#/" className="flex-shrink-0 flex items-center space-x-2">
//                             <MotoFixLogo />
//                             <span className="text-2xl font-bold text-gray-800 dark:text-white">MotoFix</span>
//                         </a>
//                     </div>
//                     <div className="hidden md:block">
//                         <div className="ml-10 flex items-baseline space-x-4">
//                             <a href="#/" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</a>
//                             <a href="#" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Services</a>
//                             <a href="#" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">About Us</a>
//                             <a href="#" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
//                         </div>
//                     </div>
//                     <div className="hidden md:block">
//                          <a href="#/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Login / Sign Up</a>
//                     </div>
//                     <div className="-mr-2 flex md:hidden">
//                         <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-gray-200 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
//                             <span className="sr-only">Open main menu</span>
//                             <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                             </svg>
//                             <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
//                 <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                     <a href="#/" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Home</a>
//                     <a href="#" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Services</a>
//                     <a href="#/login" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Login</a>
//                     <a href="#/signup" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Sign Up</a>
//                 </div>
//             </div>
//         </nav>
//     );
// };


// import React, { useState } from 'react';
// import { MotoFixLogo } from '../assets/MotoFixLogo';

// const navbarStyle = "bg-white shadow-md sticky top-0 z-50";

// export const Header = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
    
//     return (
//         <nav className={navbarStyle}>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-20">
//                     <div className="flex items-center">
//                         <a href="#/" className="flex-shrink-0 flex items-center space-x-2">
//                             <MotoFixLogo />
//                             <span className="text-2xl font-bold text-black">MotoFix</span>
//                         </a>
//                     </div>
//                     <div className="hidden md:block">
//                         <div className="ml-10 flex items-baseline space-x-4">
//                             <a href="#/" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Home</a>
//                             <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Services</a>
//                             <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">About Us</a>
//                             <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
//                         </div>
//                     </div>
//                     <div className="hidden md:block">
//                          <a href="#/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Login / Sign Up</a>
//                     </div>
//                     <div className="-mr-2 flex md:hidden">
//                         <button
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                             type="button"
//                             className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
//                         >
//                             <span className="sr-only">Open main menu</span>
//                             <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                             </svg>
//                             <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
//                 <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                     <a href="#/" className="text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Home</a>
//                     <a href="#" className="text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Services</a>
//                     <a href="#/login" className="text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Login</a>
//                     <a href="#/signup" className="text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Sign Up</a>
//                 </div>
//             </div>
//         </nav>
//     );
// };
// export default Header;
// export { MotoFixLogo } from '../assets/MotoFixLogo';



//best till

// import React, { useState } from 'react';
// import { MotoFixLogo } from '../assets/MotoFixLogo';

// const navbarStyle = "bg-white shadow-md sticky top-0 z-50";

// export const Header = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     return (
//         <nav className={navbarStyle}>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-20">
                    
//                     {/* Left: Logo */}
//                     <div className="flex-shrink-0">
//                         <a href="#/">
//                             <MotoFixLogo />
//                         </a>
//                     </div>

//                     {/* Center: Nav Links */}
//                     <div className="hidden md:flex flex-1 justify-center space-x-6">
//                         <a href="#/" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Home</a>
//                         <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Services</a>
//                         <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">About Us</a>
//                         <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
//                     </div>

//                     {/* Right: Login / Signup */}
//                     <div className="hidden md:flex items-center space-x-4">
//                         <a href="#/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Login</a>
//                         <a href="#/signup" className="bg-gray-200 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition">Sign Up</a>
//                     </div>

//                     {/* Mobile Menu Button */}
//                     <div className="flex md:hidden">
//                         <button
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                             type="button"
//                             className="bg-gray-100 p-2 rounded-md text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
//                         >
//                             <span className="sr-only">Toggle menu</span>
//                             {!isMenuOpen ? (
//                                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                                 </svg>
//                             ) : (
//                                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Menu */}
//             <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
//                 <div className="px-4 pt-2 pb-3 space-y-1">
//                     <a href="#/" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">Home</a>
//                     <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">Services</a>
//                     <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">About Us</a>
//                     <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">Contact</a>
//                     <a href="#/login" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium">Login</a>
//                     <a href="#/signup" className="block bg-gray-200 text-black px-3 py-2 rounded-md text-base font-medium">Sign Up</a>
//                 </div>
//             </div>
//         </nav>
//     );
// };


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

//           {/* Center: Nav Links with slightly bigger font */}
//           <div className="hidden md:flex flex-1 justify-center space-x-10">
//             <a href="#/" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">Home</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">Services</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">About Us</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">Contact</a>
//           </div>

//           {/* Right: Login / Signup pushed more right */}
//           <div className="hidden md:flex items-center space-x-6 ml-auto">
//             <a
//               href="#/login"
//               className="px-6 py-2 text-lg font-medium border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition"
//             >
//               Login
//             </a>
//             <a
//               href="#/signup"
//               className="px-6 py-2 text-lg font-medium bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
//             >
//               Sign Up
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
//           <a href="#/login" className="block border-2 border-blue-600 text-blue-600 px-3 py-2 rounded-full text-lg font-medium hover:bg-blue-50">Login</a>
//           <a href="#/signup" className="block bg-blue-600 text-white px-3 py-2 rounded-full text-lg font-medium hover:bg-blue-700">Sign Up</a>
//         </div>
//       </div>
//     </nav>
//   );
// };
// export default Header;
// export { MotoFixLogo } from '../assets/MotoFixLogo';



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

//           {/* Center: Nav Links with slightly bigger font */}
//           <div className="hidden md:flex flex-1 justify-center space-x-10">
//             <a href="#/" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">Home</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">Services</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">About Us</a>
//             <a href="#" className="text-black hover:bg-gray-200 px-4 py-2 rounded-md text-lg font-semibold">Contact</a>
//           </div>

//           {/* Right: Slim & elegant Login / Signup */}
//           <div className="hidden md:flex items-center space-x-4 ml-auto">
//             <a
//               href="#/login"
//               className="px-4 py-1.5 text-base font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
//             >
//               Login
//             </a>
//             <a
//               href="#/signup"
//               className="px-4 py-1.5 text-base font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
//             >
//               Sign Up
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
//           <a href="#/login" className="block border border-blue-600 text-blue-600 px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-50">Login</a>
//           <a href="#/signup" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-700">Sign Up</a>
//         </div>
//       </div>
//     </nav>
//   );
// };


import React, { useState } from 'react';
import { MotoFixLogo } from '../assets/MotoFixLogo';

const navbarStyle = "bg-white shadow-md sticky top-0 z-50";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={navbarStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: Logo pushed more left */}
          <div className="flex-shrink-0 mr-auto">
            <a href="#/">
              <MotoFixLogo />
            </a>
          </div>

          {/* Center: Nav Links with slightly bigger font and less spacing */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            <a href="#/" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Home</a>
            <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Services</a>
            <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">About Us</a>
            <a href="#" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Contact</a>
          </div>

          {/* Right: Slim & elegant Login / Signup with hover changes */}
          <div className="hidden md:flex items-center space-x-3 ml-auto">
            <a
              href="#/login"
              className="px-4 py-1.5 text-base font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </a>
            <a
              href="#/signup"
              className="px-4 py-1.5 text-base font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Register
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-100 p-2 rounded-md text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Toggle menu</span>
              {!isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          <a href="#/" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Home</a>
          <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Services</a>
          <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">About Us</a>
          <a href="#" className="block text-black hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Contact</a>
          <a href="#/login" className="block border border-blue-600 text-blue-600 px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-600 hover:text-white transition">Login</a>
          <a href="#/signup" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-700 transition">Sign Up</a>
        </div>
      </div>
    </nav>
  );
};

