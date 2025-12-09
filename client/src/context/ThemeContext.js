import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Valid theme values
const VALID_THEMES = ['light', 'dark'];

// Helper function to validate theme
const isValidTheme = (theme) => {
  return VALID_THEMES.includes(theme);
};

// Helper function to apply theme to DOM
const applyThemeToDOM = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && isValidTheme(savedTheme)) {
      setTheme(savedTheme);
      applyThemeToDOM(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        applyThemeToDOM('dark');
      }
    }
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeToDOM(newTheme);
  }, [theme]);

  // Set specific theme
  const setThemeMode = useCallback((mode) => {
    if (!isValidTheme(mode)) {
      console.warn(`Invalid theme mode: ${mode}. Must be 'light' or 'dark'.`);
      return;
    }
    setTheme(mode);
    localStorage.setItem('theme', mode);
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
