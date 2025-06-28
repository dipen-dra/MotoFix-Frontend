import React, { useContext } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
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
// import EsewaSuccess from './pages/EsewaSuccess';
import EsewaFailure from './pages/EsewaFailure';
import ForgotPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {!user && <Header />}

      <main className="flex-grow w-full">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <HomePage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* ✅ Public Routes for eSewa payment redirects */}
          {/* <Route path="/payment/esewa/success" element={<EsewaSuccess />} /> */}
          <Route path="/payment/esewa/failure" element={<EsewaFailure />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.data.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/my-payments"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!user && location.pathname !== "/forgot-password" && <Footer />}
    </div>
  );
}

export default App;
