import React from 'react';
import chatbotApi from '../../api/chatbotApi';


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
            const message = this.createChatBotMessage("I'm sorry, I don't understand. You can ask about 'services', 'booking', 'payment', or if logged in, your account details.");
            this.updateChatbotState(message);
        }

        // --- Public Actions (for Guests & All Users) ---
        handlePaymentInquiry = () => {
            const message = this.createChatBotMessage(
                <>
                    We offer multiple payment options for your convenience:
                    <p style={{margin: '4px 0'}}>- Cash on Delivery (COD)</p>
                    <p style={{margin: '4px 0'}}>- eSewa</p>
                    <p style={{margin: '4px 0'}}>- Khalti (Currently under construction)</p>
                </>
            );
            this.updateChatbotState(message);
        }

        handleServicesInquiry = async (message) => {
             try {
                const response = await chatbotApi.get('/chatbot/services');
                const services = response.data.data;
                const serviceNames = services.map(s => s.name.toLowerCase());
                
                const foundService = serviceNames.find(name => message.includes(name));

                if(foundService) {
                    this.handleServiceDetail(foundService);
                    return;
                }

                if (services && services.length > 0) {
                    const botMessage = this.createChatBotMessage(
                        "Of course! Here are our services. Select one to see more details.",
                        { widget: 'serviceOptions' }
                    );
                    this.setState((prev) => ({
                        ...prev,
                        messages: [...prev.messages, botMessage],
                        services: response.data.data,
                    }));
                } else {
                    this.updateChatbotState(this.createChatBotMessage("We don't have any services listed right now."));
                }
            } catch (error) {
                console.error("Chatbot API Error:", error);
                this.updateChatbotState(this.createChatBotMessage("Sorry, I couldn't fetch services right now."));
            }
        }

        handleServiceDetail = async (serviceName) => {
            try {
                const response = await chatbotApi.get('/chatbot/services');
                const service = response.data.data.find(s => s.name.toLowerCase() === serviceName.toLowerCase());

                if (service) {
                    const message = this.createChatBotMessage(
                        <>
                            <strong>{service.name}</strong>
                            <p>{service.description}</p>
                            <p><strong>Price:</strong> रु{service.price}</p>
                            <p><strong>Estimated Time:</strong> {service.duration}</p>
                        </>
                    );
                    this.updateChatbotState(message);
                } else {
                    this.handleUnknown();
                }
            } catch (error) {
                 this.updateChatbotState(this.createChatBotMessage("Sorry, I had trouble finding details for that service."));
            }
        };

        handleBookingInquiry = () => {
            this.updateChatbotState(this.createChatBotMessage("Please log in to book a service. You can register or log in, then find the booking option in your dashboard."));
        }

        handleProfileInquiry = async () => {
            if (!this.user) return this.updateChatbotState(this.createChatBotMessage("Please log in to view your profile."));

            try {
                const response = await chatbotApi.get('/chatbot/profile');
                const profileData = response.data.data;
                let profileMessage;

                if (this.user.data.role === 'admin') {
                    profileMessage = this.createChatBotMessage(<><strong>Admin Profile:</strong><p><strong>Workshop:</strong> {profileData.workshopName || 'N/A'}</p><p><strong>Owner:</strong> {profileData.ownerName || 'N/A'}</p><p><strong>Email:</strong> {profileData.email || 'N/A'}</p><p><strong>Phone:</strong> {profileData.phone || 'N/A'}</p><p><strong>Address:</strong> {profileData.address || 'N/A'}</p></>);
                } else {
                     profileMessage = this.createChatBotMessage(<><strong>Your Profile:</strong><p><strong>Name:</strong> {profileData.fullName || 'N/A'}</p><p><strong>Email:</strong> {profileData.email || 'N/A'}</p><p><strong>Phone:</strong> {profileData.phone || 'N/A'}</p><p><strong>Address:</strong> {profileData.address || 'N/A'}</p></>);
                }
                this.updateChatbotState(profileMessage);

            } catch (error) {
                 console.error("Chatbot Profile Error:", error);
                 this.updateChatbotState(this.createChatBotMessage("Sorry, I was unable to retrieve your profile information."));
            }
        }
        
        // --- Admin-Specific Actions ---
        handleAdminTotalBookings = async () => {
            if (this.user?.data?.role !== 'admin') return this.handleUnknown();
            try {
                const response = await chatbotApi.get('/chatbot/admin-dashboard');
                const { totalBookings } = response.data.data;
                this.updateChatbotState(this.createChatBotMessage(`You have a total of ${totalBookings} bookings in your system.`));
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch the total bookings count."));
            }
        }
        handleAdminPendingBookings = async () => {
            if (this.user?.data?.role !== 'admin') return this.handleUnknown();
            try {
                const response = await chatbotApi.get('/chatbot/admin-dashboard');
                const { pendingBookings, inProgressBookings } = response.data.data;
                this.updateChatbotState(this.createChatBotMessage(`You have ${pendingBookings} pending and ${inProgressBookings} in-progress bookings.`));
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch admin data."));
            }
        }

        handleAdminRevenue = async () => {
            if (this.user?.data?.role !== 'admin') return this.handleUnknown();
            try {
                const response = await chatbotApi.get('/chatbot/admin-dashboard');
                const { totalRevenue } = response.data.data;
                this.updateChatbotState(this.createChatBotMessage(`Your total revenue is रु${totalRevenue.toLocaleString()}.`));
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your revenue data."));
            }
        }

        // --- User-Specific Actions ---
        handleUserBookings = async () => {
             if (!this.user || this.user.data.role === 'admin') return this.handleUnknown();
            try {
                const response = await chatbotApi.get('/chatbot/user-dashboard');
                const { totalBookings } = response.data.data;
                this.updateChatbotState(this.createChatBotMessage(`You have made a total of ${totalBookings} bookings with us.`));
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your booking information."));
            }
        }
        
        handleUserUpcomingServices = async () => {
             if (!this.user || this.user.data.role === 'admin') return this.handleUnknown();
            try {
                const response = await chatbotApi.get('/chatbot/user-dashboard');
                const { upcomingServices } = response.data.data;
                this.updateChatbotState(this.createChatBotMessage(`You have ${upcomingServices} upcoming service(s) scheduled.`));
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your upcoming services."));
            }
        }
        
        handleUserCompletedServices = async () => {
             if (!this.user || this.user.data.role === 'admin') return this.handleUnknown();
            try {
                const response = await chatbotApi.get('/chatbot/user-dashboard');
                const { completedServices } = response.data.data;
                this.updateChatbotState(this.createChatBotMessage(`You have ${completedServices} completed service(s).`));
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your completed services."));
            }
        }

        handleUserLoyaltyPoints = async () => {
             if (!this.user || this.user.data.role === 'admin') return this.handleUnknown();
            try {
                const response = await chatbotApi.get('/chatbot/user-dashboard');
                const { loyaltyPoints } = response.data.data;
                this.updateChatbotState(this.createChatBotMessage(`You have ${loyaltyPoints} loyalty points.`));
            } catch (error) {
                this.updateChatbotState(this.createChatBotMessage("I couldn't fetch your loyalty points."));
            }
        }
    }
    return ActionProvider;
};

export default createActionProvider;
