// import React, { useState, useEffect } from 'react';
// import { HomePage } from '../pages/HomePage';
// import { AuthPage } from '../pages/AuthPage';
// import { ToastContainer } from 'react-toastify'; // Import ToastContainer
// import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

// export const AppRouter = () => {
//   const [route, setRoute] = useState(window.location.hash);

//   useEffect(() => {
//     const handleHashChange = () => {
//       setRoute(window.location.hash);
//     };

//     window.addEventListener('hashchange', handleHashChange);
//     if (!window.location.hash) {
//         window.location.hash = '#/';
//     }
    
//     return () => window.removeEventListener('hashchange', handleHashChange);
//   }, []);

//   let CurrentPage;
//   switch (route) {
//     case '#/login':
//     case '#/signup':
//       CurrentPage = AuthPage;
//       break;
//     case '#/':
//     default:
//       CurrentPage = HomePage;
//       break;
//   }
  
//   return (
//     <>
//       <CurrentPage />
//       {/* Add the ToastContainer here. You can configure it as you like. */}
//       <ToastContainer
//         position="bottom-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// };

// export default AppRouter;


// src/routers/AppRouter.jsx
import React, { useState, useEffect } from 'react';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import AdminDashboard from '../pages/admin/adminDashboardPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AppRouter = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
        window.location.hash = '#/';
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let CurrentPage;

  // Check if the route is part of the admin panel
  if (route.startsWith('#/admin/')) {
      if (localStorage.getItem('userRole') === 'admin') {
          CurrentPage = AdminDashboard;
      } else {
          // If a non-admin tries to access, redirect to login
          window.location.hash = '#/login';
          CurrentPage = AuthPage;
      }
  } else {
      // Handle all other public routes
      switch (route) {
          case '#/login':
          case '#/signup':
              CurrentPage = AuthPage;
              break;
          case '#/':
          default:
              CurrentPage = HomePage;
              break;
      }
  }

  return (
    <>
      <CurrentPage />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default AppRouter;




// import React, { useState, useEffect } from 'react';
// import { HomePage } from '../pages/HomePage';
// import { AuthPage } from '../pages/AuthPage';
// import App from '../pages/admin/adminDashboardPage'; // Import the admin dashboard (rename if needed)
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Mock function to decode JWT and check user role (replace with actual implementation)
// const getUserRole = () => {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
//   try {
//     // Replace this with actual JWT decoding (e.g., using jwt-decode library)
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.role; // Assume the token contains a 'role' field (e.g., 'admin' or 'user')
//   } catch (err) {
//     return null;
//   }
// };

// export const AppRouter = () => {
//   const [route, setRoute] = useState(window.location.hash);

//   useEffect(() => {
//     const handleHashChange = () => {
//       setRoute(window.location.hash);
//     };

//     window.addEventListener('hashchange', handleHashChange);
//     if (!window.location.hash) {
//       window.location.hash = '#/';
//     }

//     return () => window.removeEventListener('hashchange', handleHashChange);
//   }, []);

//   const isAuthenticated = !!localStorage.getItem('token');
//   const userRole = getUserRole();

//   let CurrentPage;
//   switch (route) {
//     case '#/login':
//     case '#/signup':
//       CurrentPage = AuthPage;
//       break;
//     case '#/dashboard':
//     case '#/bookings':
//     case '#/users':
//     case '#/services':
//     case '#/profile':
//       if (isAuthenticated && userRole === 'admin') {
//         CurrentPage = App; // Admin dashboard
//       } else {
//         CurrentPage = AuthPage; // Redirect to login if not authenticated or not admin
//         window.location.hash = '#/login';
//       }
//       break;
//     case '#/':
//     default:
//       CurrentPage = HomePage;
//       break;
//   }

//   return (
//     <>
//       <CurrentPage />
//       <ToastContainer
//         position="bottom-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// };

// export default AppRouter;