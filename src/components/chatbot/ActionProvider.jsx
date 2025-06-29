import React from 'react';
import chatbotApi from '../../api/chatbotApi';
// Correctly import the NEW, dedicated chatbot API client.

const createActionProvider = (user) => {
    class ActionProvider {
        constructor(createChatBotMessage, setStateFunc) {
            this.createChatBotMessage = createChatBotMessage;
            this.setState = setStateFunc;
            this.user = user;
        }

        updateChatbotState(message) {
            this.setState((prevState) => ({
                ...prevState,
                messages: [...prevState.messages, message],
            }));
        }

        // --- Generic Actions ---
        greet = () => {
            const greetingMessage = this.createChatBotMessage("Hello! How can I assist you today?");
            this.updateChatbotState(greetingMessage);
        }

        handleUnknown = () => {
            const message = this.createChatBotMessage("I'm sorry, I don't understand. You can ask about 'services', 'booking', or if logged in, your account details.");
            this.updateChatbotState(message);
        }

        // --- Public Actions (for Guests) ---
        handleServicesInquiry = async () => {
            try {
                // Uses the new chatbotApi instance
                const response = await chatbotApi.get('/chatbot/services');
                const services = response.data.data;
                if (services && services.length > 0) {
                    const serviceList = services.map(s => `\n- ${s.name}: ${s.description} (रु${s.price})`).join('');
                    const message = this.createChatBotMessage(<>Here are the services we offer:{serviceList.split('\n').map((line, i) => <p key={i}>{line}</p>)}</>);
                    this.updateChatbotState(message);
                } else {
                    this.updateChatbotState(this.createChatBotMessage("We currently do not have any services listed. Please check back later!"));
                }
            } catch (error) {
                console.error("Chatbot API Error:", error);
                this.updateChatbotState(this.createChatBotMessage("Sorry, I couldn't fetch the services right now."));
            }
        }

        handleBookingInquiry = () => {
            const message = this.createChatBotMessage("To book a service, please log in or create an account. Once logged in, you can book from your dashboard.");
            this.updateChatbotState(message);
        }

        // --- Admin-Specific Actions ---
        handleAdminPendingBookings = async () => {
            if (this.user?.data?.role !== 'admin') return this.handleUnknown();
            try {
                // Uses the new chatbotApi instance
                const response = await chatbotApi.get('/chatbot/admin-dashboard');
                const { pendingBookings, inProgressBookings } = response.data.data;
                const message = this.createChatBotMessage(`You have ${pendingBookings} pending bookings and ${inProgressBookings} currently in progress.`);
                this.updateChatbotState(message);
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch admin data. Please ensure you are logged in as an admin."));
            }
        }

        handleAdminRevenue = async () => {
            if (this.user?.data?.role !== 'admin') return this.handleUnknown();
            try {
                // Uses the new chatbotApi instance
                const response = await chatbotApi.get('/chatbot/admin-dashboard');
                const { totalRevenue } = response.data.data;
                const message = this.createChatBotMessage(`Your total revenue from completed services is रु${totalRevenue.toLocaleString()}.`);
                this.updateChatbotState(message);
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your revenue data. Please ensure you are logged in as an admin."));
            }
        }

        // --- User-Specific Actions ---
        handleUserBookings = async () => {
             if (!this.user || this.user.data.role === 'admin') return this.handleUnknown();
            try {
                // Uses the new chatbotApi instance
                const response = await chatbotApi.get('/chatbot/user-dashboard');
                const { totalBookings, pendingBookings, inProgressBookings, completedServices } = response.data.data;
                const messageText = `You have ${totalBookings} total bookings.\n- Pending: ${pendingBookings}\n- In Progress: ${inProgressBookings}\n- Completed: ${completedServices}`;
                const message = this.createChatBotMessage(<div dangerouslySetInnerHTML={{ __html: messageText.replace(/\n/g, '<br />') }} />);
                this.updateChatbotState(message);
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your booking information. Please ensure you are logged in."));
            }
        }

        handleUserLoyaltyPoints = async () => {
             if (!this.user || this.user.data.role === 'admin') return this.handleUnknown();
            try {
                // Uses the new chatbotApi instance
                const response = await chatbotApi.get('/chatbot/user-dashboard');
                const { loyaltyPoints } = response.data.data;
                const message = this.createChatBotMessage(`You have ${loyaltyPoints} loyalty points. You can use them for discounts on future services!`);
                this.updateChatbotState(message);
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your loyalty points. Please ensure you are logged in."));
            }
        }
    }
    return ActionProvider;
};

export default createActionProvider;
