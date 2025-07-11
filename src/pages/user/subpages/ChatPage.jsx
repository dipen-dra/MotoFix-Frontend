import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Paperclip, Camera, Send, FileText, XCircle } from 'lucide-react';
import { socket } from '../../../services/socket';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ChatPage = ({ currentUser }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const chatBodyRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const room = currentUser?._id ? `chat-${currentUser._id}` : null;
    const authorName = currentUser?.fullName || 'Customer';
    const authorId = currentUser?._id || null;

    useEffect(() => {
        if (!room || !authorId) return;

        socket.emit("join_room", { roomName: room, userId: authorId });

        const historyListener = (history) => {
            if (history.length === 0 || (history.length > 0 && history[0].room === room)) {
                setMessageList(history);
            }
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
        event.target.value = null; // Reset file input
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
                            <span className="h-2 w-2 rounded-full bg-green-500"></span> Online
                        </p>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-1" ref={chatBodyRef}>
                    {messageList.map((msg, index) => {
                        const isUserMessage = msg.authorId === authorId;
                        return (
                            <div key={index} className={`flex items-end gap-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                                {!isUserMessage && (
                                    <div className="w-8 flex-shrink-0 self-end">
                                         <img src="/motofix-removebg-preview.png" alt="S" className="w-7 h-7 rounded-full object-contain bg-gray-100 dark:bg-gray-900 p-0.5" />
                                    </div>
                                )}
                                <div className={`py-2 px-3 max-w-md rounded-2xl ${isUserMessage ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
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

export default ChatPage;