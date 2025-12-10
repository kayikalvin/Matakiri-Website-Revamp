import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData.user || userData); // support both {user: {...}} and {...}
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      const { user: userData, token } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear ALL auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any session storage if used
    sessionStorage.removeItem('token');
    
    // Reset all state
    setUser(null);
    setError(null);
    setLoading(false);
    
    // Optional: Clear any cached data
    // You might want to clear other app-specific storage
    // localStorage.removeItem('appState');
  }
};

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authService.updateProfile(userData);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Update failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor' || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
