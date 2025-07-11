// import React, { useState, useEffect, useRef } from 'react';
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Plus, Edit, Trash2, Search, Users, Wrench, DollarSign, List, User, LogOut, Menu, X, Sun, Moon, Camera, AlertTriangle, ArrowLeft, MapPin, ChevronLeft, ChevronRight, MessageSquare, Send, Inbox, Paperclip, FileText, XCircle, Loader } from 'lucide-react';
// import { toast } from 'react-toastify';
// import io from 'socket.io-client';
// import GeminiChatbot from '../../components/GeminiChatbot';

// // Import the new Gemini Chatbot

// const API_BASE_URL = "http://localhost:5050/api/admin";
// const socket = io.connect("http://localhost:5050");

// // CORRECTED: This function now ALWAYS returns the raw Response object on success.
// const apiFetch = async (endpoint, options = {}) => {
//     const headers = {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         ...options.headers
//     };

//     if (!(options.body instanceof FormData)) {
//         headers['Content-Type'] = 'application/json';
//     }

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'An error occurred with the API request.');
//     }

//     return response; // ALWAYS return the response object.
// };

// // --- START: Admin Chat Page Component (Fully Updated) ---
// const AdminChatPage = () => {
//     const [conversations, setConversations] = useState([]);
//     const [activeConversation, setActiveConversation] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [currentMessage, setCurrentMessage] = useState('');
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [isUploading, setIsUploading] = useState(false);

//     const chatBodyRef = useRef(null);
//     const fileInputRef = useRef(null);
//     const cameraInputRef = useRef(null);

//     // CORRECTED: Added .json() call
//     const fetchConversations = async () => {
//         try {
//             const response = await apiFetch('/chat/users');
//             const data = await response.json();
//             setConversations(data.data || []);
//         } catch (error) {
//             toast.error('Failed to fetch chat conversations.');
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         fetchConversations();
//     }, []);

//     // Effect for real-time socket events
//     useEffect(() => {
//         const newMessageListener = (data) => {
//             const roomUserId = data.room.replace('chat-', '');
//             if (activeConversation?._id === roomUserId) {
//                 setMessages((prev) => [...prev, data]);
//             } else {
//                 setConversations(prevConvos => {
//                     let convoExists = false;
//                     const updatedConvos = prevConvos.map(convo => {
//                         if (convo._id === roomUserId) {
//                             convoExists = true;
//                             const lastMessageText = data.message || `Sent a ${data.fileType.split('/')[0]}`;
//                             return { ...convo, unreadCount: (convo.unreadCount || 0) + 1, lastMessage: lastMessageText, lastMessageTimestamp: new Date().toISOString() };
//                         }
//                         return convo;
//                     });
//                     if (!convoExists) {
//                         fetchConversations();
//                         return prevConvos;
//                     }
//                     updatedConvos.sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
//                     return updatedConvos;
//                 });
//             }
//         };

//         const messagesReadListener = (data) => {
//             const roomUserId = data.room.replace('chat-', '');
//             setConversations(prevConvos =>
//                 prevConvos.map(convo =>
//                     convo._id === roomUserId ? { ...convo, unreadCount: 0 } : convo
//                 )
//             );
//         };

//         socket.on('receive_message', newMessageListener);
//         socket.on('messages_read_by_admin', messagesReadListener);

//         return () => {
//             socket.off('receive_message', newMessageListener);
//             socket.off('messages_read_by_admin', messagesReadListener);
//         };
//     }, [activeConversation]);

//     // Effect for joining rooms and fetching history
//     useEffect(() => {
//         if (activeConversation) {
//             const roomName = `chat-${activeConversation._id}`;
//             const historyListener = (history) => {
//                 if ((history.length > 0 && history[0].room === roomName) || (history.length === 0 && `chat-${activeConversation._id}` === roomName)) {
//                     setMessages(history);
//                 }
//             };
//             socket.on('chat_history', historyListener);
//             return () => { socket.off('chat_history', historyListener); };
//         }
//     }, [activeConversation]);

//     useEffect(() => {
//         if (chatBodyRef.current) {
//             chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//         }
//     }, [messages]);

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

//     const handleSendMessage = async () => {
//         if (!activeConversation) return;
//         if (currentMessage.trim() === '' && !selectedFile) return;

//         if (selectedFile) {
//             setIsUploading(true);
//             const formData = new FormData();
//             formData.append('file', selectedFile);
//             formData.append('room', `chat-${activeConversation._id}`);
//             formData.append('author', 'Admin');
//             formData.append('authorId', 'admin_user');
//             if (currentMessage.trim() !== '') {
//                 formData.append('message', currentMessage);
//             }

//             try {
//                 await apiFetch('/chat/upload', {
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
//                 room: `chat-${activeConversation._id}`,
//                 author: 'Admin',
//                 authorId: 'admin_user',
//                 message: currentMessage,
//             };
//             await socket.emit('send_message', messageData);
//             setCurrentMessage('');
//         }
//     };

//     const handleSelectConversation = (user) => {
//         if (activeConversation?._id !== user._id) {
//             setMessages([]);
//             setActiveConversation(user);
//             handleRemovePreview();
//             socket.emit('join_room', {
//                 roomName: `chat-${user._id}`,
//                 userId: 'admin_user'
//             });
//         }
//     };

//     const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(e.target.dataset.name || 'U')}&background=e2e8f0&color=4a5568&size=40`; };

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
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Chats</h1>
//             <Card className="p-0 flex" style={{ height: 'calc(80vh - 2rem)' }}>
//                 <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto">
//                     <div className="p-4 border-b dark:border-gray-600"><h2 className="font-semibold text-lg">Conversations</h2></div>
//                     <ul className="divide-y dark:divide-gray-700">
//                         {conversations.map(user => (
//                             <li key={user._id} onClick={() => handleSelectConversation(user)} className={`p-4 cursor-pointer flex items-center gap-3 relative transition-colors ${activeConversation?._id === user._id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
//                                 <img src={user.profilePicture ? `http://localhost:5050/${user.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'U')}&background=0D8ABC&color=fff&size=40`} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" data-name={user.fullName} onError={handleImageError} />
//                                 <div className="flex-grow overflow-hidden">
//                                     <p className={`truncate ${user.unreadCount > 0 ? 'font-bold' : 'font-semibold'}`}>{user.fullName}</p>
//                                     <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.lastMessage}</p>
//                                 </div>
//                                 {user.unreadCount > 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{user.unreadCount}</span>}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 <div className="w-2/3 flex flex-col bg-white dark:bg-gray-900/50">
//                     {activeConversation ? (
//                         <>
//                             <div className="p-3 border-b dark:border-gray-700 flex items-center gap-3 shadow-sm">
//                                 <img src={activeConversation.profilePicture ? `http://localhost:5050/${activeConversation.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.fullName || 'U')}&background=0D8ABC&color=fff&size=40`} alt={activeConversation.fullName} className="w-10 h-10 rounded-full object-cover" data-name={activeConversation.fullName} onError={handleImageError} />
//                                 <div><h3 className="font-semibold">{activeConversation.fullName}</h3><p className="text-sm text-gray-500">{activeConversation.email}</p></div>
//                             </div>

//                             <div className="flex-grow overflow-y-auto p-4 space-y-1" ref={chatBodyRef}>
//                                 {messages.map((msg, index) => {
//                                     const isAdmin = msg.authorId === 'admin_user';
//                                     const prevMsg = messages[index - 1];
//                                     const nextMsg = messages[index + 1];
//                                     const isFirstInGroup = !prevMsg || prevMsg.authorId !== msg.authorId;
//                                     const isLastInGroup = !nextMsg || nextMsg.authorId !== msg.authorId;

//                                     return (
//                                         <div key={index} className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
//                                             {!isAdmin && (
//                                                 <div className="w-8 flex-shrink-0 self-end">
//                                                     {isLastInGroup && <img src={activeConversation.profilePicture ? `http://localhost:5050/${activeConversation.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`} alt="p" className="w-7 h-7 rounded-full object-cover" />}
//                                                 </div>
//                                             )}
//                                             <div className={`py-2 px-3 max-w-md ${isAdmin ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} 
//                                                 ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : ''}
//                                                 ${isAdmin ?
//                                                     `${isFirstInGroup ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-l-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-l-2xl rounded-r-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tr-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-br-md' : ''}` :
//                                                     `${isFirstInGroup ? 'rounded-t-2xl rounded-br-2xl' : 'rounded-r-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-r-2xl rounded-l-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tl-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-bl-md' : ''}`
//                                                 }`}
//                                             >
//                                                 {msg.fileUrl && renderFileContent(msg)}
//                                                 {msg.message && <p className="text-md" style={{ overflowWrap: 'break-word' }}>{msg.message}</p>}
//                                                 <p className={`text-xs text-right mt-1 opacity-70`}>
//                                                     {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>

//                             <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
//                                 {(previewUrl || selectedFile) && (
//                                     <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
//                                         {previewUrl ? <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" /> : <div className="flex items-center gap-2 text-gray-500"><FileText /><span>{selectedFile.name}</span></div>}
//                                         <button onClick={handleRemovePreview} className="text-gray-500 hover:text-red-500"><XCircle size={20} /></button>
//                                     </div>
//                                 )}
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex">
//                                         <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
//                                         <input type="file" ref={cameraInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
//                                         <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Paperclip size={22} /></button>
//                                         <button onClick={() => cameraInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Camera size={22} /></button>
//                                     </div>
//                                     <input
//                                         type="text"
//                                         value={currentMessage}
//                                         onChange={(e) => setCurrentMessage(e.target.value)}
//                                         onKeyPress={(e) => e.key === "Enter" && !isUploading && handleSendMessage()}
//                                         placeholder="Message..."
//                                         className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
//                                         disabled={isUploading}
//                                     />
//                                     <Button onClick={handleSendMessage} disabled={isUploading || (!currentMessage.trim() && !selectedFile)} className="!rounded-full !w-12 !h-12 !p-0">
//                                         {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </>
//                     ) : (
//                         <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
//                             <Inbox size={64} />
//                             <p className="mt-4 text-lg">Select a conversation to start chatting</p>
//                         </div>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// };
// // --- END: Admin Chat Page Component ---

// const getStatusColor = (status) => {
//     switch (status) {
//         case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
//         case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
//         case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
//         default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
//     }
// };

// const Card = ({ children, className = '', ...props }) => (<div {...props} className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${className}`}>{children}</div>);

