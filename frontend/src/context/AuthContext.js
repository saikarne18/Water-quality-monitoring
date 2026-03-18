import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  const signup = async (email, username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.API_BASE_URL}/api/v1/signup`, {
        email,
        username,
        password
      });
      
      const { access_token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return userData;
    } catch (error) {
      const message = error.response?.data?.detail || 'Signup failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.API_BASE_URL}/api/v1/login`, {
        email,
        password
      });
      
      const { access_token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return userData;
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
