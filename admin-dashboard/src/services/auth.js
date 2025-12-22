import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  // Login: returns response.data
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  },

  // Get current user using stored token
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/auth/updatedetails`, userData, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
      }
    } catch (err) {
      console.warn('Logout API failed, clearing local auth anyway', err?.message || err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return { success: true };
  }
};