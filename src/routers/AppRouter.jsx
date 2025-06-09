import React, { useState, useEffect } from 'react';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';

export const AppRouter = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Set initial route if hash is empty
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
  
  return <CurrentPage />;
};

export default AppRouter;

// This component listens for hash changes and updates the current page accordingly.
// It defaults to the HomePage if no hash is present or if the hash is not recognized.
// The AuthPage is displayed for login and signup routes.
// This allows for a simple client-side routing mechanism using URL hashes.
// The HomePage and AuthPage components are imported from their respective pages.
// The AppRouter component is used in the main application layout to handle routing.
// The HomePage and AuthPage components are imported from their respective pages.
// The AppRouter component is used in the main application layout to handle routing.