// // src/App.jsx

// import React, { useContext } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { AuthContext } from './auth/AuthContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Import Layouts and Components
// import Header from './layouts/Header';
// import Footer from './layouts/Footer';
// import ProtectedRoute from './routers/ProtectedRoutes'; // Use the corrected ProtectedRoute

// // Import Pages
// import { AuthPage } from './pages/AuthPage';
// import HomePage from './pages/HomePage';
// import UserDashboard from './pages/UserDashboard';
// import AdminDashboard from './pages/admin/adminDashboard';
// import EsewaSuccess from './pages/EsewaSuccess';
// import EsewaFailure from './pages/EsewaFailure';
// import ForgotPasswordPage from './pages/ForgetPasswordPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
// import NotFoundPage from './pages/NotFoundPage';

// // Helper component to redirect logged-in users away from public pages
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);
//   if (loading) return <div>Loading...</div>;
//   // If user is logged in, send them to their dashboard instead of the public page
//   return user ? <Navigate to="/dashboard" replace /> : children;
// };

// // Helper component to direct a logged-in user to the correct dashboard
// const DashboardRedirect = () => {
//   const { user, loading } = useContext(AuthContext);
//   if (loading) return <div>Loading user data...</div>;
//   if (!user) return <Navigate to="/login" replace />;

//   if (user.role === 'admin' || user.role === 'superadmin') {
//     return <Navigate to="/admin/dashboard" replace />;
//   }
//   return <Navigate to="/user/home" replace />; // User dashboard home
// };

// function App() {
//   const location = useLocation();

//   // Logic to show/hide Header and Footer
//   const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');
//   const hideOnPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/404'];
//   const shouldShowHeaderAndFooter = !isDashboardRoute && !hideOnPaths.some(path => location.pathname.startsWith(path));

//   // NO MORE useEffect for navigation. The routing is now declarative.

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
//       <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
//       {shouldShowHeaderAndFooter && <Header />}

//       <main className="flex-grow w-full">
//         <Routes>
//           {/* --- PUBLIC ROUTES --- */}
//           {/* These are only accessible to non-logged-in users */}
//           <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
//           <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
//           <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

//           {/* --- PAYMENT ROUTES (publicly accessible) --- */}
//           <Route path="/payment/esewa/success" element={<EsewaSuccess />} />
//           <Route path="/payment/esewa/failure" element={<EsewaFailure />} />

//           {/* --- PROTECTED ROUTES --- */}
//           {/* Generic /dashboard route that redirects based on role */}
//           <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

//           {/* Admin specific routes */}
//           <Route
//             path="/admin/*"
//             element={
//               <ProtectedRoute requiredRole="admin">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* User specific routes */}
//           <Route
//             path="/user/*"
//             element={
//               <ProtectedRoute requiredRole="normal">
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
          
//           {/* --- 404 CATCH-ALL ROUTE --- */}
//           <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//       </main>

//       {shouldShowHeaderAndFooter && <Footer />}
//     </div>
//   );
// }

// export default App;






// src/App.jsx

import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Layouts and Components
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import ProtectedRoute from './routers/ProtectedRoutes'; // Use the corrected ProtectedRoute

// Import Pages
import { AuthPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/adminDashboard';
import EsewaSuccess from './pages/EsewaSuccess';
import EsewaFailure from './pages/EsewaFailure';
import ForgotPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// Helper component to redirect logged-in users away from public pages
const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    // If user is logged in, send them to their dashboard instead of the public page
    return user ? <Navigate to="/dashboard" replace /> : children;
};

// Helper component to direct a logged-in user to the correct dashboard
const DashboardRedirect = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading user data...</div>;
    if (!user) return <Navigate to="/login" replace />;

    if (user.role === 'admin' || user.role === 'superadmin') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/user/home" replace />; // User dashboard home
};

function App() {
    const location = useLocation();

    // Determine if it's a dashboard route (admin or user)
    const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');

    // Paths where neither header nor footer should show (e.g., a pure 404 page)
    const hideAll = ['/404'];

    // Paths where *only* the header should show (e.g., auth pages)
    const showHeaderOnly = ['/login', '/register', '/forgot-password', '/reset-password'];

    // Determine if Header should be shown
    const shouldShowHeader = !isDashboardRoute && !hideAll.some(path => location.pathname.startsWith(path));

    // Determine if Footer should be shown
    // It should be shown if it's NOT a dashboard route AND NOT in hideAll AND NOT in showHeaderOnly
    const shouldShowFooter = !isDashboardRoute && !hideAll.some(path => location.pathname.startsWith(path)) && !showHeaderOnly.some(path => location.pathname.startsWith(path));

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

            {shouldShowHeader && <Header />}

            <main className="flex-grow w-full">
                <Routes>
                    {/* --- PUBLIC ROUTES --- */}
                    {/* These are only accessible to non-logged-in users */}
                    <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                    {/* --- PAYMENT ROUTES (publicly accessible) --- */}
                    <Route path="/payment/esewa/success" element={<EsewaSuccess />} />
                    <Route path="/payment/esewa/failure" element={<EsewaFailure />} />

                    {/* --- PROTECTED ROUTES --- */}
                    {/* Generic /dashboard route that redirects based on role */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

                    {/* Admin specific routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* User specific routes */}
                    <Route
                        path="/user/*"
                        element={
                            <ProtectedRoute requiredRole="normal">
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- 404 CATCH-ALL ROUTE --- */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            {shouldShowFooter && <Footer />}
        </div>
    );
}

export default App;