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

// function App() {
//   const { user } = useContext(AuthContext);
//   const location = useLocation();

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

//       {/* Fills remaining vertical space between Header and Footer */}
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
//           {/* This ensures that if you ever switch from hash-based routing, the path is accounted for */}
//           <Route
//             path="/user/my-payments"
//             element={
//               <ProtectedRoute>
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>

//       {!user && <Footer />}
//     </div>
//   );
// }

// export default App;

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
import EsewaSuccess from './pages/EsewaSuccess';
import EsewaFailure from './pages/EsewaFailure';

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
          <Route
            path="/"
            element={!user ? <HomePage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/login"
            element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.data.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <UserDashboard />
                )}
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
          <Route
            path="/payment/esewa/success"
            element={
              <ProtectedRoute>
                <EsewaSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/esewa/failure"
            element={
              <ProtectedRoute>
                <EsewaFailure />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!user && <Footer />}
    </div>
  );
}

export default App;