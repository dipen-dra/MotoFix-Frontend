// import React, { useContext } from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import Header from './layouts/Header';
// import Footer from './layouts/Footer';
// import { AuthPage } from './pages/AuthPage';
// import { AuthContext } from './auth/AuthContext';
// import ProtectedRoute from './routers/ProtectedRoutes';
// import HomePage from './pages/HomePage';
// import AdminDashboard from './pages/admin/adminDashboard';

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {
//         !user && (<Header />)
//       }
      
//       <main className="flex-1 w-full max-w-5xl px-4 py-8 mx-auto">
//         <Routes>
//           <Route path="/" element={!user ? <HomePage /> : <Navigate to="/dashboard" replace />} />
//           <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
//           <Route path="/register" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 {user?.data.role === 'admin' ? <AdminDashboard /> : <p>User dash</p>}
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//       {
//         !user && (<Footer />)
//       }
//     </div>
//   );
// }

// export default App;



import React, { useContext } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import { AuthPage } from './pages/AuthPage';
import { AuthContext } from './auth/AuthContext';
import ProtectedRoute from './routers/ProtectedRoutes';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/adminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!user && <Header />}

      {/* Fills remaining vertical space between Header and Footer */}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!user && <Footer />}
    </div>
  );
}

export default App;
