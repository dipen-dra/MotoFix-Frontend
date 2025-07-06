//code without gemini chatbot

// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { LayoutDashboard, CalendarDays, User, LogOut, Menu, X, Sun, Moon, PlusCircle, Bike, Wrench, Edit, Trash2, AlertTriangle, Camera, MapPin, CreditCard, ArrowLeft, Gift, ArrowRight, ChevronDown, ChevronUp, MessageSquare, Send, Paperclip, FileText, XCircle } from 'lucide-react';
// import { toast } from 'react-toastify';
// import io from 'socket.io-client';
// import { AuthContext } from '../auth/AuthContext';

// const socket = io.connect("http://localhost:5050");
// const API_BASE_URL_USER = "http://localhost:5050/api/user";

// // CORRECTED: This function now ALWAYS returns the raw Response object on success.
// const apiFetchUser = async (endpoint, options = {}) => {
//     const headers = {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         ...options.headers
//     };

//     if (!(options.body instanceof FormData)) {
//         headers['Content-Type'] = 'application/json';
//     }

//     const response = await fetch(`${API_BASE_URL_USER}${endpoint}`, { ...options, headers });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'An API error occurred.');
//     }

//     return response; // ALWAYS return the response object
// };

// // --- START: Chat Page Component (Fully Updated) ---
// const ChatPage = ({ currentUser }) => {
//     const [currentMessage, setCurrentMessage] = useState("");
//     const [messageList, setMessageList] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [isUploading, setIsUploading] = useState(false);

//     const chatBodyRef = useRef(null);
//     const fileInputRef = useRef(null);
//     const cameraInputRef = useRef(null);

//     const room = currentUser?._id ? `chat-${currentUser._id}` : null;
//     const authorName = currentUser?.fullName || 'Customer';
//     const authorId = currentUser?._id || null;

//     useEffect(() => {
//         if (!room || !authorId) return;

//         socket.emit("join_room", { roomName: room, userId: authorId });

//         const historyListener = (history) => {
//             if (history.length === 0 || (history.length > 0 && history[0].room === room)) {
//                 setMessageList(history);
//             }
//         };
//         socket.on("chat_history", historyListener);

//         const messageListener = (data) => {
//             if (data.room === room) {
//                 setMessageList((list) => [...list, data]);
//             }
//         };
//         socket.on("receive_message", messageListener);

//         return () => {
//             socket.off("chat_history", historyListener);
//             socket.off("receive_message", messageListener);
//         };
//     }, [room, authorId]);

//     useEffect(() => {
//         if (chatBodyRef.current) {
//             chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//         }
//     }, [messageList]);

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             if (file.type.startsWith('image/')) {
//                 setPreviewUrl(URL.createObjectURL(file));
//             } else {
//                 setPreviewUrl(null);
//             }
//         }
//         event.target.value = null;
//     };

//     const handleRemovePreview = () => {
//         setSelectedFile(null);
//         setPreviewUrl(null);
//     };

//     const sendMessage = async () => {
//         if (currentMessage.trim() === "" && !selectedFile) return;
//         if (!room || !authorId) return;

//         if (selectedFile) {
//             setIsUploading(true);
//             const formData = new FormData();
//             formData.append('file', selectedFile);
//             formData.append('room', room);
//             formData.append('author', authorName);
//             formData.append('authorId', authorId);
//             if (currentMessage.trim() !== '') {
//                 formData.append('message', currentMessage);
//             }

//             try {
//                 await apiFetchUser('/chat/upload', {
//                     method: 'POST',
//                     body: formData,
//                 });
//             } catch (error) {
//                 toast.error(`File upload failed: ${error.message}`);
//             } finally {
//                 setIsUploading(false);
//                 handleRemovePreview();
//                 setCurrentMessage('');
//             }
//         } else {
//             const messageData = {
//                 room: room,
//                 author: authorName,
//                 authorId: authorId,
//                 message: currentMessage,
//             };
//             await socket.emit("send_message", messageData);
//             setCurrentMessage("");
//         }
//     };

//     const renderFileContent = (msg) => {
//         if (msg.fileType?.startsWith('image/')) {
//             return (
//                 <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
//                     <img src={msg.fileUrl} alt={msg.fileName || 'Sent Image'} className="max-w-xs rounded-lg mt-1" />
//                 </a>
//             );
//         }
//         return (
//             <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download={msg.fileName}
//                 className="flex items-center gap-3 bg-black/10 dark:bg-white/10 p-3 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors mt-1">
//                 <FileText size={32} className="flex-shrink-0" />
//                 <span className="truncate font-medium">{msg.fileName || 'Download File'}</span>
//             </a>
//         );
//     };

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Live Chat with Admin</h1>
//             <Card className="p-0 flex flex-col" style={{ height: 'calc(80vh - 2rem)' }}>
//                 <div className="p-3 border-b dark:border-gray-700 flex items-center gap-3 shadow-sm">
//                     <img src="/motofix-removebg-preview.png" alt="Support" className="w-10 h-10 rounded-full object-contain bg-gray-100 dark:bg-gray-900 p-1" />
//                     <div>
//                         <h3 className="font-semibold">MotoFix Support</h3>
//                         <p className="text-sm text-gray-500 flex items-center gap-1.5">
//                             <span className="h-2 w-2 rounded-full bg-green-500"></span>
//                             Online
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex-grow overflow-y-auto p-4 space-y-1" ref={chatBodyRef}>
//                     {messageList.map((msg, index) => {
//                         const isUserMessage = msg.authorId === authorId;
//                         const prevMsg = messageList[index - 1];
//                         const nextMsg = messageList[index + 1];
//                         const isFirstInGroup = !prevMsg || prevMsg.authorId !== msg.authorId;
//                         const isLastInGroup = !nextMsg || nextMsg.authorId !== msg.authorId;

//                         return (
//                             <div key={index} className={`flex items-end gap-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
//                                 {!isUserMessage && (
//                                     <div className="w-8 flex-shrink-0 self-end">
//                                         {isLastInGroup && <img src="/motofix-removebg-preview.png" alt="p" className="w-7 h-7 rounded-full object-contain bg-gray-100 dark:bg-gray-900 p-0.5" />}
//                                     </div>
//                                 )}
//                                 <div className={`py-2 px-3 max-w-md ${isUserMessage ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} 
//                                     ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : ''}
//                                     ${isUserMessage ?
//                                         `${isFirstInGroup ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-l-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-l-2xl rounded-r-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tr-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-br-md' : ''}` :
//                                         `${isFirstInGroup ? 'rounded-t-2xl rounded-br-2xl' : 'rounded-r-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-r-2xl rounded-l-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tl-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-bl-md' : ''}`
//                                     }`}
//                                 >
//                                     {msg.fileUrl && renderFileContent(msg)}
//                                     {msg.message && <p className="text-md" style={{ overflowWrap: 'break-word' }}>{msg.message}</p>}
//                                     <p className={`text-xs text-right mt-1 opacity-70`}>
//                                         {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//                     {(previewUrl || selectedFile) && (
//                         <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
//                             {previewUrl ? <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" /> : <div className="flex items-center gap-2 text-gray-500"><FileText /><span>{selectedFile.name}</span></div>}
//                             <button onClick={handleRemovePreview} className="text-gray-500 hover:text-red-500"><XCircle size={20} /></button>
//                         </div>
//                     )}
//                     <div className="flex items-center gap-3">
//                         <div className="flex">
//                             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
//                             <input type="file" ref={cameraInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
//                             <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Paperclip size={22} /></button>
//                             <button onClick={() => cameraInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Camera size={22} /></button>
//                         </div>
//                         <input
//                             type="text"
//                             value={currentMessage}
//                             onChange={(e) => setCurrentMessage(e.target.value)}
//                             onKeyPress={(e) => e.key === "Enter" && !isUploading && sendMessage()}
//                             placeholder="Message..."
//                             className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
//                             disabled={isUploading}
//                         />
//                         <Button onClick={sendMessage} disabled={isUploading || (!currentMessage.trim() && !selectedFile)} className="!rounded-full !w-12 !h-12 !p-0">
//                             {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
//                         </Button>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };
// // --- END: Chat Page Component ---


// const getStatusColor = (status) => {
//     switch (status) {
//         case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
//         case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
//         case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
//         case 'Paid': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
//         case 'COD': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
//         case 'Khalti': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
//         case 'eSewa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
//     }
// };

// const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${className}`}>{children}</div>);
// const StatusBadge = ({ status }) => (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>{status}</span>);
// const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
//     const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
//     const variants = {
//         primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//         secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
//         danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//         success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
//         special: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
//     };
//     return (<button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
// };
// const Input = React.forwardRef(({ id, label, ...props }, ref) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
//         <input id={id} {...props} ref={ref} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600" />
//     </div>
// ));
// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmButtonVariant = 'danger', Icon = AlertTriangle, iconColor = 'text-red-600 dark:text-red-400', iconBgColor = 'bg-red-100 dark:bg-red-900/50' }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
//             <Card className="w-full max-w-md">
//                 <div className="text-center">
//                     <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
//                     <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
//                     <div className="mt-2 px-7 py-3"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div>
//                     <div className="flex justify-center gap-3 mt-4">
//                         <Button variant="secondary" onClick={onClose}>Cancel</Button>
//                         <Button variant={confirmButtonVariant} onClick={onConfirm}>{confirmText}</Button>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };
// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//     if (totalPages <= 1) return null;
//     return (
//         <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-200 dark:border-gray-700">
//             <Button variant="secondary" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="!px-3 !py-1.5 text-sm">
//                 <ArrowLeft size={16} /> Previous
//             </Button>
//             <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
//             <Button variant="secondary" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="!px-3 !py-1.5 text-sm">
//                 Next <ArrowRight size={16} />
//             </Button>
//         </div>
//     );
// };

// const LoadMoreControl = ({ onToggle, isExpanded, hasMore }) => {
//     if (!hasMore) return null;

//     return (
//         <div className="flex justify-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//                 variant="secondary"
//                 onClick={onToggle}
//                 className="!px-6 !py-2 text-sm !gap-1.5 transform hover:scale-105 hover:shadow-lg transition-all duration-200"
//             >
//                 {isExpanded ? (
//                     <>
//                         <ChevronUp size={18} /> Show Less
//                     </>
//                 ) : (
//                     <>
//                         <ChevronDown size={18} /> Load More
//                     </>
//                 )}
//             </Button>
//         </div>
//     );
// };


// const UserDashboardPage = () => {
//     const [stats, setStats] = useState({ upcomingBookings: 0, completedServices: 0, loyaltyPoints: 0 });
//     const [recentBookings, setRecentBookings] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await apiFetchUser('/dashboard-summary');
//                 const data = await response.json();
//                 setStats({
//                     upcomingBookings: data.data.upcomingBookings,
//                     completedServices: data.data.completedServices,
//                     loyaltyPoints: data.data.loyaltyPoints || 0
//                 });
//                 setRecentBookings(data.data.recentBookings || []);
//             } catch (error) {
//                 console.error("Failed to fetch dashboard summary:", error);
//                 toast.error(error.message || "Failed to fetch dashboard summary.");
//             }
//         };
//         fetchData();
//     }, []);

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <Card className="hover:border-blue-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><CalendarDays className="text-blue-600 dark:text-blue-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Upcoming Bookings</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.upcomingBookings}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-green-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><Wrench className="text-green-600 dark:text-green-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Completed Services</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedServices}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-purple-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full"><Gift className="text-purple-600 dark:text-purple-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Loyalty Points</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.loyaltyPoints}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <a href="#/user/new-booking" className="md:col-span-1">
//                     <Card className="h-full flex flex-col items-center justify-center text-center bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 border-2 border-dashed border-blue-400 hover:border-blue-600">
//                         <PlusCircle className="text-blue-600 dark:text-blue-400 mb-2" size={32} />
//                         <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Book a New Service</h3>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">Get your bike checked</p>
//                     </Card>
//                 </a>
//             </div>

//             <Card>
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
//                 <div className="overflow-x-auto">
//                     {recentBookings.length > 0 ? (
//                         <table className="w-full text-left">
//                             <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                                 <tr>
//                                     <th className="p-3">Service</th><th className="p-3">Bike Model</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {recentBookings.map(booking => (
//                                     <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                         <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                                         <td className="p-3"><StatusBadge status={booking.status} /></td>
//                                         <td className="p-3 text-right font-medium text-gray-900 dark:text-white">रु{booking.finalAmount ?? booking.totalCost}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <div className="text-center py-10">
//                             <p className="text-gray-500 dark:text-gray-400">You have no recent bookings.</p>
//                             <Button className="mt-4" onClick={() => window.location.hash = '#/user/new-booking'}>
//                                 Book Your First Service
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// };

// const UserBookingsPage = () => {
//     const [bookings, setBookings] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [bookingToDelete, setBookingToDelete] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);

//     const fetchBookings = async (page) => {
//         setIsLoading(true);
//         try {
//             const response = await apiFetchUser(`/bookings?page=${page}&limit=10`);
//             const data = await response.json();
//             setBookings(data.data || []);
//             setTotalPages(data.totalPages || 0);
//         } catch (error) {
//             console.error('Failed to fetch bookings:', error.message);
//             toast.error(error.message || 'Failed to fetch your bookings.');
//             setBookings([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBookings(currentPage);
//     }, [currentPage]);

//     const handleDelete = async () => {
//         if (!bookingToDelete) return;
//         try {
//             await apiFetchUser(`/bookings/${bookingToDelete}`, { method: 'DELETE' });
//             toast.success('Booking cancelled successfully.');
//             setBookingToDelete(null);
//             fetchBookings(currentPage);
//         } catch (error) {
//             toast.error(error.message || "Failed to cancel booking.");
//         }
//     };

//     return (
//         <div className="space-y-6 flex flex-col flex-grow">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Bookings</h1>
//                 <Button onClick={() => window.location.hash = '#/user/new-booking'}><PlusCircle size={20} />New Booking</Button>
//             </div>
//             <Card className="flex flex-col flex-grow">
//                 <div className="overflow-x-auto flex-grow">
//                     {isLoading ? (<div className="text-center p-12 text-gray-500 dark:text-gray-400">Loading bookings...</div>) : bookings.length > 0 ? (
//                         <table className="w-full text-left">
//                             <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                                 <tr>
//                                     <th className="p-3">Service</th><th className="p-3">Bike</th><th className="p-3">Date</th>
//                                     <th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3 text-right">Cost</th>
//                                     <th className="p-3 text-center">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {bookings.map(booking => (
//                                     <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                         <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                                         <td className="p-3"><StatusBadge status={booking.status} /></td>
//                                         <td className="p-3"><StatusBadge status={booking.paymentStatus} /></td>
//                                         <td className="p-3 text-right font-semibold">
//                                             {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
//                                             रु{booking.finalAmount ?? booking.totalCost}
//                                         </td>
//                                         <td className="p-3 text-center">
//                                             <div className="flex justify-center gap-2">
//                                                 <Button variant="secondary" size="sm" onClick={() => window.location.hash = `#/user/edit-booking/${booking._id}`} disabled={booking.status !== 'Pending' || booking.isPaid || booking.discountApplied}><Edit size={16} /></Button>
//                                                 <Button variant="danger" size="sm" onClick={() => setBookingToDelete(booking._id)} disabled={booking.isPaid}><Trash2 size={16} /></Button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <div className="text-center py-12">
//                             <Bike size={48} className="mx-auto text-gray-400" />
//                             <h3 className="mt-2 text-xl font-semibold">No Bookings Yet</h3>
//                             <p className="mt-1 text-sm text-gray-500">Looks like you haven't booked any services with us.</p>
//                         </div>
//                     )}
//                 </div>
//                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
//             </Card>
//             <ConfirmationModal isOpen={!!bookingToDelete} onClose={() => setBookingToDelete(null)} onConfirm={handleDelete} title="Cancel Booking" message="Are you sure you want to cancel this booking?" confirmText="Yes, Cancel" />
//         </div>
//     );
// };

// const EditBookingPage = () => {
//     const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
//     const [services, setServices] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const id = window.location.hash.split('/').pop();

//         const fetchInitialData = async () => {
//             setIsLoading(true);
//             try {
//                 const servicesRes = await apiFetchUser('/services');
//                 const { data: allServices } = await servicesRes.json();
//                 setServices(allServices || []);

//                 const bookingRes = await apiFetchUser(`/bookings/${id}`);
//                 const { data: booking } = await bookingRes.json();

//                 if (booking) {
//                     if (booking.isPaid || booking.discountApplied || booking.status !== 'Pending') {
//                         toast.error("This booking can no longer be edited.");
//                         window.location.hash = '#/user/bookings';
//                         return;
//                     }
//                     const service = (allServices || []).find(s => s.name === booking.serviceType);
//                     setFormData({
//                         serviceId: service ? service._id : '',
//                         bikeModel: booking.bikeModel,
//                         date: new Date(booking.date).toISOString().split('T')[0],
//                         notes: booking.notes
//                     });
//                 } else {
//                     throw new Error("Booking not found.");
//                 }
//             } catch (err) {
//                 toast.error(err.message || "Failed to load booking data.");
//                 window.location.hash = '#/user/bookings';
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (id) {
//             fetchInitialData();
//         }
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             const bookingId = window.location.hash.split('/').pop();
//             const response = await apiFetchUser(`/bookings/${bookingId}`, {
//                 method: 'PUT',
//                 body: JSON.stringify(formData),
//             });
//             const data = await response.json();
//             toast.success(data.message || "Booking updated successfully!");
//             window.location.hash = '#/user/bookings';
//         } catch (err) {
//             toast.error(err.message || "Failed to update booking.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) return <div className="text-center p-12">Loading...</div>;

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center gap-4">
//                 <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                     <ArrowLeft size={24} />
//                 </button>
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Booking</h1>
//             </div>
//             <Card>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
//                         <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
//                             <option value="" disabled>-- Choose a service --</option>
//                             {services.map(service => (
//                                 <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
//                             ))}
//                         </select>
//                     </div>

//                     <Input id="bikeModel" name="bikeModel" label="Bike Model" value={formData.bikeModel} onChange={handleChange} required />
//                     <Input id="date" name="date" label="Preferred Date" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
//                     <div>
//                         <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Description</label>
//                         <textarea id="notes" name="notes" rows="4" value={formData.notes || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
//                     </div>

//                     <div className="flex justify-end gap-3">
//                         <Button variant="secondary" type="button" onClick={() => window.location.hash = '#/user/bookings'}>Cancel</Button>
//                         <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
//                     </div>
//                 </form>
//             </Card>
//         </div>
//     );
// };

// const NewBookingPage = () => {
//     const [services, setServices] = useState([]);
//     const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const response = await apiFetchUser('/services');
//                 const data = await response.json();
//                 setServices(data.data || []);
//             } catch (err) {
//                 console.error("Failed to fetch services:", err);
//                 toast.error(err.message || "Could not load available services. Please try again later.");
//             }
//         };
//         fetchServices();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.serviceId || !formData.bikeModel || !formData.date) {
//             toast.error("Please fill out all required fields.");
//             return;
//         }
//         setIsSubmitting(true);
//         try {
//             await apiFetchUser('/bookings', {
//                 method: 'POST',
//                 body: JSON.stringify(formData)
//             });
//             toast.success("Booking submitted! Please proceed with payment.");
//             window.location.hash = `#/user/my-payments`;

//         } catch (err) {
//             toast.error(err.message || "Failed to submit booking. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Request a New Service</h1>
//             <Card>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
//                         <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
//                             <option value="" disabled>-- Choose a service --</option>
//                             {services.map(service => (
//                                 <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
//                             ))}
//                         </select>
//                     </div>
//                     <Input id="bikeModel" name="bikeModel" label="Bike Model (e.g., Bajaj Pulsar 220F)*" value={formData.bikeModel} onChange={handleChange} required />
//                     <Input id="date" name="date" label="Preferred Date*" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
//                     <div>
//                         <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explain Your Problem Here*</label>
//                         <textarea id="notes" name="notes" rows="4" value={formData.notes || ""} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
//                     </div>

//                     <div className="flex justify-center">
//                         <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
//                     </div>
//                 </form>
//             </Card>
//         </div>
//     );
// };


// const MyPaymentsPage = ({ currentUser, loyaltyPoints, onDiscountApplied }) => {
//     const [unpaidBookings, setUnpaidBookings] = useState([]);
//     const [paidBookings, setPaidBookings] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [showAllHistory, setShowAllHistory] = useState(false);

//     const fetchData = async () => {
//         setIsLoading(true);
//         try {
//             const pendingRes = await apiFetchUser('/bookings/pending');
//             const pendingData = await pendingRes.json();
//             setUnpaidBookings(pendingData.data || []);

//             const historyRes = await apiFetchUser('/bookings/history');
//             const historyData = await historyRes.json();
//             setPaidBookings(historyData.data || []);

//         } catch (error) {
//             console.error('Failed to fetch payments:', error);
//             toast.error(error.message || 'Could not fetch your payment information.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();

//         const params = new URLSearchParams(window.location.search);
//         const status = params.get('status');
//         const message = params.get('message');

//         if (status && message) {
//             if (status === 'success') {
//                 toast.success(message);
//             } else {
//                 toast.error(message);
//             }
//             window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
//         }
//     }, []);

//     const handlePaymentAndDiscount = async () => {
//         await fetchData();
//         const profileResponse = await apiFetchUser('/profile');
//         const data = await profileResponse.json();
//         onDiscountApplied(data.data.loyaltyPoints);
//     };

//     const handleApplyDiscount = async (bookingId) => {
//         try {
//             await apiFetchUser(`/bookings/${bookingId}/apply-discount`, { method: 'PUT' });
//             toast.success('Discount applied!');
//             handlePaymentAndDiscount();
//         } catch (error) {
//             toast.error(error.message || "Failed to apply discount.");
//         }
//     };

//     const handlePayment = async (booking, method) => {
//         const amountToPay = booking.finalAmount ?? booking.totalCost;

//         if (method === 'COD') {
//             try {
//                 await apiFetchUser(`/bookings/${booking._id}/pay`, {
//                     method: 'PUT',
//                     body: JSON.stringify({ paymentMethod: 'COD' })
//                 });
//                 toast.success("Payment Confirmed! Your booking is now being processed.");
//                 handlePaymentAndDiscount();
//             } catch (error) {
//                 toast.error(error.message || "Payment confirmation failed.");
//             }
//             return;
//         }

//         if (method === 'eSewa') {
//             try {
//                 const response = await fetch('http://localhost:5050/api/payment/esewa/initiate', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     },
//                     body: JSON.stringify({ bookingId: booking._id }),
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'An API error occurred.');
//                 }

//                 const esewaResponse = await response.json();
//                 const form = document.createElement('form');
//                 form.setAttribute('method', 'POST');
//                 form.setAttribute('action', esewaResponse.ESEWA_URL);

//                 for (const key in esewaResponse) {
//                     if (key !== 'ESEWA_URL') {
//                         const hiddenField = document.createElement('input');
//                         hiddenField.setAttribute('type', 'hidden');
//                         hiddenField.setAttribute('name', key);
//                         hiddenField.setAttribute('value', esewaResponse[key]);
//                         form.appendChild(hiddenField);
//                     }
//                 }
//                 document.body.appendChild(form);
//                 form.submit();
//             } catch (error) {
//                 toast.error(error.message || 'Error initiating eSewa payment.');
//             }
//             return;
//         }

//         if (method === 'Khalti') {
//             const khaltiConfig = {
//                 publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
//                 productIdentity: booking._id,
//                 productName: booking.serviceType,
//                 productUrl: window.location.href,
//                 eventHandler: {
//                     async onSuccess(payload) {
//                         try {
//                             await apiFetchUser('/bookings/verify-khalti', {
//                                 method: 'POST',
//                                 body: JSON.stringify({
//                                     token: payload.token,
//                                     amount: payload.amount,
//                                     booking_id: booking._id
//                                 })
//                             });
//                             toast.success('Payment Successful & Verified!');
//                             handlePaymentAndDiscount();
//                         } catch (error) {
//                             toast.error(error.message || 'Payment verification failed.');
//                         }
//                     },
//                     onError: (error) => toast.error('Payment process was interrupted.'),
//                     onClose: () => console.log('Khalti widget closed'),
//                 },
//                 paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
//             };
//             const checkout = new KhaltiCheckout(khaltiConfig);
//             checkout.show({ amount: amountToPay * 100 });
//         }
//     };

//     const displayedHistory = showAllHistory ? paidBookings : paidBookings.slice(0, 10);

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Payments</h1>

//             <Card>
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pending Payments</h2>
//                     <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
//                         <Gift size={20} />
//                         <span className="font-semibold">{loyaltyPoints} Points</span>
//                     </div>
//                 </div>
//                 {isLoading && unpaidBookings.length === 0 ? (<div className="text-center p-12">Loading...</div>) :
//                     unpaidBookings.length > 0 ? (
//                         <div className="space-y-4">
//                             {unpaidBookings.map(booking => (
//                                 <div key={booking._id} className="p-4 border rounded-lg dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
//                                     <div>
//                                         <p className="font-bold">{booking.serviceType} for {booking.bikeModel}</p>
//                                         <p className="text-sm text-gray-500 dark:text-gray-400">Date: {new Date(booking.date).toLocaleDateString()}</p>
//                                         <div className="text-lg font-semibold mt-1">
//                                             {booking.discountApplied ? (
//                                                 <>
//                                                     <span className="text-base text-gray-500 line-through mr-2">रु{booking.totalCost}</span>
//                                                     <span className="text-green-600">रु{booking.finalAmount}</span>
//                                                 </>
//                                             ) : (
//                                                 <span>Total: रु{booking.totalCost}</span>
//                                             )}
//                                         </div>
//                                         {booking.discountApplied && <p className="text-sm font-bold text-green-500">Discount: -रु{booking.discountAmount}</p>}
//                                     </div>
//                                     <div className="flex flex-wrap items-center gap-2">
//                                         {loyaltyPoints >= 100 && !booking.discountApplied && (
//                                             <Button variant="special" onClick={() => handleApplyDiscount(booking._id)}>
//                                                 <Gift size={16} /> Apply 20% Discount
//                                             </Button>
//                                         )}
//                                         <Button onClick={() => handlePayment(booking, 'COD')}>Pay with COD</Button>
//                                         <Button variant="secondary" onClick={() => handlePayment(booking, 'Khalti')} className="bg-white"><img src="/khaltilogo.png" alt="Khalti" style={{ height: '24px' }} /></Button>
//                                         <Button variant="secondary" onClick={() => handlePayment(booking, 'eSewa')} className="bg-white hover:bg-gray-100"><img src="/esewa_logo.png" alt="eSewa" style={{ height: '24px' }} /></Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <CreditCard size={48} className="mx-auto text-gray-400" />
//                             <h3 className="mt-2 text-xl font-semibold">No Pending Payments</h3>
//                             <p className="mt-1 text-sm text-gray-500">All your payments are up to date!</p>
//                         </div>
//                     )}
//             </Card>

//             <Card className="flex flex-col flex-grow">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Payment History</h2>
//                 <div className="overflow-x-auto flex-grow">
//                     {isLoading && paidBookings.length === 0 ? (<div className="text-center p-12">Loading history...</div>) :
//                         displayedHistory.length > 0 ? (
//                             <table className="w-full text-left">
//                                 <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                                     <tr>
//                                         <th className="p-3">Service</th><th className="p-3">Bike</th>
//                                         <th className="p-3">Date</th><th className="p-3">Amount Paid</th><th className="p-3">Method</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {displayedHistory.map(booking => (
//                                         <tr key={booking._id} className="border-b dark:border-gray-700">
//                                             <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
//                                             <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
//                                             <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                                             <td className="p-3 font-semibold">
//                                                 {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
//                                                 रु{booking.finalAmount ?? booking.totalCost}
//                                             </td>
//                                             <td className="p-3"><StatusBadge status={booking.paymentMethod} /></td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         ) : (
//                             <div className="text-center py-12">
//                                 <p className="text-gray-500 dark:text-gray-400">No payment history found.</p>
//                             </div>
//                         )
//                     }
//                 </div>
//                 <LoadMoreControl
//                     onToggle={() => setShowAllHistory(!showAllHistory)}
//                     isExpanded={showAllHistory}
//                     hasMore={paidBookings.length > 10}
//                 />
//             </Card>
//         </div>
//     );
// };

// const UserProfilePage = ({ currentUser, setCurrentUser }) => {
//     const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', address: '', profilePicture: '' });
//     const [isEditing, setIsEditing] = useState(false);
//     const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//     const [initialProfile, setInitialProfile] = useState({});
//     const fileInputRef = useRef(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await apiFetchUser('/profile');
//                 const data = await response.json();
//                 const profileData = { ...data.data, address: data.data.address || '' };
//                 setProfile(profileData);
//                 setInitialProfile(profileData);
//             } catch (error) {
//                 console.error("Failed to fetch profile", error);
//                 toast.error(error.message || "Failed to fetch profile.");
//             }
//         };
//         fetchProfile();
//     }, []);

//     const handleFetchLocation = async () => {
//         if (!navigator.geolocation) {
//             toast.error("Geolocation is not supported by your browser.");
//             return;
//         }
//         setIsFetchingLocation(true);
//         toast.info("Fetching your location...");
//         navigator.geolocation.getCurrentPosition(
//             async (position) => {
//                 const { latitude, longitude } = position.coords;
//                 try {
//                     const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
//                     if (!response.ok) throw new Error('Failed to convert location to address.');
//                     const data = await response.json();
//                     if (data && data.display_name) {
//                         setProfile(p => ({ ...p, address: data.display_name }));
//                         toast.success("Location fetched successfully!");
//                     } else {
//                         throw new Error('Could not find address.');
//                     }
//                 } catch (error) {
//                     toast.error(error.message);
//                 } finally {
//                     setIsFetchingLocation(false);
//                 }
//             },
//             (error) => {
//                 let message = "Geolocation permission denied. Please enable it in browser settings.";
//                 toast.error(message);
//                 setIsFetchingLocation(false);
//             }
//         );
//     };

//     const handleSave = async () => {
//         const formData = new FormData();
//         formData.append('fullName', profile.fullName);
//         formData.append('email', profile.email);
//         formData.append('phone', profile.phone);
//         formData.append('address', profile.address);
//         if (profile.newProfilePicture) {
//             formData.append('profilePicture', profile.newProfilePicture);
//         }
//         try {
//             const response = await apiFetchUser('/profile', {
//                 method: 'PUT',
//                 body: formData
//             });
//             const data = await response.json();
//             const updatedData = { ...data.data, address: data.data.address || '' };
//             setProfile(updatedData);
//             setInitialProfile(updatedData);
//             setCurrentUser(updatedData);
//             setIsEditing(false);
//             toast.success(data.message || 'Profile updated successfully!');
//         } catch (error) {
//             toast.error(error.message || 'Failed to update profile.');
//         }
//     };

//     const handleCancel = () => {
//         setProfile(initialProfile);
//         setIsEditing(false);
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfile(p => ({ ...p, profilePictureUrl: URL.createObjectURL(file), newProfilePicture: file }));
//         }
//     };

//     const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`; };
//     const profilePictureSrc = profile.profilePictureUrl || (profile.profilePicture ? `http://localhost:5050/${profile.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`);

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
//             <Card>
//                 <div className="flex justify-end mb-4">
//                     {!isEditing && <Button onClick={() => setIsEditing(true)}><Edit size={16} /> Edit Profile</Button>}
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-1 flex flex-col items-center text-center">
//                         <img key={profilePictureSrc} src={profilePictureSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} />
//                         {isEditing && (
//                             <>
//                                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
//                                 <Button variant="secondary" onClick={() => fileInputRef.current.click()}><Camera size={16} /> Change Picture</Button>
//                             </>
//                         )}
//                         <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">{profile.fullName}</h2>
//                         <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
//                     </div>
//                     <div className="lg:col-span-2 space-y-4">
//                         <Input id="fullName" label="Full Name" name="fullName" value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} disabled={!isEditing} />
//                         <Input id="email" label="Email Address" name="email" type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={!isEditing} />
//                         <Input id="phone" label="Phone Number" name="phone" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} />
//                         <div>
//                             <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
//                             <div className="flex items-center gap-2">
//                                 <textarea id="address" name="address" rows="3"
//                                     className="flex-grow px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600"
//                                     value={profile.address || ''}
//                                     onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//                                     disabled={!isEditing || isFetchingLocation}
//                                     placeholder="Click button to fetch or enter manually."
//                                 />
//                                 {isEditing && (
//                                     <Button type="button" variant="secondary" onClick={handleFetchLocation} disabled={isFetchingLocation} className="shrink-0">
//                                         <MapPin size={18} className={isFetchingLocation ? 'animate-pulse' : ''} />
//                                     </Button>
//                                 )}
//                             </div>
//                         </div>
//                         {isEditing && (
//                             <div className="flex justify-end gap-3 pt-4">
//                                 <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
//                                 <Button onClick={handleSave}>Save Changes</Button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// const UserNavLink = ({ page, icon: Icon, children, activePage, onLinkClick, badgeCount }) => {
//     const isActive = activePage === page;
//     return (
//         <a href={`#/user/${page}`} onClick={onLinkClick} className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
//             <Icon size={22} />
//             <span className="text-md">{children}</span>
//             {badgeCount > 0 && (
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                     {badgeCount}
//                 </span>
//             )}
//         </a>
//     );
// };

// const UserSidebarContent = ({ activePage, onLinkClick, onLogoutClick, onMenuClose, unreadChatCount }) => {
//     const handleLogoClick = () => {
//         window.location.hash = '#/user/dashboard';
//         if (onMenuClose) onMenuClose();
//     };
//     return (
//         <>
//             <div className="p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick} title="Go to Dashboard">
//                     <img src="/motofix-removebg-preview.png" alt="MotoFix Logo" className="h-20 w-auto hover:opacity-80 transition-opacity duration-200" />
//                 </div>
//                 {onMenuClose && <button onClick={onMenuClose} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>}
//             </div>
//             <nav className="flex-1 px-4 py-6 space-y-2">
//                 <UserNavLink page="dashboard" icon={LayoutDashboard} activePage={activePage} onLinkClick={onLinkClick}>Dashboard</UserNavLink>
//                 <UserNavLink page="bookings" icon={CalendarDays} activePage={activePage} onLinkClick={onLinkClick}>My Bookings</UserNavLink>
//                 <UserNavLink page="my-payments" icon={CreditCard} activePage={activePage} onLinkClick={onLinkClick}>My Payments</UserNavLink>
//                 <UserNavLink page="new-booking" icon={PlusCircle} activePage={activePage} onLinkClick={onLinkClick}>New Booking</UserNavLink>
//                 <UserNavLink page="profile" icon={User} activePage={activePage} onLinkClick={onLinkClick}>Profile</UserNavLink>
//                 <UserNavLink page="chat" icon={MessageSquare} activePage={activePage} onLinkClick={onLinkClick} badgeCount={unreadChatCount}>Chat</UserNavLink>
//             </nav>
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                     onClick={onLogoutClick}
//                     className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800"
//                 >
//                     <LogOut size={22} />
//                     <span className="text-md">Logout</span>
//                 </button>
//             </div>

//         </>
//     );
// };

// const UserDashboard = () => {
//     const { user } = useContext(AuthContext);
//     const [activePage, setActivePage] = useState('dashboard');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('userTheme') === 'dark');
//     const [unreadChatCount, setUnreadChatCount] = useState(0);

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
//                 console.error("Failed to fetch initial user data", error);
//                 if (error.message.includes('Unauthorized') || error.message.includes('token')) {
//                     handleLogoutConfirm();
//                 }
//             }
//         };
//         fetchInitialData();
//     }, [user]);

//     useEffect(() => {
//         if (!currentUser) return;

//         const notificationListener = (data) => {
//             const currentChatRoom = `chat-${currentUser._id}`;
//             // Only increment count if the message is for this user and they are NOT in the chat room.
//             if (data.room === currentChatRoom && window.location.hash !== '#/user/chat') {
//                 setUnreadChatCount(prevCount => prevCount + 1);
//             }
//         };

//         const readListener = () => {
//             setUnreadChatCount(0);
//         };

//         socket.on('new_message_notification', notificationListener);
//         socket.on('messages_read_by_user', readListener);

//         return () => {
//             socket.off('new_message_notification', notificationListener);
//             socket.off('messages_read_by_user', readListener);
//         };
//     }, [currentUser]);

//     useEffect(() => {
//         document.title = unreadChatCount > 0 ? `(${unreadChatCount}) MotoFix Customer` : 'MotoFix Customer';
//     }, [unreadChatCount]);

//     useEffect(() => {
//         document.documentElement.classList.toggle('dark', isDarkMode);
//         localStorage.setItem('userTheme', isDarkMode ? 'dark' : 'light');
//     }, [isDarkMode]);

//     useEffect(() => {
//         const handleHashChange = () => {
//             const hash = window.location.hash.replace('#/user/', '').split('?')[0];
//             setActivePage(hash.startsWith('edit-booking/') ? 'edit-booking' : (hash || 'dashboard'));
//         };
//         window.addEventListener('hashchange', handleHashChange);
//         handleHashChange();
//         return () => window.removeEventListener('hashchange', handleHashChange);
//     }, []);

//     const handleDiscountApplied = async (newPoints) => {
//         const response = await apiFetchUser('/profile');
//         const data = await response.json();
//         setCurrentUser(data.data);
//     };

//     const handleLogoutConfirm = () => {
//         localStorage.clear();
//         window.location.href = '/login';
//     };

//     const renderPage = () => {
//         if (!currentUser) {
//             return <div className="text-center p-12">Loading User Data...</div>;
//         }

//         switch (activePage) {
//             case 'dashboard': return <UserDashboardPage />;
//             case 'bookings': return <UserBookingsPage />;
//             case 'new-booking': return <NewBookingPage />;
//             case 'my-payments': return <MyPaymentsPage currentUser={currentUser} loyaltyPoints={currentUser.loyaltyPoints} onDiscountApplied={handleDiscountApplied} />;
//             case 'edit-booking': return <EditBookingPage />;
//             case 'profile': return <UserProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
//             case 'chat': return <ChatPage currentUser={currentUser} />;
//             default:
//                 window.location.hash = '#/user/dashboard';
//                 return <UserDashboardPage />;
//         }
//     };

//     const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`; };
//     const profilePictureSrc = currentUser?.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`;

//     return (
//         <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
//             {/* Mobile Sidebar */}
//             <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//                 <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
//                     <UserSidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} unreadChatCount={unreadChatCount} />
//                 </div>
//                 <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
//             </div>
//             {/* Desktop Sidebar */}
//             <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
//                 <UserSidebarContent activePage={activePage} onLinkClick={() => { }} onLogoutClick={() => setLogoutConfirmOpen(true)} unreadChatCount={unreadChatCount} />
//             </aside>

//             <main className="flex-1 flex flex-col overflow-hidden">
//                 <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
//                     <div className="hidden lg:block" />
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//                         </button>
//                         <div className="flex items-center gap-3">
//                             <img key={profilePictureSrc} src={profilePictureSrc} alt="User" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} />
//                             <div>
//                                 <p className="font-semibold text-sm">{currentUser?.fullName}</p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//                 <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8 flex flex-col">
//                     {renderPage()}
//                 </div>
//             </main>

//             <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} onConfirm={handleLogoutConfirm} title="Confirm Logout" message="Are you sure you want to logout?" confirmText="Logout" confirmButtonVariant="danger" Icon={LogOut} />
//         </div>
//     );
// };

// export default UserDashboard;








//code with chatbot gemini


// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { LayoutDashboard, CalendarDays, User, LogOut, Menu, X, Sun, Moon, PlusCircle, Bike, Wrench, Edit, Trash2, AlertTriangle, Camera, MapPin, CreditCard, ArrowLeft, Gift, ArrowRight, ChevronDown, ChevronUp, MessageSquare, Send, Paperclip, FileText, XCircle } from 'lucide-react';
// import { toast } from 'react-toastify';
// import io from 'socket.io-client';
// import { AuthContext } from '../auth/AuthContext';
// import GeminiChatbot from '../components/GeminiChatbot';

// // Import the Gemini AI Chatbot component
// // Make sure the path is correct based on your project structure

// const socket = io.connect("http://localhost:5050");
// const API_BASE_URL_USER = "http://localhost:5050/api/user";

// // CORRECTED: This function now ALWAYS returns the raw Response object on success.
// const apiFetchUser = async (endpoint, options = {}) => {
//     const headers = {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         ...options.headers
//     };

//     if (!(options.body instanceof FormData)) {
//         headers['Content-Type'] = 'application/json';
//     }

//     const response = await fetch(`${API_BASE_URL_USER}${endpoint}`, { ...options, headers });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'An API error occurred.');
//     }

//     return response; // ALWAYS return the response object
// };

// // --- START: Chat Page Component (Fully Updated) ---
// const ChatPage = ({ currentUser }) => {
//     const [currentMessage, setCurrentMessage] = useState("");
//     const [messageList, setMessageList] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [isUploading, setIsUploading] = useState(false);

//     const chatBodyRef = useRef(null);
//     const fileInputRef = useRef(null);
//     const cameraInputRef = useRef(null);

//     const room = currentUser?._id ? `chat-${currentUser._id}` : null;
//     const authorName = currentUser?.fullName || 'Customer';
//     const authorId = currentUser?._id || null;

//     useEffect(() => {
//         if (!room || !authorId) return;

//         socket.emit("join_room", { roomName: room, userId: authorId });

//         const historyListener = (history) => {
//             if (history.length === 0 || (history.length > 0 && history[0].room === room)) {
//                 setMessageList(history);
//             }
//         };
//         socket.on("chat_history", historyListener);

//         const messageListener = (data) => {
//             if (data.room === room) {
//                 setMessageList((list) => [...list, data]);
//             }
//         };
//         socket.on("receive_message", messageListener);

//         return () => {
//             socket.off("chat_history", historyListener);
//             socket.off("receive_message", messageListener);
//         };
//     }, [room, authorId]);

