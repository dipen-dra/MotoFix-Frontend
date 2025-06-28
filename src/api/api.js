// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api/auth";

// const api = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// export default api;


// api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api/auth";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// ✅ Intercept each request to attach the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
