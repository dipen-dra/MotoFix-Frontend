// import React, { useState, useEffect, useRef } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Plus, Edit, Trash2, Search, Users, Wrench, DollarSign, List, User, LogOut, Menu, X, Sun, Moon, Camera, AlertTriangle } from 'lucide-react';

// //-///////////////////////////////////////////////////////////////////////////
// // MOCK DATA
// //-///////////////////////////////////////////////////////////////////////////

// const mockBookings = [
//     { id: 1, customerName: 'Aarav Sharma', bikeModel: 'Bajaj Pulsar NS200', serviceType: 'General Service', status: 'Pending', date: '2024-07-15', totalCost: 1200 },
//     { id: 2, customerName: 'Priya Patel', bikeModel: 'Royal Enfield Classic 350', serviceType: 'Engine Oil Change', status: 'Completed', date: '2024-07-14', totalCost: 500 },
//     { id: 3, customerName: 'Rohan Verma', bikeModel: 'TVS Apache RTR 160', serviceType: 'Brake Repair', status: 'In Progress', date: '2024-07-16', totalCost: 800 },
//     { id: 4, customerName: 'Sneha Reddy', bikeModel: 'Hero Splendor Plus', serviceType: 'Tire Replacement', status: 'Completed', date: '2024-07-12', totalCost: 1500 },
//     { id: 5, customerName: 'Vikram Singh', bikeModel: 'Yamaha MT-15', serviceType: 'Full Body Wash', status: 'Cancelled', date: '2024-07-13', totalCost: 300 },
//     { id: 6, customerName: 'Anjali Gupta', bikeModel: 'Honda Activa 6G', serviceType: 'General Service', status: 'Completed', date: '2024-07-11', totalCost: 1250 },
//     { id: 7, customerName: 'Karan Malhotra', bikeModel: 'KTM Duke 200', serviceType: 'Chain Lubrication', status: 'Pending', date: '2024-07-17', totalCost: 400 },
// ];

// const mockUsers = [
//     { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', totalBookings: 3, dateJoined: '2024-01-20' },
//     { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', phone: '9876543211', totalBookings: 5, dateJoined: '2023-11-05' },
//     { id: 3, name: 'Rohan Verma', email: 'rohan.verma@example.com', phone: '9876543212', totalBookings: 1, dateJoined: '2024-05-10' },
//     { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@example.com', phone: '9876543213', totalBookings: 8, dateJoined: '2023-09-15' },
//     { id: 5, name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '9876543214', totalBookings: 2, dateJoined: '2024-03-22' },
// ];

// const mockServices = [
//     { id: 1, name: 'General Service', description: 'Comprehensive checkup and servicing.', price: 1200, duration: '2 hours' },
//     { id: 2, name: 'Engine Oil Change', description: 'Premium engine oil replacement.', price: 500, duration: '30 minutes' },
//     { id: 3, name: 'Brake Repair', description: 'Front and rear brake inspection and repair.', price: 800, duration: '1.5 hours' },
//     { id: 4, name: 'Tire Replacement', description: 'Includes new tire and fitting charges.', price: 1500, duration: '1 hour' },
//     { id: 5, name: 'Full Body Wash', description: 'Deep cleaning and polishing.', price: 300, duration: '45 minutes' },
//     { id: 6, name: 'Chain Lubrication', description: 'Cleaning and lubricating the chain set.', price: 400, duration: '25 minutes' },
// ];

// const revenueData = [
//     { name: 'Jan', revenue: 40000 }, { name: 'Feb', revenue: 30000 }, { name: 'Mar', revenue: 50000 },
//     { name: 'Apr', revenue: 45000 }, { name: 'May', revenue: 60000 }, { name: 'Jun', revenue: 75000 },
//     { name: 'Jul', revenue: 55000 },
// ];

// const servicesData = [
//     { name: 'Gen. Service', bookings: 45 }, { name: 'Oil Change', bookings: 80 }, { name: 'Brake Repair', bookings: 30 },
//     { name: 'Tire Replace', bookings: 25 }, { name: 'Wash', bookings: 120 }, { name: 'Chain Lube', bookings: 60 },
// ];

// //-///////////////////////////////////////////////////////////////////////////
// // REUSABLE UI COMPONENTS
// //-///////////////////////////////////////////////////////////////////////////

// const getStatusColor = (status) => {
//     switch (status) {
//         case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
//         case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
//         case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
//         default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
//     }
// };

// const Card = ({ children, className = '' }) => (
//     <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${className}`}>
//         {children}
//     </div>
// );

// const Modal = ({ isOpen, onClose, title, children }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
//                         <X size={24} />
//                     </button>
//                 </div>
//                 <div className="p-6">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
//     const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
//     const variants = {
//         primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//         secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
//         danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//     };
//     return (
//         <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
//             {children}
//         </button>
//     );
// };


