import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmButtonVariant = 'danger', Icon = AlertTriangle, iconColor = 'text-red-600 dark:text-red-400', iconBgColor = 'bg-red-100 dark:bg-red-900/50' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <Card className="w-full max-w-md">
                <div className="text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                    <div className="mt-2 px-7 py-3"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div>
                    <div className="flex justify-center gap-3 mt-4">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button variant={confirmButtonVariant} onClick={onConfirm}>{confirmText}</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ConfirmationModal;