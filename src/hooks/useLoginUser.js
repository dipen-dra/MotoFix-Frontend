// import { loginUserService } from "../services/authServices";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// export const useLoginUser = () => {
//     return useMutation({
//         mutationFn: loginUserService,
//         mutationKey: ["login-key"],
//         onSuccess: (res) => {
//             console.log("Login response:", res); // 👀 Check this

//             // Correct: res.data is the user, res.token is the token
//             login(res.data, res.token); // ✅ Works with backend format
//             toast.success("Login successful!");
//         },

//         onError: (error) => {
//             toast.error("Login failed. Please try again.");
//         }
//     });
// };

import { loginUserService } from '../services/authServices';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    return useMutation({
        mutationFn: loginUserService,
        onSuccess: (data) => {
            // On successful login, call the login function from our AuthContext
            // This will update the user state and store the token.
            login(data.user, data.token);
            toast.success('Login successful!');

            // Navigate to the appropriate dashboard based on user role
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        },
        onError: (error) => {
            // Display a toast notification with the error message from the backend.
            toast.error(error.message || 'Login failed. Please check your credentials.');
        },
    });
};