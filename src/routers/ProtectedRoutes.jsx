// src/routers/ProtectedRoutes.jsx

import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { toast } from 'react-toastify';

// A small helper component to handle the side effect of showing a toast before redirecting.
const RedirectWithToast = ({ to, message }) => {
  useEffect(() => {
    // This effect runs only once after the component mounts.
    toast.error(message);
  }, [message]); // Dependency array ensures it only runs when the message changes

  // This component's only job is to render the Navigate component.
  return <Navigate to={to} replace />;
};


const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role mismatch
  const hasRequiredRole = requiredRole ? user.role === requiredRole : true;
  const isSuperAdmin = user.role === 'superadmin';

  if (!hasRequiredRole && !isSuperAdmin) {
    // Determine the user's "safe" dashboard to redirect to.
    const safeDashboardPath = (user.role === 'admin') ? '/admin/dashboard' : '/user/home';
    
    // RENDER the helper component instead of calling toast directly.
    return (
      <RedirectWithToast 
        to={safeDashboardPath} 
        message="Access Denied: You do not have permission." 
      />
    );
  }

  // If all checks pass, render the actual protected content.
  return children;
};

export default ProtectedRoute;