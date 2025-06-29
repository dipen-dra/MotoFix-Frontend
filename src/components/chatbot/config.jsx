import { createChatBotMessage, createClientMessage } from 'react-chatbot-kit';

const config = {
    botName: "MotoFix-Bot",
  initialMessages: [createChatBotMessage(`Welcome to MotoFix! How can I help you today?`)],
  customComponents: {
    header: () => <div style={{ backgroundColor: '#376B7E', padding: "5px", borderRadius: "3px", color: 'white', textAlign: 'center' }}><h2 className="text-lg font-semibold">MotoFix Assistant</h2></div>,
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#376B7E',
    },
  },
  // These are passed to the ActionProvider and MessageParser
  createChatBotMessage,
  createClientMessage,
};

export default config;
