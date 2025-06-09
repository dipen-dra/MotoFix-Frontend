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