// const ConfirmationModal = ({
//     isOpen,
//     onClose,
//     onConfirm,
//     title,
//     message,
//     confirmText = 'Delete',
//     confirmButtonVariant = 'danger',
//     Icon = AlertTriangle,
//     iconColor = 'text-red-600 dark:text-red-400',
//     iconBgColor = 'bg-red-100 dark:bg-red-900/50'
// }) => {
//     if (!isOpen) return null;
//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title="">
//             <div className="text-center">
//                 <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}>
//                     <Icon className={`h-6 w-6 ${iconColor}`} />
//                 </div>
//                 <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
//                 <div className="mt-2 px-7 py-3">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
//                 </div>
//                 <div className="flex justify-center gap-3 mt-4">
//                     <Button variant="secondary" onClick={onClose}>
//                         Cancel
//                     </Button>
//                     <Button variant={confirmButtonVariant} onClick={onConfirm}>
//                         {confirmText}
//                     </Button>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// // const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
// //     if (!isOpen) return null;
// //     return (
// //         <Modal isOpen={isOpen} onClose={onClose} title="">
// //             <div className="text-center">
// //                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
// //                     <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
// //                 </div>
// //                 <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
// //                 <div className="mt-2 px-7 py-3">
// //                     <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
// //                 </div>
// //                 <div className="flex justify-center gap-3 mt-4">
// //                     <Button variant="secondary" onClick={onClose}>
// //                         Cancel
// //                     </Button>
// //                     <Button variant="danger" onClick={onConfirm}>
// //                         Delete
// //                     </Button>
// //                 </div>
// //             </div>
// //         </Modal>
// //     );
// // };

// const Input = ({ id, label, ...props }) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
//         <input id={id} {...props} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" />
//     </div>
// );

// const StatusBadge = ({ status }) => (
//     <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
//         {status}
//     </span>
// );

// //-///////////////////////////////////////////////////////////////////////////
// // PAGE COMPONENTS
// //-///////////////////////////////////////////////////////////////////////////