//     useEffect(() => {
//         if (chatBodyRef.current) {
//             chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//         }
//     }, [messageList]);

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             if (file.type.startsWith('image/')) {
//                 setPreviewUrl(URL.createObjectURL(file));
//             } else {
//                 setPreviewUrl(null);
//             }
//         }
//         event.target.value = null;
//     };

//     const handleRemovePreview = () => {
//         setSelectedFile(null);
//         setPreviewUrl(null);
//     };

//     const sendMessage = async () => {
//         if (currentMessage.trim() === "" && !selectedFile) return;
//         if (!room || !authorId) return;

//         if (selectedFile) {
//             setIsUploading(true);
//             const formData = new FormData();
//             formData.append('file', selectedFile);
//             formData.append('room', room);
//             formData.append('author', authorName);
//             formData.append('authorId', authorId);
//             if (currentMessage.trim() !== '') {
//                 formData.append('message', currentMessage);
//             }

//             try {
//                 await apiFetchUser('/chat/upload', {
//                     method: 'POST',
//                     body: formData,
//                 });
//             } catch (error) {
//                 toast.error(`File upload failed: ${error.message}`);
//             } finally {
//                 setIsUploading(false);
//                 handleRemovePreview();
//                 setCurrentMessage('');
//             }
//         } else {
//             const messageData = {
//                 room: room,
//                 author: authorName,
//                 authorId: authorId,
//                 message: currentMessage,
//             };
//             await socket.emit("send_message", messageData);
//             setCurrentMessage("");
//         }
//     };

//     const renderFileContent = (msg) => {
//         if (msg.fileType?.startsWith('image/')) {
//             return (
//                 <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
//                     <img src={msg.fileUrl} alt={msg.fileName || 'Sent Image'} className="max-w-xs rounded-lg mt-1" />
//                 </a>
//             );
//         }
//         return (
//             <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download={msg.fileName}
//                 className="flex items-center gap-3 bg-black/10 dark:bg-white/10 p-3 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors mt-1">
//                 <FileText size={32} className="flex-shrink-0" />
//                 <span className="truncate font-medium">{msg.fileName || 'Download File'}</span>
//             </a>
//         );
//     };

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Live Chat with Admin</h1>
//             <Card className="p-0 flex flex-col" style={{ height: 'calc(80vh - 2rem)' }}>
//                 <div className="p-3 border-b dark:border-gray-700 flex items-center gap-3 shadow-sm">
//                     <img src="/motofix-removebg-preview.png" alt="Support" className="w-10 h-10 rounded-full object-contain bg-gray-100 dark:bg-gray-900 p-1" />
//                     <div>
//                         <h3 className="font-semibold">MotoFix Support</h3>
//                         <p className="text-sm text-gray-500 flex items-center gap-1.5">
//                             <span className="h-2 w-2 rounded-full bg-green-500"></span>
//                             Online
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex-grow overflow-y-auto p-4 space-y-1" ref={chatBodyRef}>
//                     {messageList.map((msg, index) => {
//                         const isUserMessage = msg.authorId === authorId;
//                         const prevMsg = messageList[index - 1];
//                         const nextMsg = messageList[index + 1];
//                         const isFirstInGroup = !prevMsg || prevMsg.authorId !== msg.authorId;
//                         const isLastInGroup = !nextMsg || nextMsg.authorId !== msg.authorId;

//                         return (
//                             <div key={index} className={`flex items-end gap-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
//                                 {!isUserMessage && (
//                                     <div className="w-8 flex-shrink-0 self-end">
//                                         {isLastInGroup && <img src="/motofix-removebg-preview.png" alt="p" className="w-7 h-7 rounded-full object-contain bg-gray-100 dark:bg-gray-900 p-0.5" />}
//                                     </div>
//                                 )}
//                                 <div className={`py-2 px-3 max-w-md ${isUserMessage ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} 
//                                     ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : ''}
//                                     ${isUserMessage ?
//                                         `${isFirstInGroup ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-l-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-l-2xl rounded-r-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tr-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-br-md' : ''}` :
//                                         `${isFirstInGroup ? 'rounded-t-2xl rounded-br-2xl' : 'rounded-r-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-r-2xl rounded-l-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tl-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-bl-md' : ''}`
//                                     }`}
//                                 >
//                                     {msg.fileUrl && renderFileContent(msg)}
//                                     {msg.message && <p className="text-md" style={{ overflowWrap: 'break-word' }}>{msg.message}</p>}
//                                     <p className={`text-xs text-right mt-1 opacity-70`}>
//                                         {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//                     {(previewUrl || selectedFile) && (
//                         <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
//                             {previewUrl ? <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" /> : <div className="flex items-center gap-2 text-gray-500"><FileText /><span>{selectedFile.name}</span></div>}
//                             <button onClick={handleRemovePreview} className="text-gray-500 hover:text-red-500"><XCircle size={20} /></button>
//                         </div>
//                     )}
//                     <div className="flex items-center gap-3">
//                         <div className="flex">
//                             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
//                             <input type="file" ref={cameraInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
//                             <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Paperclip size={22} /></button>
//                             <button onClick={() => cameraInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Camera size={22} /></button>
//                         </div>
//                         <input
//                             type="text"
//                             value={currentMessage}
//                             onChange={(e) => setCurrentMessage(e.target.value)}
//                             onKeyPress={(e) => e.key === "Enter" && !isUploading && sendMessage()}
//                             placeholder="Message..."
//                             className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
//                             disabled={isUploading}
//                         />
//                         <Button onClick={sendMessage} disabled={isUploading || (!currentMessage.trim() && !selectedFile)} className="!rounded-full !w-12 !h-12 !p-0">
//                             {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
//                         </Button>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };
// // --- END: Chat Page Component ---


// const getStatusColor = (status) => {
//     switch (status) {
//         case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
//         case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
//         case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
//         case 'Paid': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
//         case 'COD': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
//         case 'Khalti': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
//         case 'eSewa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
//     }
// };

// const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${className}`}>{children}</div>);
// const StatusBadge = ({ status }) => (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>{status}</span>);
// const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
//     const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
//     const variants = {
//         primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//         secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
//         danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//         success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
//         special: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
//     };
//     return (<button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
// };
// const Input = React.forwardRef(({ id, label, ...props }, ref) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
//         <input id={id} {...props} ref={ref} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600" />
//     </div>
// ));
// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmButtonVariant = 'danger', Icon = AlertTriangle, iconColor = 'text-red-600 dark:text-red-400', iconBgColor = 'bg-red-100 dark:bg-red-900/50' }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
//             <Card className="w-full max-w-md">
//                 <div className="text-center">
//                     <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
//                     <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
//                     <div className="mt-2 px-7 py-3"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div>
//                     <div className="flex justify-center gap-3 mt-4">
//                         <Button variant="secondary" onClick={onClose}>Cancel</Button>
//                         <Button variant={confirmButtonVariant} onClick={onConfirm}>{confirmText}</Button>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };
// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//     if (totalPages <= 1) return null;
//     return (
//         <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-200 dark:border-gray-700">
//             <Button variant="secondary" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="!px-3 !py-1.5 text-sm">
//                 <ArrowLeft size={16} /> Previous
//             </Button>
//             <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
//             <Button variant="secondary" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="!px-3 !py-1.5 text-sm">
//                 Next <ArrowRight size={16} />
//             </Button>
//         </div>
//     );
// };

// const LoadMoreControl = ({ onToggle, isExpanded, hasMore }) => {
//     if (!hasMore) return null;

//     return (
//         <div className="flex justify-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//                 variant="secondary"
//                 onClick={onToggle}
//                 className="!px-6 !py-2 text-sm !gap-1.5 transform hover:scale-105 hover:shadow-lg transition-all duration-200"
//             >
//                 {isExpanded ? (
//                     <>
//                         <ChevronUp size={18} /> Show Less
//                     </>
//                 ) : (
//                     <>
//                         <ChevronDown size={18} /> Load More
//                     </>
//                 )}
//             </Button>
//         </div>
//     );
// };


// const UserDashboardPage = () => {
//     const [stats, setStats] = useState({ upcomingBookings: 0, completedServices: 0, loyaltyPoints: 0 });
//     const [recentBookings, setRecentBookings] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await apiFetchUser('/dashboard-summary');
//                 const data = await response.json();
//                 setStats({
//                     upcomingBookings: data.data.upcomingBookings,
//                     completedServices: data.data.completedServices,
//                     loyaltyPoints: data.data.loyaltyPoints || 0
//                 });
//                 setRecentBookings(data.data.recentBookings || []);
//             } catch (error) {
//                 console.error("Failed to fetch dashboard summary:", error);
//                 toast.error(error.message || "Failed to fetch dashboard summary.");
//             }
//         };
//         fetchData();
//     }, []);

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <Card className="hover:border-blue-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><CalendarDays className="text-blue-600 dark:text-blue-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Upcoming Bookings</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.upcomingBookings}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-green-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><Wrench className="text-green-600 dark:text-green-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Completed Services</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedServices}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-purple-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full"><Gift className="text-purple-600 dark:text-purple-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Loyalty Points</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.loyaltyPoints}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <a href="#/user/new-booking" className="md:col-span-1">
//                     <Card className="h-full flex flex-col items-center justify-center text-center bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 border-2 border-dashed border-blue-400 hover:border-blue-600">
//                         <PlusCircle className="text-blue-600 dark:text-blue-400 mb-2" size={32} />
//                         <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Book a New Service</h3>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">Get your bike checked</p>
//                     </Card>
//                 </a>
//             </div>

//             <Card>
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
//                 <div className="overflow-x-auto">
//                     {recentBookings.length > 0 ? (
//                         <table className="w-full text-left">
//                             <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                                 <tr>
//                                     <th className="p-3">Service</th><th className="p-3">Bike Model</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {recentBookings.map(booking => (
//                                     <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                         <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                                         <td className="p-3"><StatusBadge status={booking.status} /></td>
//                                         <td className="p-3 text-right font-medium text-gray-900 dark:text-white">रु{booking.finalAmount ?? booking.totalCost}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <div className="text-center py-10">
//                             <p className="text-gray-500 dark:text-gray-400">You have no recent bookings.</p>
//                             <Button className="mt-4" onClick={() => window.location.hash = '#/user/new-booking'}>
//                                 Book Your First Service
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// };

// const UserBookingsPage = () => {
//     const [bookings, setBookings] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [bookingToDelete, setBookingToDelete] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);

//     const fetchBookings = async (page) => {
//         setIsLoading(true);
//         try {
//             const response = await apiFetchUser(`/bookings?page=${page}&limit=10`);
//             const data = await response.json();
//             setBookings(data.data || []);
//             setTotalPages(data.totalPages || 0);
//         } catch (error) {
//             console.error('Failed to fetch bookings:', error.message);
//             toast.error(error.message || 'Failed to fetch your bookings.');
//             setBookings([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBookings(currentPage);
//     }, [currentPage]);

//     const handleDelete = async () => {
//         if (!bookingToDelete) return;
//         try {
//             await apiFetchUser(`/bookings/${bookingToDelete}`, { method: 'DELETE' });
//             toast.success('Booking cancelled successfully.');
//             setBookingToDelete(null);
//             fetchBookings(currentPage);
//         } catch (error) {
//             toast.error(error.message || "Failed to cancel booking.");
//         }
//     };

//     return (
//         <div className="space-y-6 flex flex-col flex-grow">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Bookings</h1>
//                 <Button onClick={() => window.location.hash = '#/user/new-booking'}><PlusCircle size={20} />New Booking</Button>
//             </div>
//             <Card className="flex flex-col flex-grow">
//                 <div className="overflow-x-auto flex-grow">
//                     {isLoading ? (<div className="text-center p-12 text-gray-500 dark:text-gray-400">Loading bookings...</div>) : bookings.length > 0 ? (
//                         <table className="w-full text-left">
//                             <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                                 <tr>
//                                     <th className="p-3">Service</th><th className="p-3">Bike</th><th className="p-3">Date</th>
//                                     <th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3 text-right">Cost</th>
//                                     <th className="p-3 text-center">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {bookings.map(booking => (
//                                     <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                         <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
//                                         <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                                         <td className="p-3"><StatusBadge status={booking.status} /></td>
//                                         <td className="p-3"><StatusBadge status={booking.paymentStatus} /></td>
//                                         <td className="p-3 text-right font-semibold">
//                                             {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
//                                             रु{booking.finalAmount ?? booking.totalCost}
//                                         </td>
//                                         <td className="p-3 text-center">
//                                             <div className="flex justify-center gap-2">
//                                                 <Button variant="secondary" size="sm" onClick={() => window.location.hash = `#/user/edit-booking/${booking._id}`} disabled={booking.status !== 'Pending' || booking.isPaid || booking.discountApplied}><Edit size={16} /></Button>
//                                                 <Button variant="danger" size="sm" onClick={() => setBookingToDelete(booking._id)} disabled={booking.isPaid}><Trash2 size={16} /></Button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <div className="text-center py-12">
//                             <Bike size={48} className="mx-auto text-gray-400" />
//                             <h3 className="mt-2 text-xl font-semibold">No Bookings Yet</h3>
//                             <p className="mt-1 text-sm text-gray-500">Looks like you haven't booked any services with us.</p>
//                         </div>
//                     )}
//                 </div>
//                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
//             </Card>
//             <ConfirmationModal isOpen={!!bookingToDelete} onClose={() => setBookingToDelete(null)} onConfirm={handleDelete} title="Cancel Booking" message="Are you sure you want to cancel this booking?" confirmText="Yes, Cancel" />
//         </div>
//     );
// };

// const EditBookingPage = () => {
//     const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
//     const [services, setServices] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const id = window.location.hash.split('/').pop();

//         const fetchInitialData = async () => {
//             setIsLoading(true);
//             try {
//                 const servicesRes = await apiFetchUser('/services');
//                 const { data: allServices } = await servicesRes.json();
//                 setServices(allServices || []);

//                 const bookingRes = await apiFetchUser(`/bookings/${id}`);
//                 const { data: booking } = await bookingRes.json();

//                 if (booking) {
//                     if (booking.isPaid || booking.discountApplied || booking.status !== 'Pending') {
//                         toast.error("This booking can no longer be edited.");
//                         window.location.hash = '#/user/bookings';
//                         return;
//                     }
//                     const service = (allServices || []).find(s => s.name === booking.serviceType);
//                     setFormData({
//                         serviceId: service ? service._id : '',
//                         bikeModel: booking.bikeModel,
//                         date: new Date(booking.date).toISOString().split('T')[0],
//                         notes: booking.notes
//                     });
//                 } else {
//                     throw new Error("Booking not found.");
//                 }
//             } catch (err) {
//                 toast.error(err.message || "Failed to load booking data.");
//                 window.location.hash = '#/user/bookings';
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (id) {
//             fetchInitialData();
//         }
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             const bookingId = window.location.hash.split('/').pop();
//             const response = await apiFetchUser(`/bookings/${bookingId}`, {
//                 method: 'PUT',
//                 body: JSON.stringify(formData),
//             });
//             const data = await response.json();
//             toast.success(data.message || "Booking updated successfully!");
//             window.location.hash = '#/user/bookings';
//         } catch (err) {
//             toast.error(err.message || "Failed to update booking.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) return <div className="text-center p-12">Loading...</div>;

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center gap-4">
//                 <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                     <ArrowLeft size={24} />
//                 </button>
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Booking</h1>
//             </div>
//             <Card>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
//                         <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
//                             <option value="" disabled>-- Choose a service --</option>
//                             {services.map(service => (
//                                 <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
//                             ))}
//                         </select>
//                     </div>

//                     <Input id="bikeModel" name="bikeModel" label="Bike Model" value={formData.bikeModel} onChange={handleChange} required />
//                     <Input id="date" name="date" label="Preferred Date" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
//                     <div>
//                         <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Description</label>
//                         <textarea id="notes" name="notes" rows="4" value={formData.notes || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
//                     </div>

//                     <div className="flex justify-end gap-3">
//                         <Button variant="secondary" type="button" onClick={() => window.location.hash = '#/user/bookings'}>Cancel</Button>
//                         <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
//                     </div>
//                 </form>
//             </Card>
//         </div>
//     );
// };

// const NewBookingPage = () => {
//     const [services, setServices] = useState([]);
//     const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const response = await apiFetchUser('/services');
//                 const data = await response.json();
//                 setServices(data.data || []);
//             } catch (err) {
//                 console.error("Failed to fetch services:", err);
//                 toast.error(err.message || "Could not load available services. Please try again later.");
//             }
//         };
//         fetchServices();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.serviceId || !formData.bikeModel || !formData.date) {
//             toast.error("Please fill out all required fields.");
//             return;
//         }
//         setIsSubmitting(true);
//         try {
//             await apiFetchUser('/bookings', {
//                 method: 'POST',
//                 body: JSON.stringify(formData)
//             });
//             toast.success("Booking submitted! Please proceed with payment.");
//             window.location.hash = `#/user/my-payments`;

//         } catch (err) {
//             toast.error(err.message || "Failed to submit booking. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Request a New Service</h1>
//             <Card>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
//                         <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
//                             <option value="" disabled>-- Choose a service --</option>
//                             {services.map(service => (
//                                 <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
//                             ))}
//                         </select>
//                     </div>
//                     <Input id="bikeModel" name="bikeModel" label="Bike Model (e.g., Bajaj Pulsar 220F)*" value={formData.bikeModel} onChange={handleChange} required />
//                     <Input id="date" name="date" label="Preferred Date*" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
//                     <div>
//                         <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explain Your Problem Here*</label>
//                         <textarea id="notes" name="notes" rows="4" value={formData.notes || ""} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
//                     </div>

//                     <div className="flex justify-center">
//                         <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
//                     </div>
//                 </form>
//             </Card>
//         </div>
//     );
// };


// const MyPaymentsPage = ({ currentUser, loyaltyPoints, onDiscountApplied }) => {
//     const [unpaidBookings, setUnpaidBookings] = useState([]);
//     const [paidBookings, setPaidBookings] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [showAllHistory, setShowAllHistory] = useState(false);

//     const fetchData = async () => {
//         setIsLoading(true);
//         try {
//             const pendingRes = await apiFetchUser('/bookings/pending');
//             const pendingData = await pendingRes.json();
//             setUnpaidBookings(pendingData.data || []);

//             const historyRes = await apiFetchUser('/bookings/history');
//             const historyData = await historyRes.json();
//             setPaidBookings(historyData.data || []);

//         } catch (error) {
//             console.error('Failed to fetch payments:', error);
//             toast.error(error.message || 'Could not fetch your payment information.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();

//         const params = new URLSearchParams(window.location.search);
//         const status = params.get('status');
//         const message = params.get('message');

//         if (status && message) {
//             if (status === 'success') {
//                 toast.success(message);
//             } else {
//                 toast.error(message);
//             }
//             window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
//         }
//     }, []);

//     const handlePaymentAndDiscount = async () => {
//         await fetchData();
//         const profileResponse = await apiFetchUser('/profile');
//         const data = await profileResponse.json();
//         onDiscountApplied(data.data.loyaltyPoints);
//     };

//     const handleApplyDiscount = async (bookingId) => {
//         try {
//             await apiFetchUser(`/bookings/${bookingId}/apply-discount`, { method: 'PUT' });
//             toast.success('Discount applied!');
//             handlePaymentAndDiscount();
//         } catch (error) {
//             toast.error(error.message || "Failed to apply discount.");
//         }
//     };

//     const handlePayment = async (booking, method) => {
//         const amountToPay = booking.finalAmount ?? booking.totalCost;

//         if (method === 'COD') {
//             try {
//                 await apiFetchUser(`/bookings/${booking._id}/pay`, {
//                     method: 'PUT',
//                     body: JSON.stringify({ paymentMethod: 'COD' })
//                 });
//                 toast.success("Payment Confirmed! Your booking is now being processed.");
//                 handlePaymentAndDiscount();
//             } catch (error) {
//                 toast.error(error.message || "Payment confirmation failed.");
//             }
//             return;
//         }

//         if (method === 'eSewa') {
//             try {
//                 const response = await fetch('http://localhost:5050/api/payment/esewa/initiate', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     },
//                     body: JSON.stringify({ bookingId: booking._id }),
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'An API error occurred.');
//                 }

