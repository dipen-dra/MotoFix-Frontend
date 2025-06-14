import React, { useState, useEffect } from 'react';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

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
  
  return (
    <>
      <CurrentPage />
      {/* Add the ToastContainer here. You can configure it as you like. */}
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