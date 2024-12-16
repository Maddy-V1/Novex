import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.get(`${API_URL}/auth/me`, config);
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setError('');
      return true;
    } catch (error) {
      setError(error.response.data.message || 'An error occurred');
      return false;
    }
  };

  const login = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setError('');
      return true;
    } catch (error) {
      setError(error.response.data.message || 'An error occurred');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 