//                 const esewaResponse = await response.json();
//                 const form = document.createElement('form');
//                 form.setAttribute('method', 'POST');
//                 form.setAttribute('action', esewaResponse.ESEWA_URL);

//                 for (const key in esewaResponse) {
//                     if (key !== 'ESEWA_URL') {
//                         const hiddenField = document.createElement('input');
//                         hiddenField.setAttribute('type', 'hidden');
//                         hiddenField.setAttribute('name', key);
//                         hiddenField.setAttribute('value', esewaResponse[key]);
//                         form.appendChild(hiddenField);
//                     }
//                 }
//                 document.body.appendChild(form);
//                 form.submit();
//             } catch (error) {
//                 toast.error(error.message || 'Error initiating eSewa payment.');
//             }
//             return;
//         }

//         if (method === 'Khalti') {
//             const khaltiConfig = {
//                 publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
//                 productIdentity: booking._id,
//                 productName: booking.serviceType,
//                 productUrl: window.location.href,
//                 eventHandler: {
//                     async onSuccess(payload) {
//                         try {
//                             await apiFetchUser('/bookings/verify-khalti', {
//                                 method: 'POST',
//                                 body: JSON.stringify({
//                                     token: payload.token,
//                                     amount: payload.amount,
//                                     booking_id: booking._id
//                                 })
//                             });
//                             toast.success('Payment Successful & Verified!');
//                             handlePaymentAndDiscount();
//                         } catch (error) {
//                             toast.error(error.message || 'Payment verification failed.');
//                         }
//                     },
//                     onError: (error) => toast.error('Payment process was interrupted.'),
//                     onClose: () => console.log('Khalti widget closed'),
//                 },
//                 paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
//             };
//             const checkout = new KhaltiCheckout(khaltiConfig);
//             checkout.show({ amount: amountToPay * 100 });
//         }
//     };

//     const displayedHistory = showAllHistory ? paidBookings : paidBookings.slice(0, 10);

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Payments</h1>

//             <Card>
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pending Payments</h2>
//                     <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
//                         <Gift size={20} />
//                         <span className="font-semibold">{loyaltyPoints} Points</span>
//                     </div>
//                 </div>
//                 {isLoading && unpaidBookings.length === 0 ? (<div className="text-center p-12">Loading...</div>) :
//                     unpaidBookings.length > 0 ? (
//                         <div className="space-y-4">
//                             {unpaidBookings.map(booking => (
//                                 <div key={booking._id} className="p-4 border rounded-lg dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
//                                     <div>
//                                         <p className="font-bold">{booking.serviceType} for {booking.bikeModel}</p>
//                                         <p className="text-sm text-gray-500 dark:text-gray-400">Date: {new Date(booking.date).toLocaleDateString()}</p>
//                                         <div className="text-lg font-semibold mt-1">
//                                             {booking.discountApplied ? (
//                                                 <>
//                                                     <span className="text-base text-gray-500 line-through mr-2">रु{booking.totalCost}</span>
//                                                     <span className="text-green-600">रु{booking.finalAmount}</span>
//                                                 </>
//                                             ) : (
//                                                 <span>Total: रु{booking.totalCost}</span>
//                                             )}
//                                         </div>
//                                         {booking.discountApplied && <p className="text-sm font-bold text-green-500">Discount: -रु{booking.discountAmount}</p>}
//                                     </div>
//                                     <div className="flex flex-wrap items-center gap-2">
//                                         {loyaltyPoints >= 100 && !booking.discountApplied && (
//                                             <Button variant="special" onClick={() => handleApplyDiscount(booking._id)}>
//                                                 <Gift size={16} /> Apply 20% Discount
//                                             </Button>
//                                         )}
//                                         <Button onClick={() => handlePayment(booking, 'COD')}>Pay with COD</Button>
//                                         <Button variant="secondary" onClick={() => handlePayment(booking, 'Khalti')} className="bg-white"><img src="/khaltilogo.png" alt="Khalti" style={{ height: '24px' }} /></Button>
//                                         <Button variant="secondary" onClick={() => handlePayment(booking, 'eSewa')} className="bg-white hover:bg-gray-100"><img src="/esewa_logo.png" alt="eSewa" style={{ height: '24px' }} /></Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <CreditCard size={48} className="mx-auto text-gray-400" />
//                             <h3 className="mt-2 text-xl font-semibold">No Pending Payments</h3>
//                             <p className="mt-1 text-sm text-gray-500">All your payments are up to date!</p>
//                         </div>
//                     )}
//             </Card>

//             <Card className="flex flex-col flex-grow">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Payment History</h2>
//                 <div className="overflow-x-auto flex-grow">
//                     {isLoading && paidBookings.length === 0 ? (<div className="text-center p-12">Loading history...</div>) :
//                         displayedHistory.length > 0 ? (
//                             <table className="w-full text-left">
//                                 <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                                     <tr>
//                                         <th className="p-3">Service</th><th className="p-3">Bike</th>
//                                         <th className="p-3">Date</th><th className="p-3">Amount Paid</th><th className="p-3">Method</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {displayedHistory.map(booking => (
//                                         <tr key={booking._id} className="border-b dark:border-gray-700">
//                                             <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
//                                             <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
//                                             <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                                             <td className="p-3 font-semibold">
//                                                 {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
//                                                 रु{booking.finalAmount ?? booking.totalCost}
//                                             </td>
//                                             <td className="p-3"><StatusBadge status={booking.paymentMethod} /></td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         ) : (
//                             <div className="text-center py-12">
//                                 <p className="text-gray-500 dark:text-gray-400">No payment history found.</p>
//                             </div>
//                         )
//                     }
//                 </div>
//                 <LoadMoreControl
//                     onToggle={() => setShowAllHistory(!showAllHistory)}
//                     isExpanded={showAllHistory}
//                     hasMore={paidBookings.length > 10}
//                 />
//             </Card>
//         </div>
//     );
// };

// const UserProfilePage = ({ currentUser, setCurrentUser }) => {
//     const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', address: '', profilePicture: '' });
//     const [isEditing, setIsEditing] = useState(false);
//     const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//     const [initialProfile, setInitialProfile] = useState({});
//     const fileInputRef = useRef(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await apiFetchUser('/profile');
//                 const data = await response.json();
//                 const profileData = { ...data.data, address: data.data.address || '' };
//                 setProfile(profileData);
//                 setInitialProfile(profileData);
//             } catch (error) {
//                 console.error("Failed to fetch profile", error);
//                 toast.error(error.message || "Failed to fetch profile.");
//             }
//         };
//         fetchProfile();
//     }, []);

//     const handleFetchLocation = async () => {
//         if (!navigator.geolocation) {
//             toast.error("Geolocation is not supported by your browser.");
//             return;
//         }
//         setIsFetchingLocation(true);
//         toast.info("Fetching your location...");
//         navigator.geolocation.getCurrentPosition(
//             async (position) => {
//                 const { latitude, longitude } = position.coords;
//                 try {
//                     const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
//                     if (!response.ok) throw new Error('Failed to convert location to address.');
//                     const data = await response.json();
//                     if (data && data.display_name) {
//                         setProfile(p => ({ ...p, address: data.display_name }));
//                         toast.success("Location fetched successfully!");
//                     } else {
//                         throw new Error('Could not find address.');
//                     }
//                 } catch (error) {
//                     toast.error(error.message);
//                 } finally {
//                     setIsFetchingLocation(false);
//                 }
//             },
//             (error) => {
//                 let message = "Geolocation permission denied. Please enable it in browser settings.";
//                 toast.error(message);
//                 setIsFetchingLocation(false);
//             }
//         );
//     };

//     const handleSave = async () => {
//         const formData = new FormData();
//         formData.append('fullName', profile.fullName);
//         formData.append('email', profile.email);
//         formData.append('phone', profile.phone);
//         formData.append('address', profile.address);
//         if (profile.newProfilePicture) {
//             formData.append('profilePicture', profile.newProfilePicture);
//         }
//         try {
//             const response = await apiFetchUser('/profile', {
//                 method: 'PUT',
//                 body: formData
//             });
//             const data = await response.json();
//             const updatedData = { ...data.data, address: data.data.address || '' };
//             setProfile(updatedData);
//             setInitialProfile(updatedData);
//             setCurrentUser(updatedData);
//             setIsEditing(false);
//             toast.success(data.message || 'Profile updated successfully!');
//         } catch (error) {
//             toast.error(error.message || 'Failed to update profile.');
//         }
//     };

//     const handleCancel = () => {
//         setProfile(initialProfile);
//         setIsEditing(false);
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfile(p => ({ ...p, profilePictureUrl: URL.createObjectURL(file), newProfilePicture: file }));
//         }
//     };

//     const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`; };
//     const profilePictureSrc = profile.profilePictureUrl || (profile.profilePicture ? `http://localhost:5050/${profile.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`);

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
//             <Card>
//                 <div className="flex justify-end mb-4">
//                     {!isEditing && <Button onClick={() => setIsEditing(true)}><Edit size={16} /> Edit Profile</Button>}
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-1 flex flex-col items-center text-center">
//                         <img key={profilePictureSrc} src={profilePictureSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} />
//                         {isEditing && (
//                             <>
//                                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
//                                 <Button variant="secondary" onClick={() => fileInputRef.current.click()}><Camera size={16} /> Change Picture</Button>
//                             </>
//                         )}
//                         <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">{profile.fullName}</h2>
//                         <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
//                     </div>
//                     <div className="lg:col-span-2 space-y-4">
//                         <Input id="fullName" label="Full Name" name="fullName" value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} disabled={!isEditing} />
//                         <Input id="email" label="Email Address" name="email" type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={!isEditing} />
//                         <Input id="phone" label="Phone Number" name="phone" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} />
//                         <div>
//                             <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
//                             <div className="flex items-center gap-2">
//                                 <textarea id="address" name="address" rows="3"
//                                     className="flex-grow px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600"
//                                     value={profile.address || ''}
//                                     onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//                                     disabled={!isEditing || isFetchingLocation}
//                                     placeholder="Click button to fetch or enter manually."
//                                 />
//                                 {isEditing && (
//                                     <Button type="button" variant="secondary" onClick={handleFetchLocation} disabled={isFetchingLocation} className="shrink-0">
//                                         <MapPin size={18} className={isFetchingLocation ? 'animate-pulse' : ''} />
//                                     </Button>
//                                 )}
//                             </div>
//                         </div>
//                         {isEditing && (
//                             <div className="flex justify-end gap-3 pt-4">
//                                 <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
//                                 <Button onClick={handleSave}>Save Changes</Button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// const UserNavLink = ({ page, icon: Icon, children, activePage, onLinkClick, badgeCount }) => {
//     const isActive = activePage === page;
//     return (
//         <a href={`#/user/${page}`} onClick={onLinkClick} className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
//             <Icon size={22} />
//             <span className="text-md">{children}</span>
//             {badgeCount > 0 && (
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                     {badgeCount}
//                 </span>
//             )}
//         </a>
//     );
// };

// const UserSidebarContent = ({ activePage, onLinkClick, onLogoutClick, onMenuClose, unreadChatCount }) => {
//     const handleLogoClick = () => {
//         window.location.hash = '#/user/dashboard';
//         if (onMenuClose) onMenuClose();
//     };
//     return (
//         <>
//             <div className="p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick} title="Go to Dashboard">
//                     <img src="/motofix-removebg-preview.png" alt="MotoFix Logo" className="h-20 w-auto hover:opacity-80 transition-opacity duration-200" />
//                 </div>
//                 {onMenuClose && <button onClick={onMenuClose} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>}
//             </div>
//             <nav className="flex-1 px-4 py-6 space-y-2">
//                 <UserNavLink page="dashboard" icon={LayoutDashboard} activePage={activePage} onLinkClick={onLinkClick}>Dashboard</UserNavLink>
//                 <UserNavLink page="bookings" icon={CalendarDays} activePage={activePage} onLinkClick={onLinkClick}>My Bookings</UserNavLink>
//                 <UserNavLink page="my-payments" icon={CreditCard} activePage={activePage} onLinkClick={onLinkClick}>My Payments</UserNavLink>
//                 <UserNavLink page="new-booking" icon={PlusCircle} activePage={activePage} onLinkClick={onLinkClick}>New Booking</UserNavLink>
//                 <UserNavLink page="profile" icon={User} activePage={activePage} onLinkClick={onLinkClick}>Profile</UserNavLink>
//                 <UserNavLink page="chat" icon={MessageSquare} activePage={activePage} onLinkClick={onLinkClick} badgeCount={unreadChatCount}>Chat</UserNavLink>
//             </nav>
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                     onClick={onLogoutClick}
//                     className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800"
//                 >
//                     <LogOut size={22} />
//                     <span className="text-md">Logout</span>
//                 </button>
//             </div>

