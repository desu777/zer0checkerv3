import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Custom hook for using the theme
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component to wrap the application
export const ThemeProvider = ({ children }) => {
  // Check if dark mode preference exists in localStorage, default to true if not found
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('zer0LeaderboardDarkMode');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('zer0LeaderboardDarkMode', JSON.stringify(darkMode));
    // Apply or remove dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Toggle between dark and light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Values provided to consuming components
  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 