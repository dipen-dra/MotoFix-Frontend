import axios from "./api";

export const registerUserApi = async (data) => {
    try {
        const response = await axios.post("/register", data);
        return response;
    } catch (error) {
        // Prioritize the error message from the server's response
        throw new Error(error.response?.data?.message || error.message || 'Registration failed.');
    }
};

export const loginUserApi = async (formData) => {
    console.log("FormData:", formData);
    try {
        const response = await axios.post("/login", formData);
        return response;
    } catch (error) {
        // Prioritize the error message from the server's response
        throw new Error(error.response?.data?.message || error.message || 'Login failed.');
    }
};