//         </>
//     );
// };

// const UserDashboard = () => {
//     const { user } = useContext(AuthContext);
//     const [activePage, setActivePage] = useState('dashboard');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('userTheme') === 'dark');
//     const [unreadChatCount, setUnreadChatCount] = useState(0);

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
//                 console.error("Failed to fetch initial user data", error);
//                 if (error.message.includes('Unauthorized') || error.message.includes('token')) {
//                     handleLogoutConfirm();
//                 }
//             }
//         };
//         fetchInitialData();
//     }, [user]);

//     useEffect(() => {
//         if (!currentUser) return;

//         const notificationListener = (data) => {
//             const currentChatRoom = `chat-${currentUser._id}`;
//             // Only increment count if the message is for this user and they are NOT in the chat room.
//             if (data.room === currentChatRoom && window.location.hash !== '#/user/chat') {
//                 setUnreadChatCount(prevCount => prevCount + 1);
//             }
//         };

//         const readListener = () => {
//             setUnreadChatCount(0);
//         };

//         socket.on('new_message_notification', notificationListener);
//         socket.on('messages_read_by_user', readListener);

//         return () => {
//             socket.off('new_message_notification', notificationListener);
//             socket.off('messages_read_by_user', readListener);
//         };
//     }, [currentUser]);

//     useEffect(() => {
//         document.title = unreadChatCount > 0 ? `(${unreadChatCount}) MotoFix Customer` : 'MotoFix Customer';
//     }, [unreadChatCount]);

//     useEffect(() => {
//         document.documentElement.classList.toggle('dark', isDarkMode);
//         localStorage.setItem('userTheme', isDarkMode ? 'dark' : 'light');
//     }, [isDarkMode]);

//     useEffect(() => {
//         const handleHashChange = () => {
//             const hash = window.location.hash.replace('#/user/', '').split('?')[0];
//             setActivePage(hash.startsWith('edit-booking/') ? 'edit-booking' : (hash || 'dashboard'));
//         };
//         window.addEventListener('hashchange', handleHashChange);
//         handleHashChange();
//         return () => window.removeEventListener('hashchange', handleHashChange);
//     }, []);

//     const handleDiscountApplied = async (newPoints) => {
//         const response = await apiFetchUser('/profile');
//         const data = await response.json();
//         setCurrentUser(data.data);
//     };

//     const handleLogoutConfirm = () => {
//         localStorage.clear();
//         window.location.href = '/login';
//     };

//     const renderPage = () => {
//         if (!currentUser) {
//             return <div className="text-center p-12">Loading User Data...</div>;
//         }

//         switch (activePage) {
//             case 'dashboard': return <UserDashboardPage />;
//             case 'bookings': return <UserBookingsPage />;
//             case 'new-booking': return <NewBookingPage />;
//             case 'my-payments': return <MyPaymentsPage currentUser={currentUser} loyaltyPoints={currentUser.loyaltyPoints} onDiscountApplied={handleDiscountApplied} />;
//             case 'edit-booking': return <EditBookingPage />;
//             case 'profile': return <UserProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
//             case 'chat': return <ChatPage currentUser={currentUser} />;
//             default:
//                 window.location.hash = '#/user/dashboard';
//                 return <UserDashboardPage />;
//         }
//     };

//     const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`; };
//     const profilePictureSrc = currentUser?.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`;

//     return (
//         <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
//             {/* Mobile Sidebar */}
//             <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//                 <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
//                     <UserSidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} unreadChatCount={unreadChatCount} />
//                 </div>
//                 <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
//             </div>
//             {/* Desktop Sidebar */}
//             <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
//                 <UserSidebarContent activePage={activePage} onLinkClick={() => { }} onLogoutClick={() => setLogoutConfirmOpen(true)} unreadChatCount={unreadChatCount} />
//             </aside>

//             <main className="flex-1 flex flex-col overflow-hidden">
//                 <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
//                     <div className="hidden lg:block" />
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//                         </button>
//                         <div className="flex items-center gap-3">
//                             <img key={profilePictureSrc} src={profilePictureSrc} alt="User" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} />
//                             <div>
//                                 <p className="font-semibold text-sm">{currentUser?.fullName}</p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//                 <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8 flex flex-col">
//                     {renderPage()}
//                 </div>
//             </main>

//             <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} onConfirm={handleLogoutConfirm} title="Confirm Logout" message="Are you sure you want to logout?" confirmText="Logout" confirmButtonVariant="danger" Icon={LogOut} />
            
//             {/* --- AI CHATBOT INTEGRATION --- */}
//             {/* The GeminiChatbot is placed here to be available on all user pages */}
//             <GeminiChatbot />
//         </div>
//     );
// };

// export default UserDashboard;










import React, { useState, useEffect, useRef, useContext } from 'react';
import { LayoutDashboard, CalendarDays, User, LogOut, Menu, X, Sun, Moon, PlusCircle, Bike, Wrench, Edit, Trash2, AlertTriangle, Camera, MapPin, CreditCard, ArrowLeft, Gift, ArrowRight, ChevronDown, ChevronUp, MessageSquare, Send, Paperclip, FileText, XCircle, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { AuthContext } from '../auth/AuthContext';

const socket = io.connect("http://localhost:5050");
const API_BASE_URL_USER = "http://localhost:5050/api/user";

const apiFetchUser = async (endpoint, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL_USER}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An API error occurred.');
    }

    return response;
};

// --- START: Helper Components (Shared across the dashboard) ---
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

const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${className}`}>{children}</div>);
const StatusBadge = ({ status }) => (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>{status}</span>);
const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        special: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
    };
    return (<button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
};
const Input = React.forwardRef(({ id, label, ...props }, ref) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input id={id} {...props} ref={ref} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600" />
    </div>
));
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
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="!px-3 !py-1.5 text-sm">
                <ArrowLeft size={16} /> Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
            <Button variant="secondary" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="!px-3 !py-1.5 text-sm">
                Next <ArrowRight size={16} />
            </Button>
        </div>
    );
};
const LoadMoreControl = ({ onToggle, isExpanded, hasMore }) => {
    if (!hasMore) return null;
    return (
        <div className="flex justify-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onToggle} className="!px-6 !py-2 text-sm !gap-1.5 transform hover:scale-105 hover:shadow-lg transition-all duration-200">
                {isExpanded ? (<><ChevronUp size={18} /> Show Less</>) : (<><ChevronDown size={18} /> Load More</>)}
            </Button>
        </div>
    );
};
// --- END: Helper Components ---



const UserServiceHomePage = ({ currentUser }) => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const response = await apiFetchUser('/services');
                const data = await response.json();
                setServices(data.data || []);
            } catch (error) {
                toast.error(error.message || "Failed to load services.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);
    
    const handleImageError = (e) => { e.target.src = '/motofix-logo.png'; };

    if (isLoading) {
        return <div className="text-center p-12">Loading Services...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white"></h1>
                <p className="mt-2 text-lg font-bold text-white-600 dark:text-gray-300">Welcome, {currentUser?.fullName}! Choose a service to get started.</p>
            </div>
            
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map(service => (
                        <a key={service._id} href={`#/user/service-details/${service._id}`} className="group block">
                            <Card className="flex flex-col h-full text-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                                <img 
                                    src={`http://localhost:5050/${service.image}`} 
                                    alt={service.name} 
                                    onError={handleImageError}
                                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex-grow">{service.name}</h3>
                                <p className="mt-2 text-blue-600 dark:text-blue-400 font-bold text-lg">रु{service.price}</p>
                                
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{service.description}</p>
                                <Button variant="secondary" className="mt-4 w-full">View Details</Button>
                            </Card>
                        </a>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-16">
                    <Wrench size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold">No Services Available</h3>
                    <p className="mt-1 text-sm text-gray-500">Our admin hasn't added any services yet. Please check back later.</p>
                </Card>
            )}
        </div>
    );
};

// ... (imports and other components are unchanged) ...

// const UserServiceHomePage = ({ currentUser }) => {
//     const [services, setServices] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchServices = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await apiFetchUser('/services');
//                 const data = await response.json();
//                 setServices(data.data || []);
//             } catch (error) {
//                 toast.error(error.message || "Failed to load services.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchServices();
//     }, []);
    
//     const handleImageError = (e) => { e.target.src = '/motofix-logo.png'; };

//     if (isLoading) {
//         return <div className="text-center p-12">Loading Services...</div>;
//     }

//     return (
//         <div className="space-y-8">
//             <div className="text-center">
//                 <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Our Services</h1>
//                 <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Welcome, {currentUser?.fullName}! Choose a service to get started.</p>
//             </div>
            
//             {services.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {services.map(service => (
//                         <a key={service._id} href={`#/user/service-details/${service._id}`} className="group block">
//                             <Card className="flex flex-col h-full text-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
//                                 <img 
//                                     src={`http://localhost:5050/${service.image}`} 
//                                     alt={service.name} 
//                                     onError={handleImageError}
//                                     className="w-full h-40 object-cover rounded-t-lg mb-4"
//                                 />
//                                 <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex-grow">{service.name}</h3>
                                
//                                 {/* ⭐ MODIFIED SECTION TO SHOW PRICE AND DURATION */}
//                                 <div className="mt-2">
//                                     <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">रु{service.price}</p>
//                                     {service.duration && (
//                                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                                             Approx. {service.duration}
//                                         </p>
//                                     )}
//                                 </div>
                                
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate">{service.description}</p>
//                                 <Button variant="secondary" className="mt-4 w-full">View Details</Button>
//                             </Card>
//                         </a>
//                     ))}
//                 </div>
//             ) : (
//                 <Card className="text-center py-16">
//                     <Wrench size={48} className="mx-auto text-gray-400" />
//                     <h3 className="mt-4 text-xl font-semibold">No Services Available</h3>
//                     <p className="mt-1 text-sm text-gray-500">Our admin hasn't added any services yet. Please check back later.</p>
//                 </Card>
//             )}
//         </div>
//     );
// };


// --- NEW: Service Detail Page Component ---
// const ServiceDetailPage = () => {
//     const [service, setService] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
    
//     useEffect(() => {
//         const fetchService = async () => {
//             const id = window.location.hash.split('/').pop();
//             if (!id) {
//                 toast.error("Service ID not found.");
//                 window.location.hash = '#/user/home';
//                 return;
//             }
//             setIsLoading(true);
//             try {
//                 const response = await apiFetchUser(`/services/${id}`);
//                 const data = await response.json();
//                 setService(data.data);
//             } catch (error) {
//                 toast.error(error.message || "Could not load service details.");
//                 window.location.hash = '#/user/home';
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchService();
//     }, []);
    
//     const handleBookNow = () => {
//         if (service) {
//             window.location.hash = `#/user/new-booking?serviceId=${service._id}`;
//         }
//     };
    
//     if (isLoading) {
//         return <div className="text-center p-12">Loading Service Details...</div>;
//     }
    
//     if (!service) {
//         return (
//              <div className="text-center p-12">
//                 <h1 className="text-2xl font-bold">Service Not Found</h1>
//                 <Button onClick={() => window.location.hash = '#/user/home'} className="mt-4">Back to Services</Button>
//             </div>
//         );
//     }
    
//     const handleImageError = (e) => { e.target.src = '/motofix-logo.png'; };

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center gap-4">
//                 <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                     <ArrowLeft size={24} />
//                 </button>
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{service.name}</h1>
//             </div>
//             <Card>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <img 
//                         src={`http://localhost:5050/${service.image}`} 
//                         alt={service.name}
//                         onError={handleImageError}
//                         className="w-full h-auto max-h-96 object-contain rounded-lg bg-gray-100 dark:bg-gray-900"
//                     />
//                     <div className="flex flex-col">
//                         <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
//                         <p className="text-gray-600 dark:text-gray-300 text-md whitespace-pre-wrap">{service.description}</p>
                        
//                         <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                             <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
//                                 Price: रु{service.price}
//                             </p>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">(Approximate cost)</p>
//                         </div>

//                         <div className="mt-auto pt-6">
//                             <Button onClick={handleBookNow} className="w-full !py-3 !text-lg">
//                                 <PlusCircle size={22}/> Book This Service Now
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };
// ... (UserServiceHomePage is above, other components unchanged) ...


