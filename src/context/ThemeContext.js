import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';

const ThemeContext = createContext({});

// Light theme (default)
const lightTheme = {
  colors: {
    primary: colors.primary,
    primaryLight: colors.primaryLight,
    primaryDark: colors.primaryDark,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    textLight: colors.textLight,
    textSecondary: colors.textSecondary,
    border: colors.border,
    divider: colors.divider,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    white: colors.white,
    black: colors.black,
  },
  dark: false
};

// Dark theme
const darkTheme = {
  colors: {
    primary: '#8B6545',
    primaryLight: '#A0795A',
    primaryDark: '#6F4E37',
    secondary: '#5A4A3A',
    accent: '#A0522D',
    background: '#1C1410',
    surface: '#2C2420',
    text: '#F5E6D3',
    textLight: '#D2B48C',
    textSecondary: '#C19A6B',
    border: '#3E362F',
    divider: '#3E362F',
    error: '#E57373',
    success: '#81C784',
    warning: '#FFB74D',
    info: '#64B5F6',
    white: '#FFFFFF',
    black: '#000000',
  },
  dark: true
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (isDark) => {
    try {
      await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    saveThemePreference(newMode);
  };

  const setLightTheme = () => {
    setIsDarkMode(false);
    saveThemePreference(false);
  };

  const setDarkTheme = () => {
    setIsDarkMode(true);
    saveThemePreference(true);
  };

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    colors: theme.colors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;