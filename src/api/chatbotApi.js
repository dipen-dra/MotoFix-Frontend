
// src/api/chatbotApi.js
import axios from "axios";

const CHATBOT_API_URL = "http://localhost:5050/api"; // Static, no .env needed

const chatbotApi = axios.create({
    baseURL: CHATBOT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

chatbotApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default chatbotApi;
