import { useState } from "react";
import { registerUserService } from "../services/authServices";

export const useRegisterUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const register = async (formData) => {
        //when user clicks on register button, this function will be called
        //it will send the formData to the server and get the response
        setLoading(true);
        setError(null);
        setData(null);//clear state
        try {
            const response = await registerUserService(formData);
            setData(response);
            return response; // Return the response for further use if needed
        } catch (err) {
            setError(err.message || "Registration Failed");
            return null; // Return null or handle the error as needed
        } finally {
            setLoading(false);
        }
    };
    return {
        register,
        loading,
        error,
        data
    };
}