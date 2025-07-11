// import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import { Menu, Sun, Moon, LogOut } from 'lucide-react';
// import { AuthContext } from '../../auth/AuthContext';
// import { apiFetchUser } from '../../services/api';
// import { socket } from '../../services/socket';

// // --- Lazy Load Pages for Better Performance ---
// const UserDashboardPage = lazy(() => import('./subpages/UserDashboardPage'));
// const UserBookingsPage = lazy(() => import('./subpages/MyBookingPage'));
// const NewBookingPage = lazy(() => import('./subpages/NewBookingPage'));
// const EditBookingPage = lazy(() => import('./subpages/EditBookingPage'));
// const MyPaymentsPage = lazy(() => import('./subpages/MyPaymentPage'));
// const UserProfilePage = lazy(() => import('./subpages/UserProfilePage'));
// const ChatPage = lazy(() => import('./subpages/ChatPage'));

// // --- Import Non-Lazy Components ---
// import UserSidebarContent from './components/UserSidebarContent';
// import ConfirmationModal from '../../components/ui/ConfirmationModal';

// // --- Loading Spinner Component ---
// const LoadingFallback = () => (
//     <div className="flex justify-center items-center h-full">
//         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//     </div>
// );

// const UserDashboard = () => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [activePage, setActivePage] = useState('dashboard');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('userTheme') === 'dark');
//     const [unreadChatCount, setUnreadChatCount] = useState(0);

//     // Effect for fetching initial user data and unread chat count
//     useEffect(() => {
//         const fetchInitialData = async () => {
//             if (!user) return;
//             try {
//                 const profileResponse = await apiFetchUser('/profile');
//                 const profileData = await profileResponse.json();
//                 setCurrentUser(profileData.data);

//                 const unreadResponse = await apiFetchUser('/chat/unread-count');
//                 const unreadData = await unreadResponse.json();
//                 setUnreadChatCount(unreadData.count || 0);

//             } catch (error) {
//                 console.error("Failed to fetch initial user data:", error);
//                 // If token is invalid or expired, force logout
//                 if (error.message.includes('Unauthorized') || error.message.includes('token')) {
//                     handleLogoutConfirm();
//                 }
//             }
//         };
//         fetchInitialData();
//     }, [user]);

//     // Effect for Socket.IO listeners for chat notifications
//     useEffect(() => {
//         if (!currentUser) return;
//         const room = `chat-${currentUser._id}`;

//         const notificationListener = (data) => {
//             // Only increment count if the message is for this user and they aren't on the chat page
//             if (data.room === room && !location.pathname.includes('/user/chat')) {
//                 setUnreadChatCount(prevCount => prevCount + 1);
//             }
//         };
//         const readListener = () => setUnreadChatCount(0);

//         socket.on('new_message_notification', notificationListener);
//         socket.on('messages_read_by_user', readListener);

//         return () => {
//             socket.off('new_message_notification', notificationListener);
//             socket.off('messages_read_by_user', readListener);
//         };
//     }, [currentUser, location.pathname]);

//     // Effect for managing document title with notification count
//     useEffect(() => {
//         document.title = unreadChatCount > 0 ? `(${unreadChatCount}) MotoFix Customer` : 'MotoFix Customer';
//     }, [unreadChatCount]);

//     // Effect for toggling dark mode
//     useEffect(() => {
//         document.documentElement.classList.toggle('dark', isDarkMode);
//         localStorage.setItem('userTheme', isDarkMode ? 'dark' : 'light');
//     }, [isDarkMode]);
    
//     // Effect to derive active page from URL for sidebar highlighting
//     useEffect(() => {
//         const path = location.pathname.split('/user/')[1] || 'dashboard';
//         setActivePage(path.split('/')[0]);
//     }, [location.pathname]);

//     const handleDiscountApplied = async () => {
//         // Refreshes the user profile to get latest loyalty points
//         const response = await apiFetchUser('/profile');
//         const data = await response.json();
//         setCurrentUser(data.data);
//     };

//     const handleLogoutConfirm = () => {
//         localStorage.clear();
//         navigate('/login');
//     };
    
//     const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`; };
//     const profilePictureSrc = currentUser?.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`;

//     return (
//         <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
//             {/* --- Mobile Sidebar (Off-canvas) --- */}
//             <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//                 <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
//                     <UserSidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} unreadChatCount={unreadChatCount} />
//                 </div>
//                 <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
//             </div>

//             {/* --- Desktop Sidebar (Static) --- */}
//             <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
//                 <UserSidebarContent activePage={activePage} onLinkClick={() => {}} onLogoutClick={() => setLogoutConfirmOpen(true)} unreadChatCount={unreadChatCount} />
//             </aside>

//             {/* --- Main Content Area --- */}
//             <main className="flex-1 flex flex-col overflow-hidden">
//                 {/* --- Header --- */}
//                 <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center flex-shrink-0">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
//                     <div className="hidden lg:block" /> {/* Spacer */}
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//                         </button>
//                         <div className="flex items-center gap-3">
//                             <img key={profilePictureSrc} src={profilePictureSrc} alt="User" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} />
//                             <div>
//                                 <p className="font-semibold text-sm">{currentUser?.fullName || 'Loading...'}</p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 {/* --- Page Content (with Suspense for lazy loading) --- */}
//                 <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
//                     <Suspense fallback={<LoadingFallback />}>
//                         <Routes>
//                             <Route path="/" element={<UserDashboardPage />} />
//                             <Route path="dashboard" element={<UserDashboardPage />} />
//                             <Route path="bookings" element={<UserBookingsPage />} />
//                             <Route path="new-booking" element={<NewBookingPage />} />
//                             <Route path="edit-booking/:id" element={<EditBookingPage />} />
//                             <Route path="my-payments" element={<MyPaymentsPage currentUser={currentUser} loyaltyPoints={currentUser?.loyaltyPoints || 0} onDiscountApplied={handleDiscountApplied} />} />
//                             <Route path="profile" element={<UserProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
//                             <Route path="chat" element={<ChatPage currentUser={currentUser} />} />
//                         </Routes>
//                     </Suspense>
//                 </div>
//             </main>

