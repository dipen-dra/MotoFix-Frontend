import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

const UserNavLink = ({ to, icon: Icon, children, badgeCount }) => {
    return (
        <Link to={to} className="relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Icon size={22} />
            <span className="text-md">{children}</span>
            {badgeCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {badgeCount}
                </span>
            )}
        </Link>
    );
};

export default UserNavLink;