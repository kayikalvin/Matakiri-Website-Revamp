import React, { createContext, useContext } from 'react';

// Lightweight stub AuthContext for public client (authentication removed)
const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  // No-op functions
  login: async () => ({ success: false, message: 'Authentication disabled on client' }),
  register: async () => ({ success: false, message: 'Registration disabled on client' }),
  logout: async () => {},
  updateProfile: async () => ({ success: false, message: 'Authentication disabled on client' }),
  hasRole: () => false,
  hasAnyRole: () => false,
});

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={AuthContext._currentValue || {}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;