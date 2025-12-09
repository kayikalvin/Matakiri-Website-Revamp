import api, { authAPI } from './api.js';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      
      // Handle different response structures
      if (response.success) {
        // Extract token from response (could be at root or in data)
        const token = response.token || response.data?.token;
        const user = response.data?.user || response.data || response.user;
        
        if (token) {
          this.setToken(token);
          this.setUser(user);
          return { 
            success: true, 
            user, 
            token,
            message: response.message || 'Login successful'
          };
        }
      }
      
      return { 
        success: false, 
        message: response.message || 'Login failed. Please check your credentials.' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || error.data?.message || 'An error occurred during login.' 
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const token = response.token || response.data?.token;
        const user = response.data?.user || response.data || response.user;
        
        if (token) {
          this.setToken(token);
          this.setUser(user);
          return { 
            success: true, 
            user, 
            token,
            message: response.message || 'Registration successful'
          };
        }
      }
      
      return { 
        success: false, 
        message: response.message || 'Registration failed.' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || error.data?.message || 'An error occurred during registration.' 
      };
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout API if token exists
      if (this.getToken()) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Still proceed with local logout even if API call fails
    } finally {
      // Clear local storage
      this.clearAuth();
      
      // Redirect to home page
      window.location.href = '/';
    }
  }

  // Get current user
  async getCurrentUser(forceRefresh = false) {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        const user = response.data?.user || response.data;
        if (forceRefresh) {
          this.setUser(user);
        }
        return user;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        this.clearAuth();
      }
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const user = this.getUser();
    return user && roles.includes(user.role);
  }

  // Token management
  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // User management
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await authAPI.updateProfile(userData);
      if (response.success) {
        const user = response.data?.user || response.data;
        this.setUser(user);
        return { 
          success: true, 
          user,
          message: response.message || 'Profile updated successfully'
        };
      }
      return { 
        success: false, 
        message: response.message || 'Failed to update profile' 
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        message: error.message || error.data?.message || 'Failed to update profile.' 
      };
    }
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;