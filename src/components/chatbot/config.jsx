import React from 'react';
import { createChatBotMessage, createClientMessage } from 'react-chatbot-kit';
import { Wrench } from 'lucide-react';
import BotAvatar from './BotAvatar.jsx';

const config = {
    botName: "MotoFixBot",
    initialMessages: [createChatBotMessage(`Welcome to MotoFix! How can I help you today?`)],
    customComponents: {
        // Replace the default header
        header: () => (
            <div 
                style={{
                    background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                    color: 'white',
                    padding: '16px',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <Wrench size={24} />
                <span>MotoFix Assistant</span>
            </div>
        ),
        // Replace the default bot avatar
        botAvatar: (props) => <BotAvatar {...props} />,
    },
    createChatBotMessage,
    createClientMessage,
};

export default config;