//             {/* --- Logout Confirmation Modal --- */}
//             <ConfirmationModal
//                 isOpen={isLogoutConfirmOpen}
//                 onClose={() => setLogoutConfirmOpen(false)}
//                 onConfirm={handleLogoutConfirm}
//                 title="Confirm Logout"
//                 message="Are you sure you want to logout?"
//                 confirmText="Logout"
//                 confirmButtonVariant="danger"
//                 Icon={LogOut}
//             />
//         </div>
//     );
// };

// export default UserDashboard;




import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

import { AuthContext } from '../../auth/AuthContext';
import { apiFetchUser } from '../../services/api';
import { socket } from '../../services/socket';

// --- Lazy Load Pages for Better Performance ---
const UserHomePage = lazy(() => import('./subpages/UserHomePage'));
const UserBookingsPage = lazy(() => import('./subpages/MyBookingPage'));
const NewBookingPage = lazy(() => import('./subpages/NewBookingPage'));
const EditBookingPage = lazy(() => import('./subpages/EditBookingPage'));
const MyPaymentsPage = lazy(() => import('./subpages/MyPaymentPage'));
const UserProfilePage = lazy(() => import('./subpages/UserProfilePage'));
const ChatPage = lazy(() => import('./subpages/ChatPage'));
const ServiceDetailsPage = lazy(() => import('./subpages/ServiceDetailsPage'));


// --- Import Non-Lazy Components ---
import UserSidebarContent from './components/UserSidebarContent';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

// --- Loading Spinner Component ---
const LoadingFallback = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [activePage, setActivePage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('userTheme') === 'dark');
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    // Effect for fetching initial user data and unread chat count
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!user) return;
            try {
                const profileResponse = await apiFetchUser('/profile');
                const profileData = await profileResponse.json();
                setCurrentUser(profileData.data);

                const unreadResponse = await apiFetchUser('/chat/unread-count');
                const unreadData = await unreadResponse.json();
                setUnreadChatCount(unreadData.count || 0);

            } catch (error) {
                console.error("Failed to fetch initial user data:", error);
                if (error.message.includes('Unauthorized') || error.message.includes('token')) {
                    handleLogoutConfirm();
                }
            }
        };
        fetchInitialData();
    }, [user]);

    // Effect for Socket.IO listeners for chat notifications
    useEffect(() => {
        if (!currentUser) return;
        const room = `chat-${currentUser._id}`;

        const notificationListener = (data) => {
            if (data.room === room && !location.pathname.endsWith('/user/chat')) {
                setUnreadChatCount(prevCount => prevCount + 1);
            }
        };
        const readListener = () => setUnreadChatCount(0);

        socket.on('new_message_notification', notificationListener);
        socket.on('messages_read_by_user', readListener);

        return () => {
            socket.off('new_message_notification', notificationListener);
            socket.off('messages_read_by_user', readListener);
        };
    }, [currentUser, location.pathname]);

    // Effect for managing document title with notification count
    useEffect(() => {
        document.title = unreadChatCount > 0 ? `(${unreadChatCount}) MotoFix Customer` : 'MotoFix Customer';
    }, [unreadChatCount]);

    // Effect for toggling dark mode
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('userTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Effect to derive active page from URL for sidebar highlighting
    useEffect(() => {
        const path = location.pathname.split('/user/')[1] || 'dashboard';
        setActivePage(path.split('/')[0]);
    }, [location.pathname]);

    const handleDiscountApplied = async () => {
        const response = await apiFetchUser('/profile');
        const data = await response.json();
        setCurrentUser(data.data);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`; };
    const profilePictureSrc = currentUser?.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`;

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
            {/* --- Mobile Sidebar (Off-canvas) --- */}
            <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                    <UserSidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} unreadChatCount={unreadChatCount} />
                </div>
                <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
            </div>

            {/* --- Desktop Sidebar (Static) --- */}
            <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
                <UserSidebarContent activePage={activePage} onLinkClick={() => {}} onLogoutClick={() => setLogoutConfirmOpen(true)} unreadChatCount={unreadChatCount} />
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center flex-shrink-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <img key={profilePictureSrc} src={profilePictureSrc} alt="User" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} />
                            <div>
                                <p className="font-semibold text-sm">{currentUser?.fullName || 'Loading...'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route index element={<UserHomePage />} />
                            <Route path="dashboard" element={<UserHomePage />} />
                            <Route path="bookings" element={<UserBookingsPage />} />
                            <Route path="new-booking" element={<NewBookingPage />} />
                            <Route path="edit-booking/:id" element={<EditBookingPage />} />
                            <Route path="my-payments" element={<MyPaymentsPage currentUser={currentUser} loyaltyPoints={currentUser?.loyaltyPoints || 0} onDiscountApplied={handleDiscountApplied} />} />
                            <Route path="profile" element={<UserProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
                            <Route path="chat" element={<ChatPage currentUser={currentUser} />} />
                            <Route path="service/:id" element={<ServiceDetailsPage />} />
                             <Route path="book-service/:id" element={<NewBookingPage />} />
                            <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
                        </Routes>
                    </Suspense>
                </div>
            </main>

            <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} onConfirm={handleLogoutConfirm} title="Confirm Logout" message="Are you sure you want to logout?" confirmText="Logout" confirmButtonVariant="danger" Icon={LogOut} />
        </div>
    );
};

export default UserDashboard;
