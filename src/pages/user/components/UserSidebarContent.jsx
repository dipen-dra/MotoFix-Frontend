import React from 'react';
import { LayoutDashboard, CalendarDays, User, LogOut, X, CreditCard, PlusCircle, MessageSquare } from 'lucide-react';
import UserNavLink from './UserNavLink';

const UserSidebarContent = ({ onLogoutClick, onMenuClose, unreadChatCount }) => {
    return (
        <>
            <div className="p-4 flex items-center justify-between">
                <img src="/motofix-removebg-preview.png" alt="MotoFix" className="h-20 w-auto" />
                {onMenuClose && <button onClick={onMenuClose} className="lg:hidden"><X size={24} /></button>}
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <UserNavLink to="/user/dashboard" icon={LayoutDashboard}>Dashboard</UserNavLink>
                <UserNavLink to="/user/bookings" icon={CalendarDays}>My Bookings</UserNavLink>
                <UserNavLink to="/user/my-payments" icon={CreditCard}>My Payments</UserNavLink>
                <UserNavLink to="/user/new-booking" icon={PlusCircle}>New Booking</UserNavLink>
                <UserNavLink to="/user/profile" icon={User}>Profile</UserNavLink>
                <UserNavLink to="/user/chat" icon={MessageSquare} badgeCount={unreadChatCount}>Chat</UserNavLink>
            </nav>
            <div className="p-4 border-t">
                <button onClick={onLogoutClick} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100">
                    <LogOut size={22} /><span>Logout</span>
                </button>
            </div>
        </>
    );
};

export default UserSidebarContent;