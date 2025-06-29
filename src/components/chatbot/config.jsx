import React from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import { Wrench } from 'lucide-react';

import BotAvatar from '../chatbot/BotAvatar.jsx'; // Make sure this path is correct
import ServiceOptions from './widgets/ServiceOptions.jsx'; // Import the widget

const config = {
    botName: "MotoFixBot",
    initialMessages: [
        createChatBotMessage("Welcome to MotoFix! How can I help you today?")
    ],
    // Add an initial state for your services
    state: {
        services: []
    },
    customComponents: {
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
        botAvatar: (props) => <BotAvatar {...props} />,
    },
    // Register your custom widget here
    widgets: [
        {
            widgetName: 'serviceOptions',
            widgetFunc: (props) => <ServiceOptions {...props} />,
            // Map the widget to the 'services' piece of state
            mapStateToProps: ['services'],
        },
    ],
};

export default config;