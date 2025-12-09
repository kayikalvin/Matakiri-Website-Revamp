import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/auth.js';

// Auth Context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getUser();

        if (token && storedUser) {
          // Verify token is still valid by getting current user
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: currentUser, token },
            });
          } else {
            // Token invalid, clear storage
            authService.clearAuth();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuth();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.user, token: result.token },
        });
        return { success: true, message: result.message };
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: result.message || 'Login failed',
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed',
      });
      return { success: false, message: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.user, token: result.token },
        });
        return { success: true, message: result.message };
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: result.message || 'Registration failed',
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Registration failed',
      });
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      const result = await authService.updateProfile(userData);
      if (result.success) {
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: result.user,
        });
        return { success: true, message: result.message };
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: result.message || 'Profile update failed',
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Profile update failed',
      });
      return { success: false, message: error.message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser(true);
      if (currentUser) {
        dispatch({ type: 'SET_USER', payload: currentUser });
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Check if user has role
  const hasRole = (role) => {
    return state.user && state.user.role === role;
  };

  // Check if user has any of the roles
  const hasAnyRole = (roles) => {
    return state.user && roles.includes(state.user.role);
  };

  // Check if user can access admin
  const canAccessAdmin = () => {
    return hasAnyRole(['admin', 'editor']);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!state.user?.name) return 'U';
    
    return state.user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get user display name
  const getUserDisplayName = () => {
    return state.user?.name || 'User';
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    clearError,
    hasRole,
    hasAnyRole,
    canAccessAdmin,
    getUserInitials,
    getUserDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;