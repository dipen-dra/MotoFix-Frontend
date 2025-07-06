import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Send, X, Loader } from 'lucide-react'; // Using lucide-react icons
import './GeminiChatbot.css'; // We will create this CSS file next

const GeminiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatBodyRef = useRef(null);

    // Initial greeting message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                text: 'Hello! I am the MotoFix AI Assistant, powered by Gemini. How can I help you today?',
                sender: 'bot'
            }]);
        }
    }, [isOpen]);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // NOTE: This assumes your backend is running and has the /api/gemini/chat endpoint
            const res = await axios.post('http://localhost:5050/api/gemini/chat', {
                message: input,
                history: history,
            });

            const botMessage = { text: res.data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

            // Update conversation history for context
            setHistory(prev => [
                ...prev,
                { role: "user", parts: [{ text: input }] },
                { role: "model", parts: [{ text: res.data.response }] }
            ]);

        } catch (error) {
            console.error('Error sending message to Gemini API:', error);
            const errorMessage = { text: 'Sorry, I am having trouble connecting. Please try again later.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="gemini-chatbot-container">
            {isOpen && (
                <div className="chat-window dark:bg-gray-800 dark:border-gray-700">
                    <div className="chat-header bg-gradient-to-r from-blue-600 to-indigo-700">
                        <h2 className="text-white font-bold">MotoFix AI Assistant</h2>
                        <button onClick={toggleChat} className="text-white hover:opacity-80">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="chat-body dark:bg-gray-900/50" ref={chatBodyRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message bot">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="chat-footer dark:bg-gray-800 dark:border-t dark:border-gray-700">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..."
                            className="dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="send-button">
                            {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            )}
            <button className="chat-toggle-button" onClick={toggleChat}>
                <MessageSquare size={30} />
            </button>
        </div>
    );
};

export default GeminiChatbot;