const createMessageParser = (user) => {
    class MessageParser {
        constructor(actionProvider) {
            this.actionProvider = actionProvider;
            this.user = user;
        }

        parse(message) {
            const lowerCaseMessage = message.toLowerCase();

            if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
                this.actionProvider.greet();
            } else if (lowerCaseMessage.includes("service")) {
                this.actionProvider.handleServicesInquiry();
            } else if (lowerCaseMessage.includes("booking") || lowerCaseMessage.includes("book")) {
                this.actionProvider.handleBookingInquiry();
            } else if (lowerCaseMessage.includes("pending") || lowerCaseMessage.includes("orders")) {
                this.actionProvider.handleAdminPendingBookings(); // ActionProvider will check role
            } else if (lowerCaseMessage.includes("revenue") || lowerCaseMessage.includes("earnings")) {
                this.actionProvider.handleAdminRevenue(); // ActionProvider will check role
            } else if (lowerCaseMessage.includes("my bookings") || lowerCaseMessage.includes("my orders")) {
                this.actionProvider.handleUserBookings(); // ActionProvider will check role
            } else if (lowerCaseMessage.includes("loyalty") || lowerCaseMessage.includes("points")) {
                this.actionProvider.handleUserLoyaltyPoints(); // ActionProvider will check role
            } else {
                this.actionProvider.handleUnknown();
            }
        }
    }
    return MessageParser;
};

export default createMessageParser;
