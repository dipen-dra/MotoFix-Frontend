import React, { useState, useContext, useMemo } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import '../chatbot/chatbot.css'; // Import the new custom styles

import config from '../chatbot/config.jsx';
import createMessageParser from '../chatbot/MessageParser.jsx';
import createActionProvider from '../chatbot/ActionProvider.jsx';
import { MessageSquare, X } from 'lucide-react';
import { AuthContext } from '../../auth/AuthContext.jsx';

const ChatbotComponent = () => {
    const [showBot, setShowBot] = useState(false);
    const { user } = useContext(AuthContext
    );

    // Create the ActionProvider class, injecting the user context
    const ActionProvider = useMemo(() => createActionProvider(user), [user]);

    // Create the MessageParser class, injecting the user context
    const MessageParser = useMemo(() => createMessageParser(user), [user]);
    
    // Key the chatbot component to force a re-mount when the user logs in or out
    const chatbotKey = user ? user.data._id : 'guest';

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {showBot && (
                <div className="w-80 md:w-96 rounded-lg shadow-2xl">
                   <Chatbot
                        key={chatbotKey}
                        config={config}
                        actionProvider={ActionProvider}
                        messageParser={MessageParser}
                    />
                </div>
            )}
            <button 
                onClick={() => setShowBot((prev) => !prev)} 
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4 float-right"
                aria-label={showBot ? "Close Chat" : "Open Chat"}
            >
                {showBot ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default ChatbotComponent;
