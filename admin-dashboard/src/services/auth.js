import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  // Real login with backend
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  },

  // Get current user from backend
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },


  // Mock update profile
  updateProfile: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'A',
      ...userData
    };
    
    return {
      data: {
        user: mockUser
      }
    };
  }
};
// In src/services/auth.js, make sure logout function clears everything
logout: async () => {
  const token = localStorage.getItem('token');
  
  // If in development, just return success
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Clear any mock data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true };
  }
  
  // For production - call logout API
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Clear local storage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  }
}