// const Modal = ({ isOpen, onClose, title, children }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
//                 </div>
//                 <div className="p-6">{children}</div>
//             </div>
//         </div>
//     );
// };

// const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
//     const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
//     const variants = {
//         primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//         secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
//         danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//     };
//     return (<button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
// };

// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmButtonVariant = 'danger', Icon = AlertTriangle, iconColor = 'text-red-600 dark:text-red-400', iconBgColor = 'bg-red-100 dark:bg-red-900/50' }) => {
//     if (!isOpen) return null;
//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title="">
//             <div className="text-center">
//                 <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
//                 <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
//                 <div className="mt-2 px-7 py-3"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div>
//                 <div className="flex justify-center gap-3 mt-4">
//                     <Button variant="secondary" onClick={onClose}>Cancel</Button>
//                     <Button variant={confirmButtonVariant} onClick={onConfirm}>{confirmText}</Button>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// const Input = ({ id, label, ...props }) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
//         <input id={id} {...props} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed" />
//     </div>
// );

// const StatusBadge = ({ status }) => (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>{status}</span>);

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//     if (totalPages <= 1) return null;
//     return (
//         <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-200 dark:border-gray-700">
//             <Button
//                 variant="secondary"
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="!px-3 !py-1.5 text-sm"
//             >
//                 <ChevronLeft size={16} />
//                 Previous
//             </Button>
//             <span className="text-sm text-gray-700 dark:text-gray-300">
//                 Page {totalPages > 0 ? currentPage : 0} of {totalPages > 0 ? totalPages : 0}
//             </span>
//             <Button
//                 variant="secondary"
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={currentPage >= totalPages}
//                 className="!px-3 !py-1.5 text-sm"
//             >
//                 Next
//                 <ChevronRight size={16} />
//             </Button>
//         </div>
//     );
// };

// const DashboardPage = () => {
//     const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalBookings: 0, newUsers: 0, revenueData: [], servicesData: [] });
//     const [recentBookings, setRecentBookings] = useState([]);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 const response = await apiFetch('/dashboard');
//                 const data = await response.json();
//                 const d = data.data || {};
//                 const formattedRevenue = (d.revenueData || []).map(item => ({ name: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }), revenue: item.revenue }));
//                 const formattedServices = (d.servicesData || []).map(item => ({ name: item._id, bookings: item.bookings }));
//                 setAnalytics({ totalRevenue: d.totalRevenue || 0, totalBookings: d.totalBookings || 0, newUsers: d.newUsers || 0, revenueData: formattedRevenue, servicesData: formattedServices });
//                 setRecentBookings(d.recentBookings || []);
//             } catch (error) {
//                 console.error("Failed to fetch dashboard data", error);
//                 toast.error(error.message || "Failed to fetch dashboard data.");
//             }
//         };
//         fetchDashboardData();
//     }, []);

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <Card><div className="flex items-center gap-4"><div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><DollarSign className="text-blue-600 dark:text-blue-300" size={28} /></div><div><p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p><p className="text-2xl font-bold text-gray-800 dark:text-white">रु{analytics.totalRevenue.toLocaleString()}</p></div></div></Card>
//                 <Card><div className="flex items-center gap-4"><div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><List className="text-green-600 dark:text-green-300" size={28} /></div><div><p className="text-gray-500 dark:text-gray-400 text-sm">Total Bookings</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.totalBookings}</p></div></div></Card>
//                 <Card><div className="flex items-center gap-4"><div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full"><Users className="text-indigo-600 dark:text-indigo-300" size={28} /></div><div><p className="text-gray-500 dark:text-gray-400 text-sm">New Users This Month</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.newUsers}</p></div></div></Card>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <Card><h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Overview</h2><ResponsiveContainer width="100%" height={300}><LineChart data={analytics.revenueData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></Card>
//                 <Card><h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Popular Services</h2><ResponsiveContainer width="100%" height={300}><BarChart data={analytics.servicesData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" angle={0} textAnchor="end" height={50} stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Bar dataKey="bookings" fill="#10b981" /></BarChart></ResponsiveContainer></Card>
//             </div>
//             <Card>
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Bookings</h2>
//                 <div className="overflow-x-auto"><table className="w-full text-left"><thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700"><tr><th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3 text-right">Cost</th></tr></thead><tbody>
//                     {recentBookings.length > 0 ? recentBookings.map(booking => (<tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                         <td className="p-3 font-medium text-gray-900 dark:text-white"><a href={`#/admin/bookings/${booking._id}`} className="hover:underline">{booking.customer?.fullName || 'N/A'}</a></td>
//                         <td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType || 'N/A'}</td>
//                         <td className="p-3"><StatusBadge status={booking.status} /></td>
//                         <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                         <td className="p-3 text-right font-medium text-gray-900 dark:text-white">रु{booking.totalCost}</td>
//                     </tr>)) : (<tr><td colSpan="5" className="text-center py-8 text-gray-500">No recent bookings found.</td></tr>)}
//                 </tbody></table></div>
//             </Card>
//         </div>
//     );
// };
// const BookingsPage = () => {
//     const [bookings, setBookings] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingBooking, setEditingBooking] = useState(null);
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const ITEMS_PER_PAGE = 11;

//     const fetchBookings = async (page) => {
//         try {
//             const response = await apiFetch(`/bookings?page=${page}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
//             const data = await response.json();
//             setBookings(data.data || []);
//             setTotalPages(data.totalPages || 0);
//         } catch (error) {
//             console.error('Failed to fetch bookings', error.message);
//             toast.error(error.message || 'Failed to fetch bookings.');
//             setBookings([]);
//             setTotalPages(0);
//         }
//     };

//     useEffect(() => {
//         fetchBookings(currentPage);
//     }, [currentPage, searchTerm]);

//     const handleEdit = (booking) => { setEditingBooking(booking); setIsModalOpen(true); };
//     const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };

//     const confirmDelete = async () => {
//         if (!itemToDelete) return;
//         try {
//             await apiFetch(`/bookings/${itemToDelete}`, { method: 'DELETE' });
//             toast.success('Booking deleted successfully!');
//             fetchBookings(currentPage);
//         } catch (error) {
//             console.error('Failed to delete booking', error);
//             toast.error(error.message || 'Failed to delete booking.');
//         }
//         finally { setConfirmOpen(false); setItemToDelete(null); }
//     };

//     const handleSave = async (formData) => {
//         if (!editingBooking) return;
//         try {
//             const response = await apiFetch(`/bookings/${editingBooking._id}`, {
//                 method: 'PUT',
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             setBookings(bookings.map(b => b._id === editingBooking._id ? data.data : b));
//             toast.success(data.message || 'Booking updated successfully!');
//             closeModal();
//         } catch (error) {
//             console.error('Failed to save booking', error);
//             toast.error(error.message || 'Failed to save booking.');
//         }
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const closeModal = () => { setIsModalOpen(false); setEditingBooking(null); };

//     return (
//         <div className="space-y-6 flex flex-col flex-grow">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bookings Management</h1>
//             <Card className="flex flex-col flex-grow">
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
//                     <div className="relative w-full md:w-auto">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                         <input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                     </div>
//                 </div>
//                 <div className="overflow-x-auto flex-grow">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700"><tr><th className="p-3">Customer</th><th className="p-3">Vehicle</th><th className="p-3">Service</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th><th className="p-3 text-center">Actions</th></tr></thead>
//                         <tbody>
//                             {bookings.length > 0 ? bookings.map(booking => (
//                                 <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                     <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.customer?.fullName || 'N/A'}</td>
//                                     <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel || 'N/A'}</td>
//                                     <td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType || 'N/A'}</td>
//                                     <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
//                                     <td className="p-3"><StatusBadge status={booking.status} /></td>
//                                     <td className="p-3 text-right font-medium">रु{booking.totalCost}</td>
//                                     <td className="p-3 text-center">
//                                         <div className="flex justify-center items-center gap-2">
//                                             <a href={`#/admin/bookings/${booking._id}`} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1" title="View Details"><Search size={18} /></a>
//                                             <button onClick={() => handleEdit(booking)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1" title="Edit Booking"><Edit size={18} /></button>
//                                             <button onClick={() => handleDeleteClick(booking._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1" title="Delete Booking"><Trash2 size={18} /></button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )) : (<tr><td colSpan="7" className="text-center py-10 text-gray-500">No bookings found.</td></tr>)}
//                         </tbody>
//                     </table>
//                 </div>
//                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//             </Card>
//             <BookingFormModal isOpen={isModalOpen} onClose={closeModal} booking={editingBooking} onSave={handleSave} />
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Booking" message="Are you sure you want to delete this booking? This action cannot be undone." />
//         </div>
//     );
// };
// const BookingDetailsPage = ({ bookingId }) => {
//     const [booking, setBooking] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchBooking = async () => {
//             setLoading(true);
//             try {
//                 const response = await apiFetch(`/bookings/${bookingId}`);
//                 const data = await response.json();
//                 setBooking(data.data);
//             } catch (err) {
//                 setError(err.message);
//                 toast.error(err.message || 'Failed to fetch booking details.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (bookingId) {
//             fetchBooking();
//         }
//     }, [bookingId]);

//     if (loading) return <div className="text-center py-10">Loading booking details...</div>;
//     if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
//     if (!booking) return <div className="text-center py-10">Booking not found.</div>;

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center gap-4">
//                 <a href="#/admin/bookings" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowLeft size={22} /></a>
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Booking Details</h1>
//             </div>

//             <Card>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
//                     <div>
//                         <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">Customer Information</h2>
//                         <div className="space-y-2 mt-4 text-gray-600 dark:text-gray-400">
//                             <p><strong>Name:</strong> {booking.customer?.fullName || 'N/A'}</p>
//                             <p><strong>Email:</strong> {booking.customer?.email || 'N/A'}</p>
//                             <p><strong>Phone:</strong> {booking.customer?.phone || 'N/A'}</p>
//                             <p><strong>Address:</strong> {booking.customer?.address || 'N/A'}</p>
//                         </div>
//                     </div>
//                     <div>
//                         <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">Booking Information</h2>
//                         <div className="space-y-2 mt-4 text-gray-600 dark:text-gray-400">
//                             <p><strong>Service:</strong> {booking.serviceType || 'N/A'}</p>
//                             <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
//                             <p><strong>Total Cost:</strong> रु{booking.totalCost}</p>
//                             <p><strong>Status:</strong> <StatusBadge status={booking.status} /></p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="p-6">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">Problem & Vehicle Details</h2>
//                     <div className="space-y-2 mt-4 text-gray-600 dark:text-gray-400">
//                         <p><strong>Vehicle Details:</strong> {booking.bikeModel || 'Not provided'}</p>
//                         <p><strong>Problem Description:</strong> {booking.notes || 'Not provided'}</p>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };
// const UsersPage = () => {
//     const [users, setUsers] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const ITEMS_PER_PAGE = 10;

