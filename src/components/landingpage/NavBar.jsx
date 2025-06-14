// import React, { useState } from 'react';

// export default function NavBar() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-gradient-to-r from-indigo-700 to-violet-500 transition-all">
//       {/* Logo */}
//       <a href="#">
//         <img
//           className="h-9"
//           src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoWhite.svg"
//           alt="dummyLogoWhite"
//         />
//       </a>

//       {/* Desktop Menu */}
//       <ul className="text-white md:flex hidden items-center gap-10">
//         <li><a className="hover:text-white/70 transition" href="#">Home</a></li>
//         <li><a className="hover:text-white/70 transition" href="#">Services</a></li>
//         <li><a className="hover:text-white/70 transition" href="#">Portfolio</a></li>
//         <li><a className="hover:text-white/70 transition" href="#">Pricing</a></li>
//       </ul>

//       {/* Desktop Button */}
//       <button
//         type="button"
//         className="bg-white text-gray-700 md:inline hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
//       >
//         Get started
//       </button>

//       {/* Mobile Menu Toggle Button */}
//       <button
//         aria-label="menu-btn"
//         type="button"
//         className="menu-btn inline-block md:hidden active:scale-90 transition"
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#fff">
//           <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
//         </svg>
//       </button>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="mobile-menu absolute top-[70px] left-0 w-full bg-gradient-to-r from-indigo-700 to-violet-500 p-6 md:hidden">
//           <ul className="flex flex-col space-y-4 text-white text-lg">
//             <li><a href="#" className="text-sm">Home</a></li>
//             <li><a href="#" className="text-sm">Services</a></li>
//             <li><a href="#" className="text-sm">Portfolio</a></li>
//             <li><a href="#" className="text-sm">Pricing</a></li>
//           </ul>
//           <button
//             type="button"
//             className="bg-white text-gray-700 mt-6 inline md:hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
//           >
//             Get started
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }
