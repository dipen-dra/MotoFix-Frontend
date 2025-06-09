// src/assets/MotoFixLogo.jsx
import React from 'react';

export const MotoFixLogo = () => {
  // Replace this URL with the actual URL of the logo you want to use
  const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHNG_J6o0BeSIftLTBmsMqRZku7Y-xjpebXw&s';

  return (
    <img 
      src={logoUrl} 
      alt="MotoFix Logo" 
      className="h-9 w-auto" // You can adjust the size here
    />
  );
};