//     const fetchUsers = async (page) => {
//         try {
//             const response = await apiFetch(`/users?page=${page}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
//             const data = await response.json();
//             setUsers(data.data || []);
//             setTotalPages(data.totalPages || 0);
//         } catch (error) {
//             console.error('Failed to fetch users', error);
//             setUsers([]);
//             setTotalPages(0);
//             toast.error(error.message || 'Failed to fetch users.');
//         }
//     };

//     useEffect(() => {
//         fetchUsers(currentPage);
//     }, [currentPage, searchTerm]);

//     const handleAddNew = () => { setEditingUser(null); setIsModalOpen(true); };
//     const handleEdit = (user) => { setEditingUser(user); setIsModalOpen(true); };
//     const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };

//     const confirmDelete = async () => {
//         try {
//             await apiFetch(`/users/${itemToDelete}`, { method: 'DELETE' });
//             toast.success('User deleted successfully!');
//             fetchUsers(currentPage);
//         } catch (error) {
//             console.error('Failed to delete user', error);
//             toast.error(error.message || 'Failed to delete user.');
//         }
//         finally { setConfirmOpen(false); setItemToDelete(null); }
//     };

//     const handleSave = async (formData) => {
//         try {
//             if (editingUser) {
//                 await apiFetch(`/users/${editingUser._id}`, { method: 'PUT', body: JSON.stringify(formData) });
//                 toast.success('User updated successfully!');
//             } else {
//                 await apiFetch('/users/create', { method: 'POST', body: JSON.stringify(formData) });
//                 toast.success('User created successfully!');
//             }
//             fetchUsers(currentPage);
//             closeModal();
//         } catch (error) {
//             console.error('Failed to save user', error);
//             toast.error(error.message || 'Failed to save user.');
//         }
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const closeModal = () => { setIsModalOpen(false); setEditingUser(null); };

//     return (
//         <div className="space-y-6 flex flex-col flex-grow">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
//                 <Button onClick={handleAddNew}><Plus size={20} />Add New User</Button>
//             </div>
//             <Card className="flex flex-col flex-grow">
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="relative w-full md:w-auto">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                         <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                     </div>
//                 </div>
//                 <div className="overflow-x-auto flex-grow">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined On</th><th className="p-3">Role</th><th className="p-3 text-center">Actions</th></tr></thead>
//                         <tbody>
//                             {users.length > 0 ? users.map(user => (
//                                 <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                     <td className="p-3 font-medium text-gray-900 dark:text-white">{user.fullName}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td><td className="p-3 text-gray-600 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td><td className="p-3 text-gray-600 dark:text-gray-300 capitalize">{user.role}</td>
//                                     <td className="p-3 text-center"><div className="flex justify-center items-center gap-2"><button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"><Edit size={18} /></button><button onClick={() => handleDeleteClick(user._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button></div></td>
//                                 </tr>
//                             )) : (<tr><td colSpan="5" className="text-center py-10 text-gray-500">No users found.</td></tr>)}
//                         </tbody>
//                     </table>
//                 </div>
//                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//             </Card>
//             <UserFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} user={editingUser} />
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete User" message="Are you sure you want to delete this user? This will permanently remove their data." />
//         </div>
//     );
// };

// const ServicesPage = () => {
//     const [services, setServices] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingService, setEditingService] = useState(null);
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const ITEMS_PER_PAGE = 6;

//     const fetchServices = async (page) => {
//         try {
//             const response = await apiFetch(`/services?page=${page}&limit=${ITEMS_PER_PAGE}`);
//             const data = await response.json();
//             setServices(data.data || []);
//             setTotalPages(data.totalPages || 0);
//         } catch (error) {
//             console.error('Failed to fetch services', error);
//             setServices([]);
//             setTotalPages(0);
//             toast.error(error.message || 'Failed to fetch services.');
//         }
//     };

//     useEffect(() => {
//         fetchServices(currentPage);
//     }, [currentPage]);

//     const handleAddNew = () => { setEditingService(null); setIsModalOpen(true); };
//     const handleEdit = (service) => { setEditingService(service); setIsModalOpen(true); };
//     const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };

//     const confirmDelete = async () => {
//         try {
//             await apiFetch(`/services/${itemToDelete}`, { method: 'DELETE' });
//             toast.success('Service deleted successfully!');
//             fetchServices(currentPage);
//         } catch (error) {
//             console.error('Failed to delete service', error);
//             toast.error(error.message || 'Failed to delete service.');
//         }
//         finally { setConfirmOpen(false); setItemToDelete(null); }
//     };

//     const handleSave = async (serviceData) => {
//         try {
//             const url = editingService ? `/services/${editingService._id}` : '/services';
//             const method = editingService ? 'PUT' : 'POST';
//             await apiFetch(url, { method, body: JSON.stringify(serviceData) });

//             toast.success(editingService ? 'Service updated successfully!' : 'Service added successfully!');
//             fetchServices(currentPage);
//             closeModal();
//         } catch (error) {
//             console.error('Failed to save service', error);
//             toast.error(error.message || 'Failed to save service.');
//         }
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const closeModal = () => { setIsModalOpen(false); setEditingService(null); }

//     return (
//         <div className="space-y-6 flex flex-col flex-grow">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Services Management</h1>
//                 <Button onClick={handleAddNew}><Plus size={20} />Add New Service</Button>
//             </div>
//             <Card className="flex flex-col flex-grow">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
//                     {services.length > 0 ? services.map(service => (
//                         <div key={service._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
//                             <div className="p-6 flex-grow">
//                                 <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{service.name}</h3>
//                                 <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">{service.description}</p>
//                             </div>
//                             <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                                 <div>
//                                     <p className="text-lg font-semibold text-gray-800 dark:text-white">रु{service.price}</p>
//                                     <p className="text-sm text-gray-500 dark:text-gray-400">{service.duration}</p>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Edit size={18} /></button>
//                                     <button onClick={() => handleDeleteClick(service._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Trash2 size={18} /></button>
//                                 </div>
//                             </div>
//                         </div>
//                     )) : (<div className="col-span-full text-center py-10 text-gray-500">No services found.</div>)}
//                 </div>
//                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//             </Card>

//             <ServiceFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} service={editingService} />
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Service" message="Are you sure you want to delete this service? This action is permanent." />
//         </div>
//     );
// };
// const ProfilePage = ({ currentUser, setCurrentUser }) => {
//     const [profile, setProfile] = useState(currentUser);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//     const fileInputRef = useRef(null);

//     useEffect(() => { setProfile(currentUser); }, [currentUser]);

//     const handleChange = (e) => { setProfile({ ...profile, [e.target.name]: e.target.value }); }
//     const handleFileChange = (e) => { const file = e.target.files[0]; if (file) { setProfile(p => ({ ...p, profilePictureUrl: URL.createObjectURL(file), newProfilePicture: file })); } };
//     const handleUploadClick = () => { fileInputRef.current.click(); };

//     const handleFetchLocation = () => {
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
//                     const data = await response.json();
//                     const address = data.display_name;
//                     if (address) {
//                         setProfile(p => ({ ...p, address: address }));
//                         toast.success("Location fetched and address updated!");
//                     } else {
//                         toast.error("Could not determine address from your location.");
//                     }
//                 } catch (error) {
//                     console.error("Reverse geocoding failed:", error);
//                     toast.error("Failed to fetch address. Please enter manually.");
//                 } finally {
//                     setIsFetchingLocation(false);
//                 }
//             },
//             (error) => {
//                 console.error("Geolocation error:", error);
//                 let errorMessage = "An unknown geolocation error occurred.";
//                 if (error.code === error.PERMISSION_DENIED) {
//                     errorMessage = "Location access denied. Please enable it in your browser settings.";
//                 } else if (error.code === error.POSITION_UNAVAILABLE) {
//                     errorMessage = "Location information is currently unavailable.";
//                 } else if (error.code === error.TIMEOUT) {
//                     errorMessage = "Request for location timed out.";
//                 }
//                 toast.error(errorMessage);
//                 setIsFetchingLocation(false);
//             }
//         );
//     };

//     const handleSave = async () => {
//         const formData = new FormData();
//         Object.keys(profile).forEach(key => { if (key !== 'newProfilePicture' && key !== 'profilePictureUrl' && key !== 'profilePicture' && profile[key] !== null) { formData.append(key, profile[key]); } });
//         if (profile.newProfilePicture) { formData.append('profilePicture', profile.newProfilePicture); }

//         try {
//             const response = await apiFetch('/profile', { method: 'PUT', body: formData });
//             const data = await response.json();
//             setCurrentUser(data.data);
//             setProfile(data.data);
//             setIsEditing(false);
//             toast.success('Profile updated successfully!');
//         } catch (error) { console.error('Failed to save profile', error); toast.error(error.message || 'Failed to save profile.'); }
//     };

