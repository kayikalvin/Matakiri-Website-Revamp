// Mock auth service for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  // Mock login for development
  login: async (credentials) => {
    console.log('Mock login with:', credentials);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: credentials.email,
      role: 'admin',
      avatar: 'A'
    };
    
    return {
      data: {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      }
    };
  },

  // Mock get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'A'
    };
    
    return mockUser;
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