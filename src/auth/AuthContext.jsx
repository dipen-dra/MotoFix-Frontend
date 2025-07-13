// src/auth/AuthContext.jsx
import { createContext, useState, useEffect, useMemo } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData, token) => {
        setLoading(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData); // This updates the context state
        setLoading(false);
        // Redirection happens in App.jsx based on this user state change
        console.log("AuthContext login called. User role:", userData.role); 
    };

    const logout = () => {
        setLoading(true);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log("AuthContext useEffect: User loaded from localStorage. Role:", parsedUser.role); 
            } catch (e) {
                console.error("Failed to parse user data from localStorage", e);
                localStorage.clear(); 
            }
        } else {
            setUser(null);
            console.log("AuthContext useEffect: No user/token found in localStorage.");
        }
        setLoading(false);
    }, []);

    const memoizedValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        isAuthenticated: user !== null
    }), [user, loading]);

    return (
        <AuthContext.Provider value={memoizedValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;