//     const handleCancel = () => { setProfile(currentUser); setIsEditing(false); }
//     const handleImageError = (e) => { e.target.onerror = null; e.target.src = `https://placehold.co/128x128/e2e8f0/4a5568?text=A`; }
//     const profilePictureSrc = profile.profilePictureUrl || (profile.profilePicture ? `http://localhost:5050/${profile.profilePicture}` : `https://placehold.co/128x128/e2e8f0/4a5568?text=A`);

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workshop Profile</h1>
//             <Card><div className="p-6"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-start"><h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Information</h2>{!isEditing && (<Button onClick={() => setIsEditing(true)}><Edit size={16} />Edit Profile</Button>)}</div><div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
//                 <div className="lg:col-span-1 flex flex-col items-center"><img key={profilePictureSrc} src={profilePictureSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} />{isEditing && (<div className="w-full space-y-2"><input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Button variant="secondary" className="w-full" onClick={handleUploadClick}><Camera size={16} /> Change Picture</Button></div>)}</div>
//                 <div className="lg:col-span-2 space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Input id="workshopName" label="Workshop Name" name="workshopName" value={profile.workshopName || ''} onChange={handleChange} disabled={!isEditing} /><Input id="ownerName" label="Owner Name" name="ownerName" value={profile.ownerName || ''} onChange={handleChange} disabled={!isEditing} /><Input id="email" label="Email Address" name="email" type="email" value={profile.email || ''} onChange={handleChange} disabled={!isEditing} /><Input id="phone" label="Phone Number" name="phone" value={profile.phone || ''} onChange={handleChange} disabled={!isEditing} /></div>
//                     <div>
//                         <div className="flex justify-between items-center mb-1">
//                             <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
//                             {isEditing && (
//                                 <Button
//                                     variant="secondary"
//                                     onClick={handleFetchLocation}
//                                     disabled={isFetchingLocation}
//                                     className="text-xs py-1 px-2 !gap-1.5"
//                                 >
//                                     {isFetchingLocation ? 'Fetching...' : <><MapPin size={14} /> Fetch Location</>}
//                                 </Button>
//                             )}
//                         </div>
//                         <textarea id="address" name="address" rows="3" value={profile.address || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-700/50 dark:text-white" placeholder="Enter workshop address or fetch current location"></textarea>
//                     </div>
//                     {isEditing && (<div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={handleCancel}>Cancel</Button><Button onClick={handleSave}>Save Changes</Button></div>)}
//                 </div>
//             </div></div></Card>
//         </div>
//     );
// };
// const BookingFormModal = ({ isOpen, onClose, booking, onSave }) => {
//     const [formData, setFormData] = useState({});
//     useEffect(() => { if (booking) { setFormData({ status: booking.status, totalCost: booking.totalCost }); } }, [booking, isOpen]);
//     const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
//     const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
//     return (<Modal isOpen={isOpen} onClose={onClose} title={`Edit Booking`}><form onSubmit={handleSubmit} className="space-y-4">{booking && <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"><p className="text-sm"><strong className="dark:text-gray-300">Customer:</strong> {booking.customer?.fullName}</p><p className="text-sm"><strong className="dark:text-gray-300">Service:</strong> {booking.serviceType}</p><p className="text-sm"><strong className="dark:text-gray-300">Bike:</strong> {booking.bikeModel}</p></div>}<div><label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label><select id="status" name="status" value={formData.status || ''} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div><Input id="totalCost" label="Total Cost (रु)" name="totalCost" type="number" value={formData.totalCost || ''} onChange={handleChange} /><div className="flex justify-end gap-3 pt-4"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save Changes</Button></div></form></Modal>);
// };
// const ServiceFormModal = ({ isOpen, onClose, onSave, service }) => {
//     const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '' });
//     useEffect(() => { if (service) { setFormData(service); } else { setFormData({ name: '', description: '', price: '', duration: '' }); } }, [service, isOpen]);
//     const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }
//     const handleSubmit = (e) => { e.preventDefault(); onSave(formData); }
//     return (<Modal isOpen={isOpen} onClose={onClose} title={service ? 'Edit Service' : 'Add New Service'}><form onSubmit={handleSubmit} className="space-y-4"><Input id="name" name="name" label="Service Name" value={formData.name || ''} onChange={handleChange} required /><div><label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"></textarea></div><Input id="price" name="price" label="Price (रु)" type="number" value={formData.price || ''} onChange={handleChange} required /><Input id="duration" name="duration" label="Duration (e.g., 2 hours)" value={formData.duration || ''} onChange={handleChange} required /><div className="flex justify-end gap-3 pt-4"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">{service ? 'Save Changes' : 'Add Service'}</Button></div></form></Modal>)
// }
// const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
//     const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'user' });
//     useEffect(() => { if (user) { setFormData({ fullName: user.fullName, email: user.email, role: user.role, password: '' }); } else { setFormData({ fullName: '', email: '', password: '', role: 'user' }); } }, [user, isOpen]);
//     const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }
//     const handleSubmit = (e) => { e.preventDefault(); const dataToSave = { ...formData }; if (user && !dataToSave.password) { delete dataToSave.password; } onSave(dataToSave); }
//     return (<Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Add New User'}><form onSubmit={handleSubmit} className="space-y-4"><Input id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required /><Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required /><Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} placeholder={user ? "Leave blank to keep current" : ""} required={!user} /><div><label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label><select id="role" name="role" value={formData.role || 'user'} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"><option value="user">User</option><option value="admin">Admin</option></select></div><div className="flex justify-end gap-3 pt-4"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">{user ? 'Save Changes' : 'Add User'}</Button></div></form></Modal>)
// }

// const NavLink = ({ page, icon: Icon, children, activePage, onLinkClick, badgeCount }) => {
//     const isActive = activePage === page;
//     return (
//         <a href={`#/admin/${page}`} onClick={onLinkClick} className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
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

// const SidebarContent = ({ activePage, onLinkClick, onLogoutClick, onMenuClose, totalUnreadCount }) => (
//     <>
//         <div className="p-4 flex items-center justify-between">
//             <a href="#/admin/dashboard" onClick={onLinkClick} className="flex items-center gap-3 cursor-pointer">
//                 <img src="/motofix-removebg-preview.png" alt="MotoFix Logo" className="h-20 w-auto" />
//             </a>
//             {onMenuClose && (<button onClick={onMenuClose} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>)}
//         </div>

//         <nav className="flex-1 px-4 py-6 space-y-2">
//             <NavLink page="dashboard" icon={BarChart} activePage={activePage} onLinkClick={onLinkClick}>Dashboard</NavLink>
//             <NavLink page="bookings" icon={List} activePage={activePage} onLinkClick={onLinkClick}>Bookings</NavLink>
//             <NavLink page="users" icon={Users} activePage={activePage} onLinkClick={onLinkClick}>Users</NavLink>
//             <NavLink page="services" icon={Wrench} activePage={activePage} onLinkClick={onLinkClick}>Services</NavLink>
//             <NavLink page="profile" icon={User} activePage={activePage} onLinkClick={onLinkClick}>Profile</NavLink>
//             <NavLink page="chat" icon={MessageSquare} activePage={activePage} onLinkClick={onLinkClick} badgeCount={totalUnreadCount}>Chat</NavLink>
//         </nav>

//         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//             <button
//                 onClick={onLogoutClick}
//                 className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800"
//             >
//                 <LogOut size={22} />
//                 <span className="text-md">Logout</span>
//             </button>
//         </div>

//     </>
// );

// const AdminDashboard = () => {
//     const [activePage, setActivePage] = useState(() => (window.location.hash.replace('#/admin/', '').split('/')[0] || 'dashboard'));
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState({ ownerName: 'Admin', workshopName: '' });
//     const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('adminTheme') === 'dark');
//     const [totalUnreadCount, setTotalUnreadCount] = useState(0);

//     const handleLogoutConfirm = () => { localStorage.clear(); window.location.href = '/'; };

//     useEffect(() => {
//         const fetchInitialCount = async () => {
//             try {
//                 const response = await apiFetch('/chat/users');
//                 const data = await response.json();
//                 const unreadConversations = data.data.filter(c => c.unreadCount > 0);
//                 setTotalUnreadCount(unreadConversations.length);
//             } catch (error) {
//                 console.error("Could not fetch initial unread count", error);
//             }
//         };
//         fetchInitialCount();

//         const notificationListener = () => { fetchInitialCount(); };
//         const readListener = () => { fetchInitialCount(); };

//         socket.on('new_message_notification', notificationListener);
//         socket.on('messages_read_by_admin', readListener);

//         return () => {
//             socket.off('new_message_notification', notificationListener);
//             socket.off('messages_read_by_admin', readListener);
//         };
//     }, []);

//     useEffect(() => {
//         document.title = totalUnreadCount > 0 ? `(${totalUnreadCount}) MotoFix Admin` : 'MotoFix Admin';
//     }, [totalUnreadCount]);


//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await apiFetch('/profile');
//                 const data = await response.json();
//                 setCurrentUser(data.data || { ownerName: 'Admin' });
//             } catch (error) {
//                 console.error("Failed to fetch admin profile", error);
//                 if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) { handleLogoutConfirm(); }
//             }
//         };
//         fetchProfile();
//     }, []);

//     useEffect(() => {
//         document.documentElement.classList.toggle('dark', isDarkMode);
//         localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');
//     }, [isDarkMode]);

//     useEffect(() => {
//         const handleHashChange = () => {
//             const page = window.location.hash.replace('#/admin/', '').split('/')[0] || 'dashboard';
//             setActivePage(page);
//         };
//         window.addEventListener('hashchange', handleHashChange);
//         handleHashChange();
//         return () => window.removeEventListener('hashchange', handleHashChange);
//     }, []);

//     const renderPage = () => {
//         const hash = window.location.hash.replace('#/admin/', '');
//         const [page, id] = hash.split('/');

//         switch (page) {
//             case 'dashboard': return <DashboardPage />;
//             case 'bookings':
//                 if (id) { return <BookingDetailsPage bookingId={id} />; }
//                 return <BookingsPage />;
//             case 'users': return <UsersPage />;
//             case 'services': return <ServicesPage />;
//             case 'profile': return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
//             case 'chat': return <AdminChatPage />;
//             default:
//                 window.location.hash = '#/admin/dashboard';
//                 return <DashboardPage />;
//         }
//     };

//     const handleImageError = (e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/e2e8f0/4a5568?text=A`; }
//     const profilePictureSrc = currentUser.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://placehold.co/40x40/e2e8f0/4a5568?text=A`;

//     return (
//         <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
//             <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col"><SidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} totalUnreadCount={totalUnreadCount} /></div><div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div></div>
//             <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0"><SidebarContent activePage={activePage} onLinkClick={() => { }} onLogoutClick={() => setLogoutConfirmOpen(true)} totalUnreadCount={totalUnreadCount} /></aside>
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"><button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button><div className="hidden lg:block" /><div className="flex items-center gap-4"><button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button><div className="flex items-center gap-3"><img key={profilePictureSrc} src={profilePictureSrc} alt="Admin" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} /><div><p className="font-semibold text-sm">{currentUser.ownerName}</p><p className="text-xs text-gray-500 dark:text-gray-400">Workshop Owner</p></div></div></div></header>
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8 flex flex-col">
//                     {renderPage()}
//                 </main>
//             </div>
//             <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} onConfirm={handleLogoutConfirm} title="Confirm Logout" message="Are you sure you want to logout?" confirmText="Logout" confirmButtonVariant="danger" Icon={LogOut} />
            
