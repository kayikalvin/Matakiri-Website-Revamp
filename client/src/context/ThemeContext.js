import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Valid theme values
const VALID_THEMES = ['light', 'dark'];

// Helper function to validate theme
const isValidTheme = (theme) => {
  return VALID_THEMES.includes(theme);
};

// Helper function to apply theme to DOM (SSR-safe)
const applyThemeToDOM = (theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

// Helper function to get from localStorage (SSR-safe)
const getStoredTheme = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('theme');
  }
  return null;
};

// Helper function to set in localStorage (SSR-safe)
const setStoredTheme = (theme) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = getStoredTheme();
    if (savedTheme && isValidTheme(savedTheme)) {
      setTheme(savedTheme);
      applyThemeToDOM(savedTheme);
    } else {
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        setTheme(systemTheme);
        applyThemeToDOM(systemTheme);
        setStoredTheme(systemTheme);
      }
    }
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStoredTheme(newTheme);
    applyThemeToDOM(newTheme);
  }, [theme]);

  // Set specific theme
  const setThemeMode = useCallback((mode) => {
    if (!isValidTheme(mode)) {
      console.warn(`Invalid theme mode: ${mode}. Must be 'light' or 'dark'.`);
      return;
    }
    setTheme(mode);
    setStoredTheme(mode);
    applyThemeToDOM(mode);
  }, []);

  const value = {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
