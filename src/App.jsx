// import React, { useContext } from 'react';
// import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Header from './layouts/Header';
// import Footer from './layouts/Footer';
// import { AuthPage } from './pages/AuthPage';
// import { AuthContext } from './auth/AuthContext';
// import ProtectedRoute from './routers/ProtectedRoutes';
// import HomePage from './pages/HomePage';
// import AdminDashboard from './pages/admin/adminDashboard';
// import UserDashboard from './pages/UserDashboard';
// import EsewaSuccess from './pages/EsewaSuccess';
// import EsewaFailure from './pages/EsewaFailure';
// import ForgotPasswordPage from './pages/ForgetPasswordPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
// import ChatbotComponent from '../src/components/chatbot/Chatbot'; // Correct import

// function App() {
//   const { user } = useContext(AuthContext);
//   const location = useLocation();

//   // Show chatbot on homepage for everyone, and on all pages for logged-in users.
//   const showChatbot = location.pathname === '/' || user;

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <ToastContainer
//         position="bottom-right"
//         autoClose={1500}
//         hideProgressBar
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       {!user && <Header />}

//       <main className="flex-grow w-full">
//         <Routes>
//           <Route
//             path="/"
//             element={!user ? <HomePage /> : <Navigate to="/dashboard" replace />}
//           />
//           <Route
//             path="/login"
//             element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
//           />
//           <Route
//             path="/register"
//             element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
//           />
//           <Route
//             path="/forgot-password"
//             element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />}
//           />
//           <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 {user?.data.role === 'admin' ? (
//                   <AdminDashboard />
//                 ) : (
//                   <UserDashboard />
//                 )}
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/user/my-payments"
//             element={
//               <ProtectedRoute>
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/payment/esewa/success"
//             element={
//               <ProtectedRoute>
//                 <EsewaSuccess />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/payment/esewa/failure"
//             element={
//               <ProtectedRoute>
//                 <EsewaFailure />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//       {!user && location.pathname !== "/forgot-password" && <Footer />}

//       {/* Render chatbot based on the logic */}
//       {showChatbot && <ChatbotComponent />}
//     </div>
//   );
// }

// export default App;




import React, { useContext } from 'react';
// 💡 We only need these imports from react-router-dom in this file
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './layouts/Header';
import Footer from './layouts/Footer';
import { AuthPage } from './pages/AuthPage';
import { AuthContext } from './auth/AuthContext';
import ProtectedRoute from './routers/ProtectedRoutes';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/adminDashboard';
import UserDashboard from './pages/UserDashboard';
import EsewaSuccess from './pages/EsewaSuccess';
import EsewaFailure from './pages/EsewaFailure';
import ForgotPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// A component to determine which dashboard to show upon login or when accessing /dashboard
const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to the correct dashboard root based on user role
  if (user.data.role === 'admin') {
    // Admin dashboard uses hash-based routing, so we navigate to its root hash
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/user" replace />;
};


function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Determine if the header and footer should be shown.
  // They should NOT appear on any dashboard pages.
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      {!isDashboardRoute && !user && <Header />}

      <main className="flex-grow w-full">
        <Routes>
          {/* Public Routes - redirect if logged in */}
          <Route path="/" element={!user ? <HomePage /> : <DashboardRedirect />} />
          <Route path="/login" element={!user ? <AuthPage /> : <DashboardRedirect />} />
          <Route path="/register" element={!user ? <AuthPage /> : <DashboardRedirect />} />
          <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <DashboardRedirect />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* A generic /dashboard route to redirect users correctly */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          
          {/* The wildcard '*' is crucial. It tells React Router that AdminDashboard and UserDashboard
            will handle all routes that start with /admin/ and /user/ respectively.
            This allows their internal hash-based navigation to work.
          */}
          <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user/*" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />

          {/* Payment Routes */}
          <Route path="/payment/esewa/success" element={<ProtectedRoute><EsewaSuccess /></ProtectedRoute>} />
          <Route path="/payment/esewa/failure" element={<ProtectedRoute><EsewaFailure /></ProtectedRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {!isDashboardRoute && !user && <Footer />}

    </div>
  );
}

// We export App directly. The Router should be in your main.jsx file.
export default App;