//             {/* --- AI CHATBOT INTEGRATION --- */}
//             <GeminiChatbot />
//         </div>
//     );
// };

// export default AdminDashboard;








import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Edit, Trash2, Search, Users, Wrench, DollarSign, List, User, LogOut, Menu, X, Sun, Moon, Camera, AlertTriangle, ArrowLeft, MapPin, ChevronLeft, ChevronRight, MessageSquare, Send, Inbox, Paperclip, FileText, XCircle, Star, MessageCircle as ReviewIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const API_BASE_URL = "http://localhost:5050/api/admin";
const socket = io.connect("http://localhost:5050");

// API fetch utility
const apiFetch = async (endpoint, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
    };
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred with the API request.');
    }
    return response;
};

// --- START: Helper & Shared Components ---

// StarRating Helper Component
const StarRating = ({ rating = 0 }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((index) => (
                <Star
                    key={index}
                    size={16}
                    className={`transition-colors duration-200 ${
                        rating >= index
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                    }`}
                />
            ))}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};
const Card = ({ children, className = '', ...props }) => (<div {...props} className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${className}`}>{children}</div>);
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};
const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    return (<button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
};
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmButtonVariant = 'danger', Icon = AlertTriangle, iconColor = 'text-red-600 dark:text-red-400', iconBgColor = 'bg-red-100 dark:bg-red-900/50' }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                <div className="mt-2 px-7 py-3"><p className="text-sm text-gray-500 dark:text-gray-400">{message}</p></div>
                <div className="flex justify-center gap-3 mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant={confirmButtonVariant} onClick={onConfirm}>{confirmText}</Button>
                </div>
            </div>
        </Modal>
    );
};
const Input = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed" />
    </div>
);
const StatusBadge = ({ status }) => (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>{status}</span>);
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="!px-3 !py-1.5 text-sm">
                <ChevronLeft size={16} /> Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">Page {totalPages > 0 ? currentPage : 0} of {totalPages > 0 ? totalPages : 0}</span>
            <Button variant="secondary" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="!px-3 !py-1.5 text-sm">
                Next <ChevronRight size={16} />
            </Button>
        </div>
    );
};
// --- END: Helper & Shared Components ---


// --- START: Page Specific Components ---

// NEW COMPONENT - ReviewsModal
const ReviewsModal = ({ isOpen, onClose, serviceId }) => {
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && serviceId) {
            const fetchReviews = async () => {
                setIsLoading(true);
                try {
                    const response = await apiFetch(`/services/${serviceId}/reviews`);
                    const data = await response.json();
                    setService(data.data);
                } catch (error) {
                    toast.error("Failed to fetch reviews.");
                    onClose();
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReviews();
        }
    }, [isOpen, serviceId]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Reviews for "${service?.name || ''}"`}>
            {isLoading ? (
                <div className="text-center p-8">Loading reviews...</div>
            ) : !service || service.reviews.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                    <ReviewIcon size={48} className="mx-auto text-gray-400" />
                    <p className="mt-4">No reviews have been submitted for this service yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {service.reviews.slice().reverse().map((review) => (
                        <div key={review._id} className="flex gap-4 border-b dark:border-gray-700 pb-4 last:pb-0 last:border-b-0">
                            <div className="flex-shrink-0">
                                {review.user && review.user.profilePicture ? (
                                    <img
                                        src={`http://localhost:5050/${review.user.profilePicture}`}
                                        alt={review.user.fullName}
                                        className="w-10 h-10 rounded-full object-cover bg-gray-200"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-lg text-indigo-600 dark:text-indigo-300">
                                        {(review.user?.fullName || review.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-800 dark:text-white">{review.user?.fullName || review.username}</h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="my-1"><StarRating rating={review.rating} /></div>
                                <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

const AdminChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToClear, setItemToClear] = useState(null);
    const chatBodyRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    
    const fetchConversations = async () => {
        try {
            const response = await apiFetch('/chat/users');
            const data = await response.json();
            const sortedData = (data.data || []).sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
            setConversations(sortedData);
        } catch (error) { toast.error('Failed to fetch chat conversations.'); }
    };

    useEffect(() => { fetchConversations(); }, []);

    useEffect(() => {
        const newMessageListener = (data) => {
            const roomUserId = data.room.replace('chat-', '');
            const isChatActive = activeConversation?._id === roomUserId;
            const isFromAdmin = data.authorId === 'admin_user';

            if (isChatActive) {
                setMessages((prev) => [...prev, data]);
            }

            setConversations(prevConvos => {
                let convoExists = false;
                const updatedConvos = prevConvos.map(convo => {
                    if (convo._id === roomUserId) {
                        convoExists = true;
                        return { 
                            ...convo, 
                            lastMessage: isFromAdmin 
                                ? convo.lastMessage 
                                : (data.message || `Sent a ${data.fileType ? data.fileType.split('/')[0] : 'file'}`),
                            lastMessageTimestamp: data.createdAt, 
                            unreadCount: !isChatActive && !isFromAdmin ? (convo.unreadCount || 0) + 1 : convo.unreadCount
                        };
                    }
                    return convo;
                });

                if (!convoExists) {
                    fetchConversations();
                    return prevConvos;
                }
                
                updatedConvos.sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
                return updatedConvos;
            });
        };

        const messagesReadListener = (data) => {
            const roomUserId = data.room.replace('chat-', '');
            setConversations(prevConvos => prevConvos.map(convo => convo._id === roomUserId ? { ...convo, unreadCount: 0 } : convo));
        };

        socket.on('receive_message', newMessageListener);
        socket.on('messages_read_by_admin', messagesReadListener);
        return () => {
            socket.off('receive_message', newMessageListener);
            socket.off('messages_read_by_admin', messagesReadListener);
        };
    }, [activeConversation]);

    useEffect(() => {
        if (activeConversation) {
            const roomName = `chat-${activeConversation._id}`;
            const historyListener = (history) => {
                const firstMsgRoom = history.length > 0 ? history[0].room : `chat-${activeConversation._id}`;
                if (firstMsgRoom === roomName) {
                    setMessages(history);
                }
            };
            socket.on('chat_history', historyListener);
            socket.emit('join_room', { roomName: `chat-${activeConversation._id}`, userId: 'admin_user' });
            return () => { socket.off('chat_history', historyListener); };
        }
    }, [activeConversation]);

    useEffect(() => {
        if (chatBodyRef.current) { chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; }
    }, [messages]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) { setPreviewUrl(URL.createObjectURL(file)); } else { setPreviewUrl(null); }
        }
        event.target.value = null;
    };
    
    const handleRemovePreview = () => { setSelectedFile(null); setPreviewUrl(null); };

    const handleSendMessage = async () => {
        if (!activeConversation || (currentMessage.trim() === '' && !selectedFile)) return;
        if (selectedFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('room', `chat-${activeConversation._id}`);
            formData.append('author', 'Admin');
            formData.append('authorId', 'admin_user');
            if (currentMessage.trim() !== '') { formData.append('message', currentMessage); }
            try { await apiFetch('/chat/upload', { method: 'POST', body: formData }); }
            catch (error) { toast.error(`File upload failed: ${error.message}`); }
            finally { setIsUploading(false); handleRemovePreview(); setCurrentMessage(''); }
        } else {
            const messageData = { room: `chat-${activeConversation._id}`, author: 'Admin', authorId: 'admin_user', message: currentMessage, createdAt: new Date().toISOString() };
            socket.emit('send_message', messageData);
            setMessages(prev => [...prev, messageData]);
            setCurrentMessage('');
        }
    };

    const handleSelectConversation = (user) => {
        if (activeConversation?._id !== user._id) {
            setMessages([]);
            setActiveConversation(user);
            handleRemovePreview();
        }
    };
    
    const handleClearClick = (user) => { setItemToClear(user); setConfirmOpen(true); };

    const confirmClearChat = async () => {
        if (!itemToClear) return;
        try {
            await apiFetch(`/chat/clear/${itemToClear._id}`, { method: 'PUT' });
            toast.success(`Chat history with ${itemToClear.fullName} has been cleared from your view.`);
            if (activeConversation?._id === itemToClear._id) {
                setActiveConversation(null);
                setMessages([]);
            }
            fetchConversations();
        } catch (error) { toast.error(error.message || 'Failed to clear chat history.'); }
        finally { setConfirmOpen(false); setItemToClear(null); }
    };

    const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(e.target.dataset.name || 'U')}&background=e2e8f0&color=4a5568&size=40`; };
    
    const renderFileContent = (msg) => {
        if (msg.fileType?.startsWith('image/')) { return (<a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block"><img src={msg.fileUrl} alt={msg.fileName || 'Sent Image'} className="max-w-xs rounded-lg mt-1" /></a>); }
        return (<a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download={msg.fileName} className="flex items-center gap-3 bg-black/10 dark:bg-white/10 p-3 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors mt-1"><FileText size={32} className="flex-shrink-0" /><span className="truncate font-medium">{msg.fileName || 'Download File'}</span></a>);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Chats</h1>
            <Card className="p-0 flex" style={{ height: 'calc(80vh - 2rem)' }}>
                <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto">
                    <div className="p-4 border-b dark:border-gray-600"><h2 className="font-semibold text-lg">Conversations</h2></div>
                    <ul className="divide-y dark:divide-gray-700">
                        {conversations.map(user => (
                            <li key={user._id} className={`flex items-center gap-3 relative transition-colors group ${activeConversation?._id === user._id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                <div onClick={() => handleSelectConversation(user)} className="p-4 flex-grow flex items-center gap-3 cursor-pointer">
                                    <img src={user.profilePicture ? `http://localhost:5050/${user.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'U')}&background=0D8ABC&color=fff&size=40`} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" data-name={user.fullName} onError={handleImageError} />
                                    <div className="flex-grow overflow-hidden">
                                        <p className={`truncate ${user.unreadCount > 0 ? 'font-bold' : 'font-semibold'}`}>{user.fullName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.lastMessage}</p>
                                    </div>
                                    {user.unreadCount > 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{user.unreadCount}</span>}
                                </div>
                                <div className="pr-2">
                                    <button onClick={() => handleClearClick(user)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title={`Clear chat with ${user.fullName}`}><Trash2 size={18} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-2/3 flex flex-col bg-white dark:bg-gray-900/50">
                    {activeConversation ? (
                        <>
                            <div className="p-3 border-b dark:border-gray-700 flex items-center gap-3 shadow-sm">
                                <img src={activeConversation.profilePicture ? `http://localhost:5050/${activeConversation.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.fullName || 'U')}&background=0D8ABC&color=fff&size=40`} alt={activeConversation.fullName} className="w-10 h-10 rounded-full object-cover" data-name={activeConversation.fullName} onError={handleImageError} />
                                <div><h3 className="font-semibold">{activeConversation.fullName}</h3><p className="text-sm text-gray-500">{activeConversation.email}</p></div>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 space-y-1" ref={chatBodyRef}>
                                {messages.map((msg, index) => {
                                    const isAdmin = msg.authorId === 'admin_user';
                                    const prevMsg = messages[index - 1]; const nextMsg = messages[index + 1];
                                    const isFirstInGroup = !prevMsg || prevMsg.authorId !== msg.authorId;
                                    const isLastInGroup = !nextMsg || nextMsg.authorId !== msg.authorId;
                                    return (
                                        <div key={msg._id || index} className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            {!isAdmin && (<div className="w-8 flex-shrink-0 self-end">{isLastInGroup && <img src={activeConversation.profilePicture ? `http://localhost:5050/${activeConversation.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.fullName || 'U')}&background=e2e8f0&color=4a5568&size=40`} alt="p" className="w-7 h-7 rounded-full object-cover" />}</div>)}
                                            <div className={`py-2 px-3 max-w-md ${isAdmin ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : ''} ${isAdmin ? `${isFirstInGroup ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-l-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-l-2xl rounded-r-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tr-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-br-md' : ''}` : `${isFirstInGroup ? 'rounded-t-2xl rounded-br-2xl' : 'rounded-r-2xl'} ${isLastInGroup ? 'rounded-b-2xl' : ''} ${!isFirstInGroup && !isLastInGroup ? 'rounded-r-2xl rounded-l-md' : ''} ${isFirstInGroup && !isLastInGroup ? 'rounded-tl-md' : ''} ${!isFirstInGroup && isLastInGroup ? 'rounded-bl-md' : ''}`}`}>
                                                {msg.fileUrl && renderFileContent(msg)}
                                                {msg.message && <p className="text-md" style={{ overflowWrap: 'break-word' }}>{msg.message}</p>}
                                                <p className={`text-xs text-right mt-1 opacity-70`}>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                                {(previewUrl || selectedFile) && (<div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">{previewUrl ? <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" /> : <div className="flex items-center gap-2 text-gray-500"><FileText /><span>{selectedFile.name}</span></div>}<button onClick={handleRemovePreview} className="text-gray-500 hover:text-red-500"><XCircle size={20} /></button></div>)}
                                <div className="flex items-center gap-3">
                                    <div className="flex">
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" /><input type="file" ref={cameraInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
                                        <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Paperclip size={22} /></button><button onClick={() => cameraInputRef.current.click()} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><Camera size={22} /></button>
                                    </div>
                                    <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && !isUploading && handleSendMessage()} placeholder="Message..." className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-full focus:ring-blue-500 focus:border-blue-500 transition" disabled={isUploading} />
                                    <Button onClick={handleSendMessage} disabled={isUploading || (!currentMessage.trim() && !selectedFile)} className="!rounded-full !w-12 !h-12 !p-0">{isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}</Button>
                                </div>
                            </div>
                        </>
                    ) : (<div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400"><Inbox size={64} /><p className="mt-4 text-lg">Select a conversation to start chatting</p></div>)}
                </div>
            </Card>
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmClearChat} title="Clear Chat History" message={`Are you sure you want to clear your view of the chat history with ${itemToClear?.fullName}? This will not affect the user's view.`} confirmText="Clear" />
        </div>
    );
};

const DashboardPage = () => {
    const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalBookings: 0, newUsers: 0, revenueData: [], servicesData: [] });
    const [recentBookings, setRecentBookings] = useState([]);
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await apiFetch('/dashboard');
                const data = await response.json();
                const d = data.data || {};
                const formattedRevenue = (d.revenueData || []).map(item => ({ name: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }), revenue: item.revenue }));
                const formattedServices = (d.servicesData || []).map(item => ({ name: item._id, bookings: item.bookings }));
                setAnalytics({ totalRevenue: d.totalRevenue || 0, totalBookings: d.totalBookings || 0, newUsers: d.newUsers || 0, revenueData: formattedRevenue, servicesData: formattedServices });
                setRecentBookings(d.recentBookings || []);
            } catch (error) { toast.error(error.message || "Failed to fetch dashboard data."); }
        };
        fetchDashboardData();
    }, []);
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card><div className="flex items-center gap-4"><div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><DollarSign className="text-blue-600 dark:text-blue-300" size={28} /></div><div><p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p><p className="text-2xl font-bold text-gray-800 dark:text-white">रु{analytics.totalRevenue.toLocaleString()}</p></div></div></Card>
                <Card><div className="flex items-center gap-4"><div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><List className="text-green-600 dark:text-green-300" size={28} /></div><div><p className="text-gray-500 dark:text-gray-400 text-sm">Total Bookings</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.totalBookings}</p></div></div></Card>
                <Card><div className="flex items-center gap-4"><div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full"><Users className="text-indigo-600 dark:text-indigo-300" size={28} /></div><div><p className="text-gray-500 dark:text-gray-400 text-sm">New Users This Month</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.newUsers}</p></div></div></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card><h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Overview</h2><ResponsiveContainer width="100%" height={300}><LineChart data={analytics.revenueData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></Card>
                <Card><h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Popular Services</h2><ResponsiveContainer width="100%" height={300}><BarChart data={analytics.servicesData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" angle={0} textAnchor="end" height={50} stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Bar dataKey="bookings" fill="#10b981" /></BarChart></ResponsiveContainer></Card>
            </div>
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Bookings</h2>
                <div className="overflow-x-auto"><table className="w-full text-left"><thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700"><tr><th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3 text-right">Cost</th></tr></thead><tbody>
                    {recentBookings.length > 0 ? recentBookings.map(booking => (<tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="p-3 font-medium text-gray-900 dark:text-white"><a href={`#/admin/bookings/${booking._id}`} className="hover:underline">{booking.customer?.fullName || 'N/A'}</a></td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType || 'N/A'}</td>
                        <td className="p-3"><StatusBadge status={booking.status} /></td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="p-3 text-right font-medium text-gray-900 dark:text-white">रु{booking.totalCost}</td>
                    </tr>)) : (<tr><td colSpan="5" className="text-center py-8 text-gray-500">No recent bookings found.</td></tr>)}
                </tbody></table></div>
            </Card>
        </div>
    );
};
const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const ITEMS_PER_PAGE = 11;
    const fetchBookings = async (page) => {
        try {
            const response = await apiFetch(`/bookings?page=${page}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
            const data = await response.json();
            setBookings(data.data || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) { toast.error(error.message || 'Failed to fetch bookings.'); setBookings([]); setTotalPages(0); }
    };
    useEffect(() => { fetchBookings(currentPage); }, [currentPage, searchTerm]);
    const handleEdit = (booking) => { setEditingBooking(booking); setIsModalOpen(true); };
    const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await apiFetch(`/bookings/${itemToDelete}`, { method: 'DELETE' });
            toast.success('Booking deleted successfully!');
            fetchBookings(currentPage);
        } catch (error) { toast.error(error.message || 'Failed to delete booking.'); }
        finally { setConfirmOpen(false); setItemToDelete(null); }
    };
    const handleSave = async (formData) => {
        if (!editingBooking) return;
        try {
            const response = await apiFetch(`/bookings/${editingBooking._id}`, { method: 'PUT', body: JSON.stringify(formData) });
            const data = await response.json();
            setBookings(bookings.map(b => b._id === editingBooking._id ? data.data : b));
            toast.success(data.message || 'Booking updated successfully!');
            closeModal();
        } catch (error) { toast.error(error.message || 'Failed to save booking.'); }
    };
    const handlePageChange = (newPage) => { if (newPage > 0 && newPage <= totalPages) { setCurrentPage(newPage); } };
    const closeModal = () => { setIsModalOpen(false); setEditingBooking(null); };
    return (
        <div className="space-y-6 flex flex-col flex-grow">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bookings Management</h1>
            <Card className="flex flex-col flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700"><tr><th className="p-3">Customer</th><th className="p-3">Vehicle</th><th className="p-3">Service</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th><th className="p-3 text-center">Actions</th></tr></thead>
                        <tbody>
                            {bookings.length > 0 ? bookings.map(booking => (
                                <tr key={booking._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.customer?.fullName || 'N/A'}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel || 'N/A'}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType || 'N/A'}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="p-3"><StatusBadge status={booking.status} /></td>
                                    <td className="p-3 text-right font-medium">रु{booking.totalCost}</td>
                                    <td className="p-3 text-center"><div className="flex justify-center items-center gap-2"><a href={`#/admin/bookings/${booking._id}`} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1" title="View Details"><Search size={18} /></a><button onClick={() => handleEdit(booking)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1" title="Edit Booking"><Edit size={18} /></button><button onClick={() => handleDeleteClick(booking._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1" title="Delete Booking"><Trash2 size={18} /></button></div></td>
                                </tr>
                            )) : (<tr><td colSpan="7" className="text-center py-10 text-gray-500">No bookings found.</td></tr>)}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </Card>
            <BookingFormModal isOpen={isModalOpen} onClose={closeModal} booking={editingBooking} onSave={handleSave} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Booking" message="Are you sure you want to delete this booking? This action cannot be undone." />
        </div>
    );
};
const BookingDetailsPage = ({ bookingId }) => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            try {
                const response = await apiFetch(`/bookings/${bookingId}`);
                const data = await response.json();
                setBooking(data.data);
            } catch (err) { setError(err.message); toast.error(err.message || 'Failed to fetch booking details.'); }
            finally { setLoading(false); }
        };
        if (bookingId) { fetchBooking(); }
    }, [bookingId]);
    if (loading) return <div className="text-center py-10">Loading booking details...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!booking) return <div className="text-center py-10">Booking not found.</div>;
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4"><a href="#/admin/bookings" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowLeft size={22} /></a><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Booking Details</h1></div>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div><h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">Customer Information</h2><div className="space-y-2 mt-4 text-gray-600 dark:text-gray-400"><p><strong>Name:</strong> {booking.customer?.fullName || 'N/A'}</p><p><strong>Email:</strong> {booking.customer?.email || 'N/A'}</p><p><strong>Phone:</strong> {booking.customer?.phone || 'N/A'}</p><p><strong>Address:</strong> {booking.customer?.address || 'N/A'}</p></div></div>
                    <div><h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">Booking Information</h2><div className="space-y-2 mt-4 text-gray-600 dark:text-gray-400"><p><strong>Service:</strong> {booking.serviceType || 'N/A'}</p><p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p><p><strong>Total Cost:</strong> रु{booking.totalCost}</p><p><strong>Status:</strong> <StatusBadge status={booking.status} /></p></div></div>
                </div>
                <div className="p-6"><h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">Problem & Vehicle Details</h2><div className="space-y-2 mt-4 text-gray-600 dark:text-gray-400"><p><strong>Vehicle Details:</strong> {booking.bikeModel || 'Not provided'}</p><p><strong>Problem Description:</strong> {booking.notes || 'Not provided'}</p></div></div>
            </Card>
        </div>
    );
};
const UsersPage = ({ onSave: parentOnSave }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const ITEMS_PER_PAGE = 10;
    const fetchUsers = async (page) => {
        try {
            const response = await apiFetch(`/users?page=${page}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
            const data = await response.json();
            setUsers(data.data || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) { setUsers([]); setTotalPages(0); toast.error(error.message || 'Failed to fetch users.'); }
    };
    useEffect(() => { fetchUsers(currentPage); }, [currentPage, searchTerm]);
    const handleAddNew = () => { setEditingUser(null); setIsModalOpen(true); };
    const handleEdit = (user) => { setEditingUser(user); setIsModalOpen(true); };
    const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };
    const confirmDelete = async () => {
        try {
            await apiFetch(`/users/${itemToDelete}`, { method: 'DELETE' });
            toast.success('User deleted successfully!');
            fetchUsers(currentPage);
        } catch (error) { toast.error(error.message || 'Failed to delete user.'); }
        finally { setConfirmOpen(false); setItemToDelete(null); }
    };
    const handleSave = async (formData) => {
        try {
            if (editingUser) {
                await apiFetch(`/users/${editingUser._id}`, { method: 'PUT', body: JSON.stringify(formData) });
                toast.success('User updated successfully!');
            } else {
                await apiFetch('/users/create', { method: 'POST', body: JSON.stringify(formData) });
                toast.success('User created successfully!');
            }
            fetchUsers(currentPage);
            closeModal();
        } catch (error) { toast.error(error.message || 'Failed to save user.'); }
    };
    const handlePageChange = (newPage) => { if (newPage > 0 && newPage <= totalPages) { setCurrentPage(newPage); } };
    const closeModal = () => { setIsModalOpen(false); setEditingUser(null); };
    return (
        <div className="space-y-6 flex flex-col flex-grow">
            <div className="flex justify-between items-center"><h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1><Button onClick={handleAddNew}><Plus size={20} />Add New User</Button></div>
            <Card className="flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined On</th><th className="p-3">Role</th><th className="p-3 text-center">Actions</th></tr></thead>
                        <tbody>
                            {users.length > 0 ? users.map(user => (
                                <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{user.fullName}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td><td className="p-3 text-gray-600 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td><td className="p-3 text-gray-600 dark:text-gray-300 capitalize">{user.role}</td>
                                    <td className="p-3 text-center"><div className="flex justify-center items-center gap-2"><button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"><Edit size={18} /></button><button onClick={() => handleDeleteClick(user._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button></div></td>
                                </tr>
                            )) : (<tr><td colSpan="5" className="text-center py-10 text-gray-500">No users found.</td></tr>)}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </Card>
            <UserFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} user={editingUser} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete User" message="Are you sure you want to delete this user? This will permanently remove their data." />
        </div>
    );
};
const ProfilePage = ({ currentUser, setCurrentUser }) => {
    const [profile, setProfile] = useState(currentUser);
    const [isEditing, setIsEditing] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const fileInputRef = useRef(null);
    useEffect(() => { setProfile(currentUser); }, [currentUser]);
    const handleChange = (e) => { setProfile({ ...profile, [e.target.name]: e.target.value }); }
    const handleFileChange = (e) => { const file = e.target.files[0]; if (file) { setProfile(p => ({ ...p, profilePictureUrl: URL.createObjectURL(file), newProfilePicture: file })); } };
    const handleUploadClick = () => { fileInputRef.current.click(); };
    const handleFetchLocation = () => {
        if (!navigator.geolocation) { toast.error("Geolocation is not supported by your browser."); return; }
        setIsFetchingLocation(true);
        toast.info("Fetching your location...");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data.display_name) {
                        setProfile(p => ({ ...p, address: data.display_name }));
                        toast.success("Location fetched and address updated!");
                    } else { toast.error("Could not determine address from your location."); }
                } catch (error) { toast.error("Failed to fetch address. Please enter manually."); }
                finally { setIsFetchingLocation(false); }
            },
            (error) => {
                let errorMessage = "An unknown geolocation error occurred.";
                if (error.code === error.PERMISSION_DENIED) { errorMessage = "Location access denied. Please enable it in your browser settings."; }
                else if (error.code === error.POSITION_UNAVAILABLE) { errorMessage = "Location information is currently unavailable."; }
                else if (error.code === error.TIMEOUT) { errorMessage = "Request for location timed out."; }
                toast.error(errorMessage);
                setIsFetchingLocation(false);
            }
        );
    };
    const handleSave = async () => {
        const formData = new FormData();
        Object.keys(profile).forEach(key => { if (key !== 'newProfilePicture' && key !== 'profilePictureUrl' && key !== 'profilePicture' && profile[key] !== null) { formData.append(key, profile[key]); } });
        if (profile.newProfilePicture) { formData.append('profilePicture', profile.newProfilePicture); }
        try {
            const response = await apiFetch('/profile', { method: 'PUT', body: formData });
            const data = await response.json();
            setCurrentUser(data.data);
            setProfile(data.data);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) { toast.error(error.message || 'Failed to save profile.'); }
    };
    const handleCancel = () => { setProfile(currentUser); setIsEditing(false); }
    const handleImageError = (e) => { e.target.onerror = null; e.target.src = `https://placehold.co/128x128/e2e8f0/4a5568?text=A`; }
    const profilePictureSrc = profile.profilePictureUrl || (profile.profilePicture ? `http://localhost:5050/${profile.profilePicture}` : `https://placehold.co/128x128/e2e8f0/4a5568?text=A`);
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workshop Profile</h1>
            <Card><div className="p-6"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-start"><h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Information</h2>{!isEditing && (<Button onClick={() => setIsEditing(true)}><Edit size={16} />Edit Profile</Button>)}</div><div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-1 flex flex-col items-center"><img key={profilePictureSrc} src={profilePictureSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} /><input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />{isEditing && (<Button variant="secondary" className="w-full" onClick={handleUploadClick}><Camera size={16} /> Change Picture</Button>)}</div>
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Input id="workshopName" label="Workshop Name" name="workshopName" value={profile.workshopName || ''} onChange={handleChange} disabled={!isEditing} /><Input id="ownerName" label="Owner Name" name="ownerName" value={profile.ownerName || ''} onChange={handleChange} disabled={!isEditing} /><Input id="email" label="Email Address" name="email" type="email" value={profile.email || ''} onChange={handleChange} disabled={!isEditing} /><Input id="phone" label="Phone Number" name="phone" value={profile.phone || ''} onChange={handleChange} disabled={!isEditing} /></div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                            {isEditing && (<Button variant="secondary" onClick={handleFetchLocation} disabled={isFetchingLocation} className="text-xs py-1 px-2 !gap-1.5">{isFetchingLocation ? 'Fetching...' : <><MapPin size={14} /> Fetch Location</>}</Button>)}
                        </div>
                        <textarea id="address" name="address" rows="3" value={profile.address || ''} onChange={handleChange} disabled={!isEditing} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-700/50 dark:text-white" placeholder="Enter workshop address or fetch current location"></textarea>
                    </div>
                    {isEditing && (<div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={handleCancel}>Cancel</Button><Button onClick={handleSave}>Save Changes</Button></div>)}
                </div>
            </div></div></Card>
        </div>
    );
};
const BookingFormModal = ({ isOpen, onClose, booking, onSave }) => {
    const [formData, setFormData] = useState({});
    useEffect(() => { if (booking) { setFormData({ status: booking.status, totalCost: booking.totalCost }); } }, [booking, isOpen]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (<Modal isOpen={isOpen} onClose={onClose} title={`Edit Booking`}><form onSubmit={handleSubmit} className="space-y-4">{booking && <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"><p className="text-sm"><strong className="dark:text-gray-300">Customer:</strong> {booking.customer?.fullName}</p><p className="text-sm"><strong className="dark:text-gray-300">Service:</strong> {booking.serviceType}</p><p className="text-sm"><strong className="dark:text-gray-300">Bike:</strong> {booking.bikeModel}</p></div>}<div><label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label><select id="status" name="status" value={formData.status || ''} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div><Input id="totalCost" label="Total Cost (रु)" name="totalCost" type="number" value={formData.totalCost || ''} onChange={handleChange} /><div className="flex justify-end gap-3 pt-4"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save Changes</Button></div></form></Modal>);
};
const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'user' });
    useEffect(() => { if (user) { setFormData({ fullName: user.fullName, email: user.email, role: user.role, password: '' }); } else { setFormData({ fullName: '', email: '', password: '', role: 'user' }); } }, [user, isOpen]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }
    const handleSubmit = (e) => { e.preventDefault(); const dataToSave = { ...formData }; if (user && !dataToSave.password) { delete dataToSave.password; } onSave(dataToSave); }
    return (<Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Add New User'}><form onSubmit={handleSubmit} className="space-y-4"><Input id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required /><Input id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required /><Input id="password" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} placeholder={user ? "Leave blank to keep current" : ""} required={!user} /><div><label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label><select id="role" name="role" value={formData.role || 'user'} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"><option value="user">User</option><option value="admin">Admin</option></select></div><div className="flex justify-end gap-3 pt-4"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">{user ? 'Save Changes' : 'Add User'}</Button></div></form></Modal>)
}
const ServiceFormModal = ({ isOpen, onClose, onSave, service }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const fileInputRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            if (service) { setFormData(service); }
            else { setFormData({ name: '', description: '', price: '', duration: '' }); }
            setImage(null); setPreview('');
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [service, isOpen]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('description', formData.description);
        dataToSend.append('price', formData.price);
        dataToSend.append('duration', formData.duration || '');
        if (image) { dataToSend.append('image', image); }
        onSave(dataToSend);
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={service ? 'Edit Service' : 'Add New Service'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="name" name="name" label="Service Name" value={formData.name || ''} onChange={handleChange} required />
                <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" required></textarea></div>
                <Input id="price" name="price" label="Price (रु)" type="number" value={formData.price || ''} onChange={handleChange} required />
                <Input id="duration" name="duration" label="Estimated Duration (e.g., 2 hours)" value={formData.duration || ''} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Image</label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept="image/*" required={!service} />
                    {preview && <img src={preview} alt="New Preview" className="mt-4 h-32 w-auto rounded object-cover" />}
                    {service && service.image && !preview && <img src={`http://localhost:5050/${service.image}`} alt="Current" className="mt-4 h-32 w-auto rounded object-cover" />}
                </div>
                <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">{service ? 'Save Changes' : 'Add Service'}</Button></div>
            </form>
        </Modal>
    );
};

// UPDATED SERVICES PAGE
const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    // NEW STATE FOR REVIEWS MODAL
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    
    const ITEMS_PER_PAGE = 6;
    
    const fetchServices = async (page) => {
        try {
            const response = await apiFetch(`/services?page=${page}&limit=${ITEMS_PER_PAGE}`);
            const data = await response.json();
            setServices(data.data || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) { setServices([]); setTotalPages(0); toast.error(error.message || 'Failed to fetch services.'); }
    };
    
    useEffect(() => { fetchServices(currentPage); }, [currentPage]);
    
    const handleAddNew = () => { setEditingService(null); setIsModalOpen(true); };
    const handleEdit = (service) => { setEditingService(service); setIsModalOpen(true); };
    const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };
    
    // NEW FUNCTION TO OPEN REVIEWS MODAL
    const handleViewReviews = (serviceId) => {
        setSelectedServiceId(serviceId);
        setReviewModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await apiFetch(`/services/${itemToDelete}`, { method: 'DELETE' });
            toast.success('Service deleted successfully!');
            if (services.length === 1 && currentPage > 1) { setCurrentPage(currentPage - 1); } else { fetchServices(currentPage); }
        } catch (error) { toast.error(error.message || 'Failed to delete service.'); }
        finally { setConfirmOpen(false); setItemToDelete(null); }
    };
    
    const handleSave = async (formData) => {
        try {
            const url = editingService ? `/services/${editingService._id}` : '/services';
            const method = editingService ? 'PUT' : 'POST';
            await apiFetch(url, { method, body: formData });
            toast.success(editingService ? 'Service updated successfully!' : 'Service added successfully!');
            fetchServices(currentPage);
            closeModal();
        } catch (error) { toast.error(error.message || 'Failed to save service.'); }
    };
    
    const handlePageChange = (newPage) => { if (newPage > 0 && newPage <= totalPages) { setCurrentPage(newPage); } };
    const closeModal = () => { setIsModalOpen(false); setEditingService(null); }
    const handleImageError = (e) => { e.target.src = 'https://placehold.co/400x300/e2e8f0/4a5568?text=No+Image'; }
    
    return (
        <div className="space-y-6 flex flex-col flex-grow">
            <div className="flex justify-between items-center"><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Services Management</h1><Button onClick={handleAddNew}><Plus size={20} />Add New Service</Button></div>
            <Card className="flex flex-col flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                    {services.length > 0 ? services.map(service => (
                        <div key={service._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <img src={`http://localhost:5050/${service.image}`} alt={service.name} onError={handleImageError} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{service.name}</h3>
                                <div className="flex items-center gap-2 my-1 text-sm text-gray-500">
                                    <StarRating rating={service.rating} />
                                    <span>({service.numReviews} reviews)</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4 flex-grow">{service.description}</p>
                                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <div><p className="text-lg font-semibold text-gray-800 dark:text-white">रु{service.price}</p><p className="text-sm text-gray-500 dark:text-gray-400">{service.duration}</p></div>
                                    <div className="flex gap-1">
                                        {/* NEW "VIEW REVIEWS" BUTTON */}
                                        <button onClick={() => handleViewReviews(service._id)} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" title="View Reviews">
                                            <ReviewIcon size={18} />
                                        </button>
                                        <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" title="Edit Service"><Edit size={18} /></button>
                                        <button onClick={() => handleDeleteClick(service._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" title="Delete Service"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (<div className="col-span-full text-center py-10 text-gray-500">No services found.</div>)}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </Card>
            <ServiceFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} service={editingService} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Service" message="Are you sure you want to delete this service? This action is permanent." />
            {/* RENDER THE NEW REVIEWS MODAL */}
            <ReviewsModal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} serviceId={selectedServiceId} />
        </div>
    );
};


const NavLink = ({ page, icon: Icon, children, activePage, onLinkClick, badgeCount }) => {
    const isActive = activePage === page;
    return (<a href={`#/admin/${page}`} onClick={onLinkClick} className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}><Icon size={22} /><span className="text-md">{children}</span>{badgeCount > 0 && (<span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{badgeCount}</span>)}</a>);
};
const SidebarContent = ({ activePage, onLinkClick, onLogoutClick, onMenuClose, totalUnreadCount }) => (
    <>
        <div className="p-4 flex items-center justify-between"><a href="#/admin/dashboard" onClick={onLinkClick} className="flex items-center gap-3 cursor-pointer"><img src="/motofix-removebg-preview.png" alt="MotoFix Logo" className="h-20 w-auto" /></a>{onMenuClose && (<button onClick={onMenuClose} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>)}</div>
        <nav className="flex-1 px-4 py-6 space-y-2"><NavLink page="dashboard" icon={BarChart} activePage={activePage} onLinkClick={onLinkClick}>Dashboard</NavLink><NavLink page="bookings" icon={List} activePage={activePage} onLinkClick={onLinkClick}>Bookings</NavLink><NavLink page="users" icon={Users} activePage={activePage} onLinkClick={onLinkClick}>Users</NavLink><NavLink page="services" icon={Wrench} activePage={activePage} onLinkClick={onLinkClick}>Services</NavLink><NavLink page="profile" icon={User} activePage={activePage} onLinkClick={onLinkClick}>Profile</NavLink><NavLink page="chat" icon={MessageSquare} activePage={activePage} onLinkClick={onLinkClick} badgeCount={totalUnreadCount}>Chat</NavLink></nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700"><button onClick={onLogoutClick} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800"><LogOut size={22} /><span className="text-md">Logout</span></button></div>
    </>
);
const AdminDashboard = () => {
    const [activePage, setActivePage] = useState(() => (window.location.hash.replace('#/admin/', '').split('/')[0] || 'dashboard'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({ ownerName: 'Admin', workshopName: '' });
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('adminTheme') === 'dark');
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const handleLogoutConfirm = () => { localStorage.clear(); window.location.href = '/'; };
    useEffect(() => {
        const fetchInitialCount = async () => {
            try {
                const response = await apiFetch('/chat/users');
                const data = await response.json();
                const unreadConversations = data.data.filter(c => c.unreadCount > 0);
                setTotalUnreadCount(unreadConversations.length);
            } catch (error) { console.error("Could not fetch initial unread count", error); }
        };
        fetchInitialCount();
        const notificationListener = () => { fetchInitialCount(); };
        const readListener = () => { fetchInitialCount(); };
        socket.on('new_message_notification', notificationListener);
        socket.on('messages_read_by_admin', readListener);
        return () => {
            socket.off('new_message_notification', notificationListener);
            socket.off('messages_read_by_admin', readListener);
        };
    }, []);
    useEffect(() => { document.title = totalUnreadCount > 0 ? `(${totalUnreadCount}) MotoFix Admin` : 'MotoFix Admin'; }, [totalUnreadCount]);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetch('/profile');
                const data = await response.json();
                setCurrentUser(data.data || { ownerName: 'Admin' });
            } catch (error) { if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) { handleLogoutConfirm(); } }
        };
        fetchProfile();
    }, []);
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);
    useEffect(() => {
        const handleHashChange = () => {
            const page = window.location.hash.replace('#/admin/', '').split('/')[0] || 'dashboard';
            setActivePage(page);
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const renderPage = () => {
        const hash = window.location.hash.replace('#/admin/', '');
        const [page, id] = hash.split('/');
        switch (page) {
            case 'dashboard': return <DashboardPage />;
            case 'bookings': if (id) { return <BookingDetailsPage bookingId={id} />; } return <BookingsPage />;
            case 'users': return <UsersPage />;
            case 'services': return <ServicesPage />;
            case 'profile': return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
            case 'chat': return <AdminChatPage />;
            default: window.location.hash = '#/admin/dashboard'; return <DashboardPage />;
        }
    };
    const handleImageError = (e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/e2e8f0/4a5568?text=A`; }
    const profilePictureSrc = currentUser.profilePicture ? `http://localhost:5050/${currentUser.profilePicture}` : `https://placehold.co/40x40/e2e8f0/4a5568?text=A`;
    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
            <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col"><SidebarContent activePage={activePage} onLinkClick={() => setIsSidebarOpen(false)} onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }} onMenuClose={() => setIsSidebarOpen(false)} totalUnreadCount={totalUnreadCount} /></div><div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div></div>
            <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0"><SidebarContent activePage={activePage} onLinkClick={() => { }} onLogoutClick={() => setLogoutConfirmOpen(true)} totalUnreadCount={totalUnreadCount} /></aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center"><button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button><div className="hidden lg:block" /><div className="flex items-center gap-4"><button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button><div className="flex items-center gap-3"><img key={profilePictureSrc} src={profilePictureSrc} alt="Admin" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} /><div><p className="font-semibold text-sm">{currentUser.ownerName}</p><p className="text-xs text-gray-500 dark:text-gray-400">Workshop Owner</p></div></div></div></header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8 flex flex-col">{renderPage()}</main>
            </div>
            <ConfirmationModal isOpen={isLogoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} onConfirm={handleLogoutConfirm} title="Confirm Logout" message="Are you sure you want to logout?" confirmText="Logout" confirmButtonVariant="danger" Icon={LogOut} />
        </div>
    );
};

export default AdminDashboard;