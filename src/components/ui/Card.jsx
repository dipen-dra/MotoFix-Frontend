import React from 'react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${className}`}>
        {children}
    </div>
);

export default Card;