// const DashboardPage = () => {
//     const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
//     const totalBookings = mockBookings.length;
//     const newUsers = 12; // Mock data

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <Card className="hover:border-blue-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><DollarSign className="text-blue-600 dark:text-blue-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-green-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><List className="text-green-600 dark:text-green-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">Total Bookings</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalBookings}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card className="hover:border-indigo-500 border-2 border-transparent">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full"><Users className="text-indigo-600 dark:text-indigo-300" size={28} /></div>
//                         <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-sm">New Users This Month</p>
//                             <p className="text-2xl font-bold text-gray-800 dark:text-white">{newUsers}</p>
//                         </div>
//                     </div>
//                 </Card>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <Card>
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Overview</h2>
//                     <div style={{ width: '100%', height: 300 }}>
//                         <ResponsiveContainer>
//                             <LineChart data={revenueData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </Card>
//                 <Card>
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Popular Services</h2>
//                     <div style={{ width: '100%', height: 300 }}>
//                         <ResponsiveContainer>
//                             <BarChart data={servicesData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Bar dataKey="bookings" fill="#10b981" /></BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </Card>
//             </div>
//             <Card>
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Bookings</h2>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                             <tr>
//                                 <th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3 text-right">Cost</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {mockBookings.slice(0, 5).map(booking => (
//                                 <tr key={booking.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                     <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.customerName}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType}</td><td className="p-3"><StatusBadge status={booking.status} /></td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.date}</td><td className="p-3 text-right font-medium text-gray-900 dark:text-white">₹{booking.totalCost}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// const BookingsPage = () => {
//     const [bookings, setBookings] = useState(mockBookings);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingBooking, setEditingBooking] = useState(null);
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const filteredBookings = bookings.filter(b =>
//         b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         b.bikeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         b.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const handleEdit = (booking) => {
//         setEditingBooking(booking);
//         setIsModalOpen(true);
//     };

//     const handleDeleteClick = (id) => {
//         setItemToDelete(id);
//         setConfirmOpen(true);
//     };

//     const confirmDelete = () => {
//         setBookings(bookings.filter(b => b.id !== itemToDelete));
//         setConfirmOpen(false);
//         setItemToDelete(null);
//     };

//     const handleSave = (formData) => {
//         if (editingBooking) {
//             setBookings(bookings.map(b => b.id === editingBooking.id ? { ...b, ...formData } : b));
//         }
//         closeModal();
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingBooking(null);
//     };

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bookings Management</h1>
//             <Card>
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
//                     <div className="relative w-full md:w-auto">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                         <input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                     </div>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                             <tr>
//                                 <th className="p-3">Customer</th><th className="p-3">Bike Model</th><th className="p-3">Service</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th><th className="p-3 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredBookings.map(booking => (
//                                 <tr key={booking.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                     <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.customerName}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.date}</td><td className="p-3"><StatusBadge status={booking.status} /></td><td className="p-3 text-right font-medium">₹{booking.totalCost}</td>
//                                     <td className="p-3 text-center">
//                                         <div className="flex justify-center items-center gap-2">
//                                             <button onClick={() => handleEdit(booking)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"><Edit size={18} /></button>
//                                             <button onClick={() => handleDeleteClick(booking.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>
//             <BookingFormModal isOpen={isModalOpen} onClose={closeModal} booking={editingBooking} onSave={handleSave} />
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Booking" message="Are you sure you want to delete this booking? This action cannot be undone." />
//         </div>
//     );
// };

// const UsersPage = () => {
//     const [users, setUsers] = useState(mockUsers);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const filteredUsers = users.filter(u =>
//         u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const handleDeleteClick = (id) => {
//         setItemToDelete(id);
//         setConfirmOpen(true);
//     };

//     const confirmDelete = () => {
//         setUsers(users.filter(u => u.id !== itemToDelete));
//         setConfirmOpen(false);
//         setItemToDelete(null);
//     };

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
//             <Card>
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="relative w-full md:w-auto">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                         <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                     </div>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
//                             <tr>
//                                 <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined On</th><th className="p-3 text-center">Total Bookings</th><th className="p-3 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredUsers.map(user => (
//                                 <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
//                                     <td className="p-3 font-medium text-gray-900 dark:text-white">{user.name}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.phone}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.dateJoined}</td><td className="p-3 text-center font-medium">{user.totalBookings}</td>
//                                     <td className="p-3 text-center">
//                                         <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete User" message="Are you sure you want to delete this user? This will permanently remove their data." />
//         </div>
//     );
// };

// const ServicesPage = () => {
//     const [services, setServices] = useState(mockServices);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingService, setEditingService] = useState(null);
//     const [isConfirmOpen, setConfirmOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const handleAddNew = () => {
//         setEditingService(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = (service) => {
//         setEditingService(service);
//         setIsModalOpen(true);
//     };

//     const handleDeleteClick = (id) => {
//         setItemToDelete(id);
//         setConfirmOpen(true);
//     };

//     const confirmDelete = () => {
//         setServices(services.filter(s => s.id !== itemToDelete));
//         setConfirmOpen(false);
//         setItemToDelete(null);
//     };

//     const handleSave = (serviceData) => {
//         if (editingService) {
//             setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s));
//         } else {
//             const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
//             setServices([...services, { id: newId, ...serviceData }]);
//         }
//         closeModal();
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingService(null);
//     }

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Services Management</h1>
//                 <Button onClick={handleAddNew}><Plus size={20} />Add New Service</Button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {services.map(service => (
//                     <Card key={service.id} className="flex flex-col">
//                         <div className="flex-grow">
//                             <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{service.name}</h3>
//                             <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">{service.description}</p>
//                         </div>
//                         <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                             <div>
//                                 <p className="text-lg font-semibold text-gray-800 dark:text-white">₹{service.price}</p>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">{service.duration}</p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Edit size={18} /></button>
//                                 <button onClick={() => handleDeleteClick(service.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Trash2 size={18} /></button>
//                             </div>
//                         </div>
//                     </Card>
//                 ))}
//             </div>
//             <ServiceFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} service={editingService} />
//             <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Service" message="Are you sure you want to delete this service? This action is permanent." />
//         </div>
//     );
// };

// const ProfilePage = ({ currentUser, setCurrentUser }) => {
//     const [profile, setProfile] = useState(currentUser);
//     const [isEditing, setIsEditing] = useState(false);
//     const fileInputRef = useRef(null);

//     useEffect(() => {
//         setProfile(currentUser);
//     }, [currentUser]);

//     const handleChange = (e) => {
//         setProfile({ ...profile, [e.target.name]: e.target.value });
//     }

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const newImageUrl = URL.createObjectURL(file);
//             setProfile(p => ({ ...p, profilePicture: newImageUrl }));
//         }
//     };

//     const handleUploadClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleSave = () => {
//         setCurrentUser(profile);
//         setIsEditing(false);
//     }

//     const handleCancel = () => {
//         setProfile(currentUser);
//         setIsEditing(false);
//     }

//     const handleImageError = (e) => {
//         e.target.onerror = null;
//         e.target.src = `https://placehold.co/128x128/e2e8f0/4a5568?text=MotoFix`;
//     }

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workshop Profile</h1>
//             <Card>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
//                         <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Information</h2>
//                         {!isEditing && (
//                             <Button onClick={() => setIsEditing(true)}><Edit size={16} />Edit Profile</Button>
//                         )}
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
//                         <div className="lg:col-span-1 flex flex-col items-center">
//                             <img
//                                 key={profile.profilePicture}
//                                 src={profile.profilePicture || `https://placehold.co/128x128/e2e8f0/4a5568?text=MotoFix`}
//                                 alt="Profile"
//                                 className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50"
//                                 onError={handleImageError}
//                             />
//                             {isEditing && (
//                                 <div className="w-full space-y-2">
//                                     <input
//                                         type="file"
//                                         ref={fileInputRef}
//                                         onChange={handleFileChange}
//                                         className="hidden"
//                                         accept="image/png, image/jpeg, image/gif"
//                                     />
//                                     <Button variant="secondary" className="w-full" onClick={handleUploadClick}>
//                                         <Camera size={16} /> Change Picture
//                                     </Button>
//                                     <Button variant="danger" className="w-full" onClick={() => setProfile(p => ({ ...p, profilePicture: '' }))}>
//                                         <Trash2 size={16} /> Remove Picture
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="lg:col-span-2 space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <Input id="workshopName" label="Workshop Name" name="workshopName" value={profile.workshopName} onChange={handleChange} disabled={!isEditing} />
//                                 <Input id="ownerName" label="Owner Name" name="ownerName" value={profile.ownerName} onChange={handleChange} disabled={!isEditing} />
//                                 <Input id="email" label="Email Address" name="email" type="email" value={profile.email} onChange={handleChange} disabled={!isEditing} />
//                                 <Input id="phone" label="Phone Number" name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} />
//                             </div>
//                             <div>
//                                 <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
//                                 <textarea id="address" name="address" rows="3" value={profile.address} onChange={handleChange} disabled={!isEditing} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-700/50 dark:text-white"></textarea>
//                             </div>

//                             {isEditing && (
//                                 <div className="flex justify-end gap-3 pt-4">
//                                     <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
//                                     <Button onClick={handleSave}>Save Changes</Button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };


// //-///////////////////////////////////////////////////////////////////////////
// // FORM MODAL COMPONENTS
// //-///////////////////////////////////////////////////////////////////////////

// const BookingFormModal = ({ isOpen, onClose, booking, onSave }) => {
//     const [formData, setFormData] = useState({});

//     useEffect(() => {
//         if (booking) { setFormData({ status: booking.status, totalCost: booking.totalCost }); }
//         else { setFormData({ status: 'Pending', totalCost: 0 }); }
//     }, [booking]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title={booking ? `Edit Booking #${booking.id}` : 'New Booking'}>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <p><strong className="dark:text-gray-300">Customer:</strong> {booking?.customerName}</p>
//                     <p><strong className="dark:text-gray-300">Service:</strong> {booking?.serviceType}</p>
//                 </div>
//                 <div>
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
//                     <select id="status" name="status" value={formData.status || ''} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white">
//                         <option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
//                     </select>
//                 </div>
//                 <Input id="totalCost" label="Total Cost (₹)" name="totalCost" type="number" value={formData.totalCost || ''} onChange={handleChange} />
//                 <div className="flex justify-end gap-3 pt-4">
//                     <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
//                     <Button type="submit" variant="primary">Save Changes</Button>
//                 </div>
//             </form>
//         </Modal>
//     );
// };

// const ServiceFormModal = ({ isOpen, onClose, onSave, service }) => {
//     const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '' });

//     useEffect(() => {
//         if (service) { setFormData(service); }
//         else { setFormData({ name: '', description: '', price: '', duration: '' }); }
//     }, [service]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     const handleSubmit = (e) => { e.preventDefault(); onSave(formData); }

//     return (
//         <Modal isOpen={isOpen} onClose={onClose} title={service ? 'Edit Service' : 'Add New Service'}>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <Input id="name" name="name" label="Service Name" value={formData.name} onChange={handleChange} required />
//                 <div>
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
//                     <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"></textarea>
//                 </div>
//                 <Input id="price" name="price" label="Price (₹)" type="number" value={formData.price} onChange={handleChange} required />
//                 <Input id="duration" name="duration" label="Duration (e.g., 2 hours)" value={formData.duration} onChange={handleChange} required />
//                 <div className="flex justify-end gap-3 pt-4">
//                     <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
//                     <Button type="submit" variant="primary">{service ? 'Save Changes' : 'Add Service'}</Button>
//                 </div>
//             </form>
//         </Modal>
//     )
// }

// //-///////////////////////////////////////////////////////////////////////////
// // MAIN ADMIN DASHBOARD COMPONENT & LAYOUT
// //-///////////////////////////////////////////////////////////////////////////

// const AdminDashboard = () => {
//     const [activePage, setActivePage] = useState(window.location.hash.replace('#/admin/', '') || 'dashboard');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(() => {
//         // Initialize theme from localStorage, default to light mode
//         return localStorage.getItem('adminTheme') === 'dark';
//     });
//     const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState({
//         ownerName: 'Admin User',
//         workshopName: 'MotoFix Central',
//         email: 'admin@motofix.com',
//         phone: '9988776655',
//         address: '123, Main Street, Auto Nagar, Delhi, India',
//         profilePicture: 'https://i.pravatar.cc/150?u=admin'
//     });

//     useEffect(() => {
//         // Apply 'dark' class to the html tag and save preference
//         if (isDarkMode) {
//             document.documentElement.classList.add('dark');
//             localStorage.setItem('adminTheme', 'dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//             localStorage.setItem('adminTheme', 'light');
//         }

//         // Cleanup function to remove the class when the component unmounts
//         return () => {
//             document.documentElement.classList.remove('dark');
//         };
//     }, [isDarkMode]);

//     const toggleTheme = () => {
//         setIsDarkMode(prevMode => !prevMode);
//     };



//     useEffect(() => {
//         const handleHashChange = () => {
//             const hash = window.location.hash.replace('#/admin/', '');
//             if (hash) {
//                 setActivePage(hash);
//             } else {
//                 setActivePage('dashboard');
//             }
//         };

//         window.addEventListener('hashchange', handleHashChange);
//         handleHashChange(); // Initial check
//         return () => window.removeEventListener('hashchange', handleHashChange);
//     }, []);

//     useEffect(() => {
//         if (isDarkMode) { document.documentElement.classList.add('dark'); }
//         else { document.documentElement.classList.remove('dark'); }
//     }, [isDarkMode]);

//     const renderPage = () => {
//         switch (activePage) {
//             case 'dashboard': return <DashboardPage />;
//             case 'bookings': return <BookingsPage />;
//             case 'users': return <UsersPage />;
//             case 'services': return <ServicesPage />;
//             case 'profile': return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
//             default:
//                 window.location.hash = '#/admin/dashboard';
//                 return <DashboardPage />;
//         }
//     };

//     const NavLink = ({ page, icon: Icon, children }) => {
//         const fullUrl = `#/admin/${page}`;
//         const isActive = activePage === page;

//         return (
//             <a href={fullUrl} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
//                 <Icon size={22} />
//                 <span className="text-md">{children}</span>
//             </a>
//         );
//     };

//     const SidebarContent = () => (
//         <>
//             <div className="p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <div className="bg-blue-600 p-2 rounded-lg"><Wrench className="text-white" size={24} /></div>
//                     <h1 className="text-2xl font-bold text-gray-800 dark:text-white">MotoFix</h1>
//                 </div>
//                 <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>
//             </div>
//             <nav className="flex-1 px-4 py-6 space-y-2">
//                 <NavLink page="dashboard" icon={BarChart}>Dashboard</NavLink>
//                 <NavLink page="bookings" icon={List}>Bookings</NavLink>
//                 <NavLink page="users" icon={Users}>Users</NavLink>
//                 <NavLink page="services" icon={Wrench}>Services</NavLink>
//                 <NavLink page="profile" icon={User}>Profile</NavLink>
//             </nav>
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//                 <a href="#/login" onClick={() => localStorage.clear()} className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
//                     <LogOut size={22} /><span className="text-md">Logout</span>
//                 </a>
//             </div>
//         </>
//     );

//     const handleImageError = (e) => {
//         e.target.onerror = null;
//         e.target.src = `https://placehold.co/40x40/e2e8f0/4a5568?text=MF`;
//     }

//     return (
//         <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
//             <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//                 <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col"><SidebarContent /></div>
//                 <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
//             </div>
//             <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0"><SidebarContent /></aside>
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
//                     <div className="hidden lg:block"></div>
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//                         </button>
//                         <div className="flex items-center gap-3">
//                             <img
//                                 key={currentUser.profilePicture}
//                                 src={currentUser.profilePicture || `https://placehold.co/40x40/e2e8f0/4a5568?text=MF`}
//                                 alt="Admin"
//                                 className="w-10 h-10 rounded-full object-cover"
//                                 onError={handleImageError}
//                             />
//                             <div>
//                                 <p className="font-semibold text-sm">{currentUser.ownerName}</p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">Workshop Owner</p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
//                     {renderPage()}
//                 </main>
//             </div>
//             <ConfirmationModal
//                 isOpen={isLogoutConfirmOpen}
//                 onClose={() => setLogoutConfirmOpen(false)}
//                 onConfirm={handleLogoutConfirm}
//                 title="Confirm Logout"
//                 message="Are you sure you want to logout?"
//                 confirmText="Logout"
//                 confirmButtonVariant="danger"
//                 Icon={LogOut}
//                 iconColor="text-red-600 dark:text-red-400"
//                 iconBgColor="bg-red-100 dark:bg-red-900/50"
//             />
//         </div>

//     );
// };

// export default AdminDashboard;


import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, Edit, Trash2, Search, Users, Wrench, DollarSign, List, User, LogOut, Menu, X, Sun, Moon, Camera, AlertTriangle } from 'lucide-react';

