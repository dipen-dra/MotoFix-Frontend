import React from 'react';

const getStatusColor = (status) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'Paid': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
        case 'COD': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        case 'Khalti': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'eSewa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>
        {status}
    </span>
);

export default StatusBadge;