// --- Start Placeholder Definitions (for context) ---
const ServiceDetailPage = () => {
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            // Extracts the ID from the URL hash (e.g., #/user/service-details/12345)
            const id = window.location.hash.split('/').pop();

            if (!id) {
                toast.error("Service ID not found in URL.");
                window.location.hash = '#/user/home'; // Redirect if no ID
                return;
            }

            setIsLoading(true);
            try {
                const response = await apiFetchUser(`/services/${id}`);
                const data = await response.json();
                setService(data.data); // Assumes backend sends data in { data: {...} } format
            } catch (error) {
                toast.error(error.message || "Could not load service details.");
                window.location.hash = '#/user/home'; // Redirect on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchService();
    }, []); // The empty dependency array ensures this runs only once on component mount

    // Function to navigate to the booking page with the service ID pre-filled
    const handleBookNow = () => {
        if (service) {
            window.location.hash = `#/user/new-booking?serviceId=${service._id}`;
        }
    };

    // A fallback for when the image fails to load
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevents infinite loops if the fallback also fails
        e.target.src = '/motofix-logo.png'; // Path to a generic placeholder in your public folder
    };

    // --- RENDER LOGIC ---

    if (isLoading) {
        return (
            <div className="text-center p-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading Service Details...</p>
            </div>
        );
    }

    if (!service) {
        return (
             <div className="text-center p-12">
                <h1 className="text-2xl font-bold">Service Not Found</h1>
                <p className="text-gray-500 mt-2">The service you are looking for may have been removed.</p>
                <Button onClick={() => window.location.hash = '#/user/home'} className="mt-4">
                    <ArrowLeft size={20} /> Back to Services
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.history.back()} 
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{service.name}</h1>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Column */}
                    <div>
                        <img 
                            src={`http://localhost:5050/${service.image}`} 
                            alt={service.name}
                            onError={handleImageError}
                            className="w-full h-auto max-h-96 object-contain rounded-lg bg-gray-100 dark:bg-gray-900 p-2"
                        />
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{service.name}</h2>
                        
                        <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
                           <p className="whitespace-pre-wrap">{service.description}</p>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-baseline gap-8">
                                {/* Price Section */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        रु{service.price}
                                    </p>
                                </div>
                                
                                {/* Duration Section - Renders only if duration exists */}
                                {service.duration && (
                                     <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Time</p>
                                        <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                            {service.duration}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Button - Pushed to the bottom */}
                        <div className="mt-auto pt-8">
                            <Button onClick={handleBookNow} className="w-full !py-3 !text-lg !font-bold">
                                <PlusCircle size={22}/> Book This Service Now
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};


// --- START: Chat Page Component (Corrected and Improved) ---
const ChatPage = ({ currentUser }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    const chatBodyRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const room = currentUser?._id ? `chat-${currentUser._id}` : null;
    const authorName = currentUser?.fullName || 'Customer';
    const authorId = currentUser?._id || null;

    useEffect(() => {
        if (!room || !authorId) return;

        setIsHistoryLoading(true);
        setMessageList([]);

        socket.emit("join_room", { roomName: room, userId: authorId });

        const historyListener = (history) => {
            if (history.length === 0 || (history.length > 0 && history[0].room === room)) {
                setMessageList(history);
            }
            setIsHistoryLoading(false);
        };
        socket.on("chat_history", historyListener);

        const messageListener = (data) => {
            if (data.room === room) {
                setMessageList((list) => [...list, data]);
            }
        };
        socket.on("receive_message", messageListener);

        return () => {
            socket.off("chat_history", historyListener);
            socket.off("receive_message", messageListener);
        };
    }, [room, authorId]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messageList]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
        }
        event.target.value = null;
    };

    const handleRemovePreview = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const sendMessage = async () => {
        if (currentMessage.trim() === "" && !selectedFile) return;
        if (!room || !authorId) return;

        if (selectedFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('room', room);
            formData.append('author', authorName);
            formData.append('authorId', authorId);
            if (currentMessage.trim() !== '') {
                formData.append('message', currentMessage);
            }

            try {
                await apiFetchUser('/chat/upload', {
                    method: 'POST',
                    body: formData,
                });
            } catch (error) {
                toast.error(`File upload failed: ${error.message}`);
            } finally {
                setIsUploading(false);
                handleRemovePreview();
                setCurrentMessage('');
            }
        } else {
            const messageData = {
                room: room,
                author: authorName,
                authorId: authorId,
                message: currentMessage,
            };
            await socket.emit("send_message", messageData);
            setCurrentMessage("");
        }
    };

    const renderFileContent = (msg) => {
        if (msg.fileType?.startsWith('image/')) {
            return (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={msg.fileUrl} alt={msg.fileName || 'Sent Image'} className="max-w-xs rounded-lg mt-1" />
                </a>
            );
        }
        return (
            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download={msg.fileName}
                className="flex items-center gap-3 bg-black/10 dark:bg-white/10 p-3 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors mt-1">
                <FileText size={32} className="flex-shrink-0" />
                <span className="truncate font-medium">{msg.fileName || 'Download File'}</span>
            </a>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Live Chat with Admin</h1>
            <Card className="p-0 flex flex-col" style={{ height: 'calc(80vh - 2rem)' }}>
                <div className="p-3 border-b dark:border-gray-700 flex items-center gap-3 shadow-sm">
                    <img src="/motofix-removebg-preview.png" alt="Support" className="w-10 h-10 rounded-full object-contain bg-gray-100 dark:bg-gray-900 p-1" />
                    <div>
                        <h3 className="font-semibold">MotoFix Support</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Online
                        </p>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 flex flex-col" ref={chatBodyRef}>
                    {isHistoryLoading ? (
                        <div className="m-auto text-center text-gray-500 dark:text-gray-400">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p>Loading chat history...</p>
                        </div>
                    ) : messageList.length === 0 ? (
                        <div className="m-auto text-center text-gray-500 dark:text-gray-400 px-6">
                            <MessageSquare size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-xl font-semibold">Welcome to MotoFix Support!</h3>
                            <p className="mt-1 text-sm">Feel free to ask any questions about our services or your bookings. We're here to help you.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {messageList.map((msg, index) => {
                                const isUserMessage = msg.authorId === authorId;
                                const prevMsg = messageList[index - 1];
                                const nextMsg = messageList[index + 1];
                                const isFirstInGroup = !prevMsg || prevMsg.authorId !== msg.authorId;
                                const isLastInGroup = !nextMsg || nextMsg.authorId !== msg.authorId;

                                return (
                                    <div key={index} className={`flex items-end gap-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                                        {!isUserMessage && (
                                            <div className="w-8 flex-shrink-0 self-end">
                                                {isLastInGroup && <img src="/motofix-removebg-preview.png" alt="p" className="w-7 h-7 rounded-full object-contain bg-gray-100 dark:bg-gray-900 p-0.5" />}
                                            </div>
                                        )}
                                        <div className={`py-2 px-3 max-w-md ${isUserMessage ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} 
                                            ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : ''}
                                            ${isUserMessage ?
                                                `${isFirstInGroup ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-l-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-l-2xl rounded-r-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tr-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-br-md' : ''}` :
                                                `${isFirstInGroup ? 'rounded-t-2xl rounded-br-2xl' : 'rounded-r-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-r-2xl rounded-l-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tl-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-bl-md' : ''}`
                                            }`}
                                        >
                                            {msg.fileUrl && renderFileContent(msg)}
                                            {msg.message && <p className="text-md" style={{ overflowWrap: 'break-word' }}>{msg.message}</p>}
                                            <p className={`text-xs text-right mt-1 opacity-70`}>
                                                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {(previewUrl || selectedFile) && (
                        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                            {previewUrl ? <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" /> : <div className="flex items-center gap-2 text-gray-500"><FileText /><span>{selectedFile.name}</span></div>}
                            <button onClick={handleRemovePreview} className="text-gray-500 hover:text-red-500"><XCircle size={20} /></button>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="flex">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <input type="file" ref={cameraInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
                            <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Paperclip size={22} /></button>
                            <button onClick={() => cameraInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Camera size={22} /></button>
                        </div>
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && !isUploading && sendMessage()}
                            placeholder="Message..."
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
                            disabled={isUploading}
                        />
                        <Button onClick={sendMessage} disabled={isUploading || (!currentMessage.trim() && !selectedFile)} className="!rounded-full !w-12 !h-12 !p-0">
                            {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};


// --- START: Other Page Components ---
const UserDashboardPage = () => {
    const [stats, setStats] = useState({ upcomingBookings: 0, completedServices: 0, loyaltyPoints: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiFetchUser('/dashboard-summary');
                const data = await response.json();
                setStats({
                    upcomingBookings: data.data.upcomingBookings,
                    completedServices: data.data.completedServices,
                    loyaltyPoints: data.data.loyaltyPoints || 0
                });
                setRecentBookings(data.data.recentBookings || []);
            } catch (error) {
                console.error("Failed to fetch dashboard summary:", error);
                toast.error(error.message || "Failed to fetch dashboard summary.");
            }
        };
        fetchData();
    }, []);
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:border-blue-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><CalendarDays className="text-blue-600 dark:text-blue-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Upcoming Bookings</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.upcomingBookings}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-green-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><Wrench className="text-green-600 dark:text-green-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Completed Services</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedServices}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-purple-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full"><Gift className="text-purple-600 dark:text-purple-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Loyalty Points</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.loyaltyPoints}</p>
                        </div>
                    </div>
                </Card>
                <a href="#/user/new-booking" className="md:col-span-1">
                    <Card className="h-full flex flex-col items-center justify-center text-center bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 border-2 border-dashed border-blue-400 hover:border-blue-600">
                        <PlusCircle className="text-blue-600 dark:text-blue-400 mb-2" size={32} />
                        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Book a New Service</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get your bike checked</p>
                    </Card>
                </a>
            </div>
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
                <div className="overflow-x-auto">
                    {recentBookings.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Service</th><th className="p-3">Bike Model</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map(booking => (
                                    <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="p-3"><StatusBadge status={booking.status} /></td>
                                        <td className="p-3 text-right font-medium text-gray-900 dark:text-white">रु{booking.finalAmount ?? booking.totalCost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">You have no recent bookings.</p>
                            <Button className="mt-4" onClick={() => window.location.hash = '#/user/new-booking'}>
                                Book Your First Service
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const fetchBookings = async (page) => {
        setIsLoading(true);
        try {
            const response = await apiFetchUser(`/bookings?page=${page}&limit=10`);
            const data = await response.json();
            setBookings(data.data || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Failed to fetch bookings:', error.message);
            toast.error(error.message || 'Failed to fetch your bookings.');
            setBookings([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchBookings(currentPage);
    }, [currentPage]);
    const handleDelete = async () => {
        if (!bookingToDelete) return;
        try {
            await apiFetchUser(`/bookings/${bookingToDelete}`, { method: 'DELETE' });
            toast.success('Booking cancelled successfully.');
            setBookingToDelete(null);
            fetchBookings(currentPage);
        } catch (error) {
            toast.error(error.message || "Failed to cancel booking.");
        }
    };
    return (
        <div className="space-y-6 flex flex-col flex-grow">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Bookings</h1>
                <Button onClick={() => window.location.hash = '#/user/new-booking'}><PlusCircle size={20} />New Booking</Button>
            </div>
            <Card className="flex flex-col flex-grow">
                <div className="overflow-x-auto flex-grow">
                    {isLoading ? (<div className="text-center p-12 text-gray-500 dark:text-gray-400">Loading bookings...</div>) : bookings.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Service</th><th className="p-3">Bike</th><th className="p-3">Date</th>
                                    <th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3 text-right">Cost</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="p-3"><StatusBadge status={booking.status} /></td>
                                        <td className="p-3"><StatusBadge status={booking.paymentStatus} /></td>
                                        <td className="p-3 text-right font-semibold">
                                            {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
                                            रु{booking.finalAmount ?? booking.totalCost}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => window.location.hash = `#/user/edit-booking/${booking._id}`} disabled={booking.status !== 'Pending' || booking.isPaid || booking.discountApplied}><Edit size={16} /></Button>
                                                <Button variant="danger" size="sm" onClick={() => setBookingToDelete(booking._id)} disabled={booking.isPaid}><Trash2 size={16} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <Bike size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-xl font-semibold">No Bookings Yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Looks like you haven't booked any services with us.</p>
                        </div>
                    )}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </Card>
            <ConfirmationModal isOpen={!!bookingToDelete} onClose={() => setBookingToDelete(null)} onConfirm={handleDelete} title="Cancel Booking" message="Are you sure you want to cancel this booking?" confirmText="Yes, Cancel" />
        </div>
    );
};
const EditBookingPage = () => {
    const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const id = window.location.hash.split('/').pop();
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const servicesRes = await apiFetchUser('/services');
                const { data: allServices } = await servicesRes.json();
                setServices(allServices || []);
                const bookingRes = await apiFetchUser(`/bookings/${id}`);
                const { data: booking } = await bookingRes.json();
                if (booking) {
                    if (booking.isPaid || booking.discountApplied || booking.status !== 'Pending') {
                        toast.error("This booking can no longer be edited.");
                        window.location.hash = '#/user/bookings';
                        return;
                    }
                    const service = (allServices || []).find(s => s.name === booking.serviceType);
                    setFormData({
                        serviceId: service ? service._id : '',
                        bikeModel: booking.bikeModel,
                        date: new Date(booking.date).toISOString().split('T')[0],
                        notes: booking.notes
                    });
                } else {
                    throw new Error("Booking not found.");
                }
            } catch (err) {
                toast.error(err.message || "Failed to load booking data.");
                window.location.hash = '#/user/bookings';
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchInitialData();
        }
    }, []);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const bookingId = window.location.hash.split('/').pop();
            const response = await apiFetchUser(`/bookings/${bookingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            toast.success(data.message || "Booking updated successfully!");
            window.location.hash = '#/user/bookings';
        } catch (err) {
            toast.error(err.message || "Failed to update booking.");
        } finally {
            setIsSubmitting(false);
        }
    };
    if (isLoading) return <div className="text-center p-12">Loading...</div>;
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Booking</h1>
            </div>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
                        <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
                            <option value="" disabled>-- Choose a service --</option>
                            {services.map(service => (
                                <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
                            ))}
                        </select>
                    </div>
                    <Input id="bikeModel" name="bikeModel" label="Bike Model" value={formData.bikeModel} onChange={handleChange} required />
                    <Input id="date" name="date" label="Preferred Date" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Description</label>
                        <textarea id="notes" name="notes" rows="4" value={formData.notes || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => window.location.hash = '#/user/bookings'}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
const NewBookingPage = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ serviceId: '', bikeModel: '', date: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
        const preselectedServiceId = urlParams.get('serviceId');
        const fetchServices = async () => {
            try {
                const response = await apiFetchUser('/services');
                const data = await response.json();
                setServices(data.data || []);
                if (preselectedServiceId) {
                    setFormData(prev => ({ ...prev, serviceId: preselectedServiceId }));
                }
            } catch (err) {
                console.error("Failed to fetch services:", err);
                toast.error(err.message || "Could not load available services. Please try again later.");
            }
        };
        fetchServices();
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.serviceId || !formData.bikeModel || !formData.date) {
            toast.error("Please fill out all required fields.");
            return;
        }
        setIsSubmitting(true);
        try {
            await apiFetchUser('/bookings', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            toast.success("Booking submitted! Please proceed with payment.");
            window.location.hash = `#/user/my-payments`;
        } catch (err) {
            toast.error(err.message || "Failed to submit booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Request a New Service</h1>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service*</label>
                        <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white">
                            <option value="" disabled>-- Choose a service --</option>
                            {services.map(service => (
                                <option key={service._id} value={service._id}>{service.name} (Approx. रु{service.price})</option>
                            ))}
                        </select>
                    </div>
                    <Input id="bikeModel" name="bikeModel" label="Bike Model (e.g., Bajaj Pulsar 220F)*" value={formData.bikeModel} onChange={handleChange} required />
                    <Input id="date" name="date" label="Preferred Date*" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explain Your Problem Here*</label>
                        <textarea id="notes" name="notes" rows="4" value={formData.notes || ""} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" placeholder="Any specific issues or requests?"></textarea>
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
const MyPaymentsPage = ({ currentUser, loyaltyPoints, onDiscountApplied }) => {
    const [unpaidBookings, setUnpaidBookings] = useState([]);
    const [paidBookings, setPaidBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllHistory, setShowAllHistory] = useState(false);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const pendingRes = await apiFetchUser('/bookings/pending');
            const pendingData = await pendingRes.json();
            setUnpaidBookings(pendingData.data || []);
            const historyRes = await apiFetchUser('/bookings/history');
            const historyData = await historyRes.json();
            setPaidBookings(historyData.data || []);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            toast.error(error.message || 'Could not fetch your payment information.');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const message = params.get('message');
        if (status && message) {
            if (status === 'success') {
                toast.success(message);
            } else {
                toast.error(message);
            }
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        }
    }, []);
    const handlePaymentAndDiscount = async () => {
        await fetchData();
        const profileResponse = await apiFetchUser('/profile');
        const data = await profileResponse.json();
        onDiscountApplied(data.data.loyaltyPoints);
    };
    const handleApplyDiscount = async (bookingId) => {
        try {
            await apiFetchUser(`/bookings/${bookingId}/apply-discount`, { method: 'PUT' });
            toast.success('Discount applied!');
            handlePaymentAndDiscount();
        } catch (error) {
            toast.error(error.message || "Failed to apply discount.");
        }
    };
    const handlePayment = async (booking, method) => {
        const amountToPay = booking.finalAmount ?? booking.totalCost;
        if (method === 'COD') {
            try {
                await apiFetchUser(`/bookings/${booking._id}/pay`, {
                    method: 'PUT',
                    body: JSON.stringify({ paymentMethod: 'COD' })
                });
                toast.success("Payment Confirmed! Your booking is now being processed.");
                handlePaymentAndDiscount();
            } catch (error) {
                toast.error(error.message || "Payment confirmation failed.");
            }
            return;
        }
        if (method === 'eSewa') {
            try {
                const response = await fetch('http://localhost:5050/api/payment/esewa/initiate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ bookingId: booking._id }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'An API error occurred.');
                }
                const esewaResponse = await response.json();
                const form = document.createElement('form');
                form.setAttribute('method', 'POST');
                form.setAttribute('action', esewaResponse.ESEWA_URL);
                for (const key in esewaResponse) {
                    if (key !== 'ESEWA_URL') {
                        const hiddenField = document.createElement('input');
                        hiddenField.setAttribute('type', 'hidden');
                        hiddenField.setAttribute('name', key);
                        hiddenField.setAttribute('value', esewaResponse[key]);
                        form.appendChild(hiddenField);
                    }
                }
                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                toast.error(error.message || 'Error initiating eSewa payment.');
            }
            return;
        }
        if (method === 'Khalti') {
            const khaltiConfig = {
                publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
                productIdentity: booking._id,
                productName: booking.serviceType,
                productUrl: window.location.href,
                eventHandler: {
                    async onSuccess(payload) {
                        try {
                            await apiFetchUser('/bookings/verify-khalti', {
                                method: 'POST',
                                body: JSON.stringify({
                                    token: payload.token,
                                    amount: payload.amount,
                                    booking_id: booking._id
                                })
                            });
                            toast.success('Payment Successful & Verified!');
                            handlePaymentAndDiscount();
                        } catch (error) {
                            toast.error(error.message || 'Payment verification failed.');
                        }
                    },
                    onError: (error) => toast.error('Payment process was interrupted.'),
                    onClose: () => console.log('Khalti widget closed'),
                },
                paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
            };
            const checkout = new KhaltiCheckout(khaltiConfig);
            checkout.show({ amount: amountToPay * 100 });
        }
    };
    const displayedHistory = showAllHistory ? paidBookings : paidBookings.slice(0, 10);
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Payments</h1>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pending Payments</h2>
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Gift size={20} />
                        <span className="font-semibold">{loyaltyPoints} Points</span>
                    </div>
                </div>
                {isLoading && unpaidBookings.length === 0 ? (<div className="text-center p-12">Loading...</div>) :
                    unpaidBookings.length > 0 ? (
                        <div className="space-y-4">
                            {unpaidBookings.map(booking => (
                                <div key={booking._id} className="p-4 border rounded-lg dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="font-bold">{booking.serviceType} for {booking.bikeModel}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                        <div className="text-lg font-semibold mt-1">
                                            {booking.discountApplied ? (
                                                <>
                                                    <span className="text-base text-gray-500 line-through mr-2">रु{booking.totalCost}</span>
                                                    <span className="text-green-600">रु{booking.finalAmount}</span>
                                                </>
                                            ) : (
                                                <span>Total: रु{booking.totalCost}</span>
                                            )}
                                        </div>
                                        {booking.discountApplied && <p className="text-sm font-bold text-green-500">Discount: -रु{booking.discountAmount}</p>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {loyaltyPoints >= 100 && !booking.discountApplied && (
                                            <Button variant="special" onClick={() => handleApplyDiscount(booking._id)}>
                                                <Gift size={16} /> Apply 20% Discount
                                            </Button>
                                        )}
                                        <Button onClick={() => handlePayment(booking, 'COD')}>Pay with COD</Button>
                                        <Button variant="secondary" onClick={() => handlePayment(booking, 'Khalti')} className="bg-white"><img src="/khaltilogo.png" alt="Khalti" style={{ height: '24px' }} /></Button>
                                        <Button variant="secondary" onClick={() => handlePayment(booking, 'eSewa')} className="bg-white hover:bg-gray-100"><img src="/esewa_logo.png" alt="eSewa" style={{ height: '24px' }} /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CreditCard size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-xl font-semibold">No Pending Payments</h3>
                            <p className="mt-1 text-sm text-gray-500">All your payments are up to date!</p>
                        </div>
                    )}
            </Card>
            <Card className="flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Payment History</h2>
                <div className="overflow-x-auto flex-grow">
                    {isLoading && paidBookings.length === 0 ? (<div className="text-center p-12">Loading history...</div>) :
                        displayedHistory.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="p-3">Service</th><th className="p-3">Bike</th>
                                        <th className="p-3">Date</th><th className="p-3">Amount Paid</th><th className="p-3">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedHistory.map(booking => (
                                        <tr key={booking._id} className="border-b dark:border-gray-700">
                                            <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.serviceType}</td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                            <td className="p-3 font-semibold">
                                                {booking.discountApplied && (<span className="text-xs text-red-500 line-through mr-1">रु{booking.totalCost}</span>)}
                                                रु{booking.finalAmount ?? booking.totalCost}
                                            </td>
                                            <td className="p-3"><StatusBadge status={booking.paymentMethod} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No payment history found.</p>
                            </div>
                        )
                    }
                </div>
                <LoadMoreControl
                    onToggle={() => setShowAllHistory(!showAllHistory)}
                    isExpanded={showAllHistory}
                    hasMore={paidBookings.length > 10}
                />
            </Card>
        </div>
    );
};
const UserProfilePage = ({ currentUser, setCurrentUser }) => {
    const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', address: '', profilePicture: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [initialProfile, setInitialProfile] = useState({});
    const fileInputRef = useRef(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetchUser('/profile');
                const data = await response.json();
                const profileData = { ...data.data, address: data.data.address || '' };
                setProfile(profileData);
                setInitialProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error(error.message || "Failed to fetch profile.");
            }
        };
        fetchProfile();
    }, []);
    const handleFetchLocation = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }
        setIsFetchingLocation(true);
        toast.info("Fetching your location...");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    if (!response.ok) throw new Error('Failed to convert location to address.');
                    const data = await response.json();
                    if (data && data.display_name) {
                        setProfile(p => ({ ...p, address: data.display_name }));
                        toast.success("Location fetched successfully!");
                    } else {
                        throw new Error('Could not find address.');
                    }
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                let message = "Geolocation permission denied. Please enable it in browser settings.";
                toast.error(message);
                setIsFetchingLocation(false);
            }
        );
    };
    const handleSave = async () => {
        const formData = new FormData();
        formData.append('fullName', profile.fullName);
        formData.append('email', profile.email);
        formData.append('phone', profile.phone);
        formData.append('address', profile.address);
        if (profile.newProfilePicture) {
            formData.append('profilePicture', profile.newProfilePicture);
        }
        try {
            const response = await apiFetchUser('/profile', {
                method: 'PUT',
                body: formData
            });
            const data = await response.json();
            const updatedData = { ...data.data, address: data.data.address || '' };
            setProfile(updatedData);
            setInitialProfile(updatedData);
            setCurrentUser(updatedData);
            setIsEditing(false);
            toast.success(data.message || 'Profile updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile.');
        }
    };
    const handleCancel = () => {
        setProfile(initialProfile);
        setIsEditing(false);
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(p => ({ ...p, profilePictureUrl: URL.createObjectURL(file), newProfilePicture: file }));
        }
    };
    const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`; };
    const profilePictureSrc = profile.profilePictureUrl || (profile.profilePicture ? `http://localhost:5050/${profile.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`);
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
            <Card>
                <div className="flex justify-end mb-4">
                    {!isEditing && <Button onClick={() => setIsEditing(true)}><Edit size={16} /> Edit Profile</Button>}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 flex flex-col items-center text-center">
                        <img key={profilePictureSrc} src={profilePictureSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} />
                        {isEditing && (
                            <>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <Button variant="secondary" onClick={() => fileInputRef.current.click()}><Camera size={16} /> Change Picture</Button>
                            </>
                        )}
                        <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">{profile.fullName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <Input id="fullName" label="Full Name" name="fullName" value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} disabled={!isEditing} />
                        <Input id="email" label="Email Address" name="email" type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={!isEditing} />
                        <Input id="phone" label="Phone Number" name="phone" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} />
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <div className="flex items-center gap-2">
                                <textarea id="address" name="address" rows="3"
                                    className="flex-grow px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600"
                                    value={profile.address || ''}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    disabled={!isEditing || isFetchingLocation}
                                    placeholder="Click button to fetch or enter manually."
                                />
                                {isEditing && (
                                    <Button type="button" variant="secondary" onClick={handleFetchLocation} disabled={isFetchingLocation} className="shrink-0">
                                        <MapPin size={18} className={isFetchingLocation ? 'animate-pulse' : ''} />
                                    </Button>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};


// --- START: Main Dashboard Structure & Logic ---
const UserNavLink = ({ page, icon: Icon, children, activePage, onLinkClick, badgeCount }) => {
    const isActive = activePage === page;
    return (
        <a href={`#/user/${page}`} onClick={onLinkClick} className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <Icon size={22} />
            <span className="text-md">{children}</span>
            {badgeCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {badgeCount}
                </span>
            )}
        </a>
    );
};