//-///////////////////////////////////////////////////////////////////////////
// MOCK DATA
//-///////////////////////////////////////////////////////////////////////////

const mockBookings = [
    { id: 1, customerName: 'Aarav Sharma', bikeModel: 'Bajaj Pulsar NS200', serviceType: 'General Service', status: 'Pending', date: '2024-07-15', totalCost: 1200 },
    { id: 2, customerName: 'Priya Patel', bikeModel: 'Royal Enfield Classic 350', serviceType: 'Engine Oil Change', status: 'Completed', date: '2024-07-14', totalCost: 500 },
    { id: 3, customerName: 'Rohan Verma', bikeModel: 'TVS Apache RTR 160', serviceType: 'Brake Repair', status: 'In Progress', date: '2024-07-16', totalCost: 800 },
    { id: 4, customerName: 'Sneha Reddy', bikeModel: 'Hero Splendor Plus', serviceType: 'Tire Replacement', status: 'Completed', date: '2024-07-12', totalCost: 1500 },
    { id: 5, customerName: 'Vikram Singh', bikeModel: 'Yamaha MT-15', serviceType: 'Full Body Wash', status: 'Cancelled', date: '2024-07-13', totalCost: 300 },
];
const mockUsers = [
    { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', totalBookings: 3, dateJoined: '2024-01-20' },
    { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', phone: '9876543211', totalBookings: 5, dateJoined: '2023-11-05' },
];
const mockServices = [
    { id: 1, name: 'General Service', description: 'Comprehensive checkup and servicing.', price: 1200, duration: '2 hours' },
    { id: 2, name: 'Engine Oil Change', description: 'Premium engine oil replacement.', price: 500, duration: '30 minutes' },
];
const revenueData = [
    { name: 'Jan', revenue: 40000 }, { name: 'Feb', revenue: 30000 }, { name: 'Mar', revenue: 50000 }, { name: 'Apr', revenue: 45000 },
];
const servicesData = [
    { name: 'Gen. Service', bookings: 45 }, { name: 'Oil Change', bookings: 80 }, { name: 'Brake Repair', bookings: 30 },
];


//-///////////////////////////////////////////////////////////////////////////
// REUSABLE UI COMPONENTS
//-///////////////////////////////////////////////////////////////////////////

const getStatusColor = (status) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${className}`}>{children}</div>);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    return (<button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmButtonVariant = 'danger', Icon = AlertTriangle, iconColor = 'text-red-600 dark:text-red-400', iconBgColor = 'bg-red-100 dark:bg-red-900/50' }) => {
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
        <input id={id} {...props} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white" />
    </div>
);

const StatusBadge = ({ status }) => (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>{status}</span>);


//-///////////////////////////////////////////////////////////////////////////
// PAGE COMPONENTS
//-///////////////////////////////////////////////////////////////////////////

const DashboardPage = () => {
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalBookings = mockBookings.length;
    const newUsers = 12; // Mock data

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:border-blue-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full"><DollarSign className="text-blue-600 dark:text-blue-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-green-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full"><List className="text-green-600 dark:text-green-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalBookings}</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:border-indigo-500 border-2 border-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full"><Users className="text-indigo-600 dark:text-indigo-300" size={28} /></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">New Users This Month</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{newUsers}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Overview</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={revenueData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Popular Services</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={servicesData}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="name" stroke="rgb(107 114 128)" /><YAxis stroke="rgb(107 114 128)" /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} /><Legend /><Bar dataKey="bookings" fill="#10b981" /></BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockBookings.slice(0, 5).map(booking => (
                                <tr key={booking.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.customerName}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType}</td><td className="p-3"><StatusBadge status={booking.status} /></td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.date}</td><td className="p-3 text-right font-medium text-gray-900 dark:text-white">₹{booking.totalCost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const BookingsPage = () => {
    const [bookings, setBookings] = useState(mockBookings);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredBookings = bookings.filter(b =>
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || b.bikeModel.toLowerCase().includes(searchTerm.toLowerCase()) || b.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (booking) => { setEditingBooking(booking); setIsModalOpen(true); };
    const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };
    const confirmDelete = () => { setBookings(bookings.filter(b => b.id !== itemToDelete)); setConfirmOpen(false); setItemToDelete(null); };
    const handleSave = (formData) => { if (editingBooking) { setBookings(bookings.map(b => b.id === editingBooking.id ? { ...b, ...formData } : b)); } closeModal(); };
    const closeModal = () => { setIsModalOpen(false); setEditingBooking(null); };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bookings Management</h1>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3">Customer</th><th className="p-3">Bike Model</th><th className="p-3">Service</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3 text-right">Cost</th><th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{booking.customerName}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.bikeModel}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.serviceType}</td><td className="p-3 text-gray-600 dark:text-gray-300">{booking.date}</td><td className="p-3"><StatusBadge status={booking.status} /></td><td className="p-3 text-right font-medium">₹{booking.totalCost}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => handleEdit(booking)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteClick(booking.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <BookingFormModal isOpen={isModalOpen} onClose={closeModal} booking={editingBooking} onSave={handleSave} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Booking" message="Are you sure you want to delete this booking? This action cannot be undone." />
        </div>
    );
};

const UsersPage = () => {
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };
    const confirmDelete = () => { setUsers(users.filter(u => u.id !== itemToDelete)); setConfirmOpen(false); setItemToDelete(null); };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined On</th><th className="p-3 text-center">Total Bookings</th><th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{user.name}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.phone}</td><td className="p-3 text-gray-600 dark:text-gray-300">{user.dateJoined}</td><td className="p-3 text-center font-medium">{user.totalBookings}</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete User" message="Are you sure you want to delete this user? This will permanently remove their data." />
        </div>
    );
};

const ServicesPage = () => {
    const [services, setServices] = useState(mockServices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleAddNew = () => { setEditingService(null); setIsModalOpen(true); };
    const handleEdit = (service) => { setEditingService(service); setIsModalOpen(true); };
    const handleDeleteClick = (id) => { setItemToDelete(id); setConfirmOpen(true); };
    const confirmDelete = () => { setServices(services.filter(s => s.id !== itemToDelete)); setConfirmOpen(false); setItemToDelete(null); };
    const handleSave = (serviceData) => {
        if (editingService) {
            setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s));
        } else {
            const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
            setServices([...services, { id: newId, ...serviceData }]);
        }
        closeModal();
    };
    const closeModal = () => { setIsModalOpen(false); setEditingService(null); }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Services Management</h1>
                <Button onClick={handleAddNew}><Plus size={20} />Add New Service</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <Card key={service.id} className="flex flex-col">
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{service.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">{service.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">₹{service.price}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{service.duration}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteClick(service.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <ServiceFormModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} service={editingService} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Service" message="Are you sure you want to delete this service? This action is permanent." />
        </div>
    );
};

const ProfilePage = ({ currentUser, setCurrentUser }) => {
    const [profile, setProfile] = useState(currentUser);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => { setProfile(currentUser); }, [currentUser]);
    const handleChange = (e) => { setProfile({ ...profile, [e.target.name]: e.target.value }); }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            setProfile(p => ({ ...p, profilePicture: newImageUrl }));
        }
    };
    const handleUploadClick = () => { fileInputRef.current.click(); };
    const handleSave = () => { setCurrentUser(profile); setIsEditing(false); }
    const handleCancel = () => { setProfile(currentUser); setIsEditing(false); }
    const handleImageError = (e) => { e.target.onerror = null; e.target.src = `https://placehold.co/128x128/e2e8f0/4a5568?text=MotoFix`; }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workshop Profile</h1>
            <Card>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Information</h2>
                        {!isEditing && (<Button onClick={() => setIsEditing(true)}><Edit size={16} />Edit Profile</Button>)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                        <div className="lg:col-span-1 flex flex-col items-center">
                            <img key={profile.profilePicture} src={profile.profilePicture || `https://placehold.co/128x128/e2e8f0/4a5568?text=MotoFix`} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} />
                            {isEditing && (
                                <div className="w-full space-y-2">
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                                    <Button variant="secondary" className="w-full" onClick={handleUploadClick}><Camera size={16} /> Change Picture</Button>
                                    <Button variant="danger" className="w-full" onClick={() => setProfile(p => ({ ...p, profilePicture: '' }))}><Trash2 size={16} /> Remove Picture</Button>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input id="workshopName" label="Workshop Name" name="workshopName" value={profile.workshopName} onChange={handleChange} disabled={!isEditing} />
                                <Input id="ownerName" label="Owner Name" name="ownerName" value={profile.ownerName} onChange={handleChange} disabled={!isEditing} />
                                <Input id="email" label="Email Address" name="email" type="email" value={profile.email} onChange={handleChange} disabled={!isEditing} />
                                <Input id="phone" label="Phone Number" name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                <textarea id="address" name="address" rows="3" value={profile.address} onChange={handleChange} disabled={!isEditing} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-700/50 dark:text-white"></textarea>
                            </div>
                            {isEditing && (
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                                    <Button onClick={handleSave}>Save Changes</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const BookingFormModal = ({ isOpen, onClose, booking, onSave }) => {
    const [formData, setFormData] = useState({});
    useEffect(() => { if (booking) { setFormData({ status: booking.status, totalCost: booking.totalCost }); } else { setFormData({ status: 'Pending', totalCost: 0 }); } }, [booking]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={booking ? `Edit Booking #${booking.id}` : 'New Booking'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <p><strong className="dark:text-gray-300">Customer:</strong> {booking?.customerName}</p>
                    <p><strong className="dark:text-gray-300">Service:</strong> {booking?.serviceType}</p>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select id="status" name="status" value={formData.status || ''} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white">
                        <option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
                    </select>
                </div>
                <Input id="totalCost" label="Total Cost (₹)" name="totalCost" type="number" value={formData.totalCost || ''} onChange={handleChange} />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
};

const ServiceFormModal = ({ isOpen, onClose, onSave, service }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '' });
    useEffect(() => { if (service) { setFormData(service); } else { setFormData({ name: '', description: '', price: '', duration: '' }); } }, [service]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={service ? 'Edit Service' : 'Add New Service'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="name" name="name" label="Service Name" value={formData.name} onChange={handleChange} required />
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"></textarea>
                </div>
                <Input id="price" name="price" label="Price (₹)" type="number" value={formData.price} onChange={handleChange} required />
                <Input id="duration" name="duration" label="Duration (e.g., 2 hours)" value={formData.duration} onChange={handleChange} required />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">{service ? 'Save Changes' : 'Add Service'}</Button>
                </div>
            </form>
        </Modal>
    )
}

//-///////////////////////////////////////////////////////////////////////////
// REFACTORED SIDEBAR COMPONENTS
//-///////////////////////////////////////////////////////////////////////////

const NavLink = ({ page, icon: Icon, children, activePage, onLinkClick }) => {
    const fullUrl = `#/admin/${page}`;
    const isActive = activePage === page;
    return (
        <a href={fullUrl} onClick={onLinkClick} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <Icon size={22} />
            <span className="text-md">{children}</span>
        </a>
    );
};

const SidebarContent = ({ activePage, onLinkClick, onLogoutClick, onMenuClose }) => (
    <>
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg"><Wrench className="text-white" size={24} /></div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">MotoFix</h1>
            </div>
            {onMenuClose && <button onClick={onMenuClose} className="lg:hidden text-gray-500 dark:text-gray-400"><X size={24} /></button>}
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink page="dashboard" icon={BarChart} activePage={activePage} onLinkClick={onLinkClick}>Dashboard</NavLink>
            <NavLink page="bookings" icon={List} activePage={activePage} onLinkClick={onLinkClick}>Bookings</NavLink>
            <NavLink page="users" icon={Users} activePage={activePage} onLinkClick={onLinkClick}>Users</NavLink>
            <NavLink page="services" icon={Wrench} activePage={activePage} onLinkClick={onLinkClick}>Services</NavLink>
            <NavLink page="profile" icon={User} activePage={activePage} onLinkClick={onLinkClick}>Profile</NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
                onClick={onLogoutClick}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <LogOut size={22} />
                <span className="text-md">Logout</span>
            </button>
        </div>
    </>
);


//-///////////////////////////////////////////////////////////////////////////
// MAIN ADMIN DASHBOARD COMPONENT
//-///////////////////////////////////////////////////////////////////////////

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState(() => window.location.hash.replace('#/admin/', '') || 'dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        ownerName: 'Admin User', workshopName: 'MotoFix Central', email: 'admin@motofix.com', phone: '9988776655', address: '123, Main Street, Auto Nagar, Delhi, India', profilePicture: 'https://i.pravatar.cc/150?u=admin'
    });
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('adminTheme') === 'dark');

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('adminTheme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('adminTheme', 'light');
        }
        return () => { document.documentElement.classList.remove('dark'); };
    }, [isDarkMode]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/admin/', '');
            if (hash) { setActivePage(hash); } else { setActivePage('dashboard'); }
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleLogoutConfirm = () => {
        localStorage.clear();
        window.location.hash = '#/login';
    };

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardPage />;
            case 'bookings': return <BookingsPage />;
            case 'users': return <UsersPage />;
            case 'services': return <ServicesPage />;
            case 'profile': return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
            default:
                window.location.hash = '#/admin/dashboard';
                return <DashboardPage />;
        }
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/40x40/e2e8f0/4a5568?text=MF`;
    }

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100`}>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                    <SidebarContent
                        activePage={activePage}
                        onLinkClick={() => setIsSidebarOpen(false)}
                        onLogoutClick={() => { setIsSidebarOpen(false); setLogoutConfirmOpen(true); }}
                        onMenuClose={() => setIsSidebarOpen(false)}
                    />
                </div>
                <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
            </div>
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
                <SidebarContent
                    activePage={activePage}
                    onLinkClick={() => { }} // No action needed on desktop
                    onLogoutClick={() => setLogoutConfirmOpen(true)}
                />
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={28} /></button>
                    <div className="hidden lg:block"></div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <img key={currentUser.profilePicture} src={currentUser.profilePicture || `https://placehold.co/40x40/e2e8f0/4a5568?text=MF`} alt="Admin" className="w-10 h-10 rounded-full object-cover" onError={handleImageError} />
                            <div>
                                <p className="font-semibold text-sm">{currentUser.ownerName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Workshop Owner</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
                    {renderPage()}
                </main>
            </div>

            <ConfirmationModal
                isOpen={isLogoutConfirmOpen}
                onClose={() => setLogoutConfirmOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                confirmButtonVariant="danger"
                Icon={LogOut}
                iconColor="text-red-600 dark:text-red-400"
                iconBgColor="bg-red-100 dark:bg-red-900/50"
            />
        </div>
    );
};

export default AdminDashboard;