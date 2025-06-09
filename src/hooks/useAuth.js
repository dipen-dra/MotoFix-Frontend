import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login/logout
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const signup = (userData) => setUser(userData); // Mock signup

  // Simulate checking auth status on component mount
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return { user, login, logout, signup, loading };
};