const UserSidebarContent = ({ activePage, onLinkClick, onLogoutClick, onMenuClose, unreadChatCount }) => {
    const handleLogoClick = () => {
        window.location.hash = '#/user/home';
        if (onMenuClose) onMenuClose();
    };
    return (
        <>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick} title="Go to Home">
                    <img src="/motofix-removebg-preview.png" alt="MotoFix Logo" className="h-20 w-auto hover:opacity-80 transition-opacity duration-200" />
                </div>
                {onMenuClose && <button onClick={onMenuClose} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>}
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <UserNavLink page="home" icon={Home} activePage={activePage} onLinkClick={onLinkClick}>Home</UserNavLink>
                <UserNavLink page="dashboard" icon={LayoutDashboard} activePage={activePage} onLinkClick={onLinkClick}>Dashboard</UserNavLink>
                <UserNavLink page="bookings" icon={CalendarDays} activePage={activePage} onLinkClick={onLinkClick}>My Bookings</UserNavLink>
                <UserNavLink page="my-payments" icon={CreditCard} activePage={activePage} onLinkClick={onLinkClick}>My Payments</UserNavLink>
                <UserNavLink page="new-booking" icon={PlusCircle} activePage={activePage} onLinkClick={onLinkClick}>New Booking</UserNavLink>
                <UserNavLink page="profile" icon={User} activePage={activePage} onLinkClick={onLinkClick}>Profile</UserNavLink>
                <UserNavLink page="chat" icon={MessageSquare} activePage={activePage} onLinkClick={onLinkClick} badgeCount={unreadChatCount}>Chat</UserNavLink>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={onLogoutClick} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800">
                    <LogOut size={22} />
                    <span className="text-md">Logout</span>
                </button>
            </div>
        </>
    );
};

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activePage, setActivePage] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('userTheme') === 'dark');
    const [unreadChatCount, setUnreadChatCount] = useState(0);

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
                console.error("Failed to fetch initial user data", error);
                if (error.message.includes('Unauthorized') || error.message.includes('token')) {
                    handleLogoutConfirm();
                }
            }
        };
        fetchInitialData();
    }, [user]);

    useEffect(() => {
        if (!currentUser) return;
        const notificationListener = (data) => {
            const currentChatRoom = `chat-${currentUser._id}`;
            if (data.room === currentChatRoom && window.location.hash !== '#/user/chat') {
                setUnreadChatCount(prevCount => prevCount + 1);
            }
        };
        const readListener = () => {
            setUnreadChatCount(0);
        };
        socket.on('new_message_notification', notificationListener);
        socket.on('messages_read_by_user', readListener);
        return () => {
            socket.off('new_message_notification', notificationListener);
            socket.off('messages_read_by_user', readListener);
        };
    }, [currentUser]);

    useEffect(() => {
        document.title = unreadChatCount > 0 ? `(${unreadChatCount}) MotoFix Customer` : 'MotoFix Customer';
    }, [unreadChatCount]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('userTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        const handleHashChange = () => {
            const path = window.location.hash.replace('#/user/', '').split('?')[0];
            let page = path || 'home';
            if (path.startsWith('edit-booking/')) {
                page = 'edit-booking';
            } else if (path.startsWith('service-details/')) {
                page = 'service-details';
            }
            setActivePage(page);
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleDiscountApplied = async (newPoints) => {
        const response = await apiFetchUser('/profile');
        const data = await response.json();
        setCurrentUser(data.data);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const renderPage = () => {
        if (!currentUser) {
            return <div className="text-center p-12">Loading User Data...</div>;
        }
        switch (activePage) {
            case 'home': return <UserServiceHomePage currentUser={currentUser} />;
            case 'service-details': return <ServiceDetailPage />;
            case 'dashboard': return <UserDashboardPage />;
            case 'bookings': return <UserBookingsPage />;
            case 'new-booking': return <NewBookingPage />;
            case 'my-payments': return <MyPaymentsPage currentUser={currentUser} loyaltyPoints={currentUser.loyaltyPoints} onDiscountApplied={handleDiscountApplied} />;
            case 'edit-booking': return <EditBookingPage />;
            case 'profile': return <UserProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
            case 'chat': return <ChatPage currentUser={currentUser} />;
            default:
                window.location.hash = '#/user/home';
                return <UserServiceHomePage currentUser={currentUser} />;
        }
    };

    const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`; };
    const profilePictureSrc = currentUser?.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`;

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                    <UserSidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} unreadChatCount={unreadChatCount} />
                </div>
                <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
            </div>
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
                <UserSidebarContent activePage={activePage} onLinkClick={() => { }} onLogoutClick={() => setLogoutConfirmOpen(true)} unreadChatCount={unreadChatCount} />
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <img key={profilePictureSrc} src={profilePictureSrc} alt="User" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} />
                            <div>
                                <p className="font-semibold text-sm">{currentUser?.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8 flex flex-col">
                    {renderPage()}
                </div>
            </main>
            <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} onConfirm={handleLogoutConfirm} title="Confirm Logout" message="Are you sure you want to logout?" confirmText="Logout" confirmButtonVariant="danger" Icon={LogOut} />
        </div>
    );
};

export default UserDashboard;