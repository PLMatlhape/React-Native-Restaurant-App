import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import colors from '../styles/colors';

// Theme color types
interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
  textSecondary: string;
  border: string;
  divider: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  white: string;
  black: string;
}

interface Theme {
  colors: ThemeColors;
  dark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  colors: ThemeColors;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Light theme (default)
const lightTheme: Theme = {
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
const darkTheme: Theme = {
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  const loadThemePreference = async (): Promise<void> => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (isDark: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = (): void => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    saveThemePreference(newMode);
  };

  const setLightTheme = (): void => {
    setIsDarkMode(false);
    saveThemePreference(false);
  };

  const setDarkTheme = (): void => {
    setIsDarkMode(true);
    saveThemePreference(true);
  };

  const value: ThemeContextType = {
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

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
