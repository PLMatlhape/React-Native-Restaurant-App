// Main color palette for the Coffee Shop app
export interface ColorsType {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;

  // Background colors
  background: string;
  backgroundLight: string;
  backgroundDark: string;

  // Surface colors
  surface: string;
  surfaceLight: string;
  surfaceDark: string;

  // Text colors
  text: string;
  textLight: string;
  textSecondary: string;
  textDisabled: string;

  // UI element colors
  border: string;
  divider: string;
  overlay: string;
  shadow: string;

  // Status colors
  success: string;
  successLight: string;
  successDark: string;

  error: string;
  errorLight: string;
  errorDark: string;

  warning: string;
  warningLight: string;
  warningDark: string;

  info: string;
  infoLight: string;
  infoDark: string;

  // Additional utility colors
  white: string;
  black: string;
  transparent: string;

  // Coffee-themed colors
  espresso: string;
  latte: string;
  cappuccino: string;
  mocha: string;
  cream: string;
  caramel: string;

  // Category colors
  coffee: string;
  tea: string;
  dessert: string;
  pastry: string;
  beverage: string;

  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;

  // Gradient colors
  gradientStart: string;
  gradientEnd: string;

  // Special states
  disabled: string;
  placeholder: string;
  backdrop: string;

  // Rating/Favorite
  star: string;
  heart: string;

  // Order status colors
  pending: string;
  confirmed: string;
  preparing: string;
  ready: string;
  delivered: string;
  cancelled: string;
}

export const colors: ColorsType = {
  // Primary colors
  primary: '#6F4E37',
  primaryLight: '#8B6545',
  primaryDark: '#5A3E2B',

  // Secondary colors
  secondary: '#D2B48C',
  secondaryLight: '#E8D4B0',
  secondaryDark: '#C19A6B',

  // Accent colors
  accent: '#8B4513',
  accentLight: '#A0522D',
  accentDark: '#654321',

  // Background colors
  background: '#F5E6D3',
  backgroundLight: '#FFF8E1',
  backgroundDark: '#E8D4B0',

  // Surface colors
  surface: '#FFFFFF',
  surfaceLight: '#FAFAFA',
  surfaceDark: '#F5F5F5',

  // Text colors
  text: '#3E2723',
  textLight: '#795548',
  textSecondary: '#8D6E63',
  textDisabled: '#BCAAA4',

  // UI element colors
  border: '#BCAAA4',
  divider: '#D7CCC8',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Status colors
  success: '#388E3C',
  successLight: '#4CAF50',
  successDark: '#2E7D32',

  error: '#D32F2F',
  errorLight: '#E53935',
  errorDark: '#C62828',

  warning: '#F57C00',
  warningLight: '#FF9800',
  warningDark: '#E65100',

  info: '#1976D2',
  infoLight: '#2196F3',
  infoDark: '#0D47A1',

  // Additional utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Coffee-themed colors
  espresso: '#3E2723',
  latte: '#D7CCC8',
  cappuccino: '#C19A6B',
  mocha: '#654321',
  cream: '#FFF8E1',
  caramel: '#D2691E',

  // Category colors
  coffee: '#6F4E37',
  tea: '#8FBC8F',
  dessert: '#DDA0DD',
  pastry: '#F4A460',
  beverage: '#87CEEB',

  // Chart colors
  chart1: '#6F4E37',
  chart2: '#D2B48C',
  chart3: '#8B4513',
  chart4: '#A0522D',
  chart5: '#DEB887',

  // Gradient colors
  gradientStart: '#6F4E37',
  gradientEnd: '#D2B48C',

  // Special states
  disabled: '#BCAAA4',
  placeholder: '#9E9E9E',
  backdrop: 'rgba(0, 0, 0, 0.4)',

  // Rating/Favorite
  star: '#FFC107',
  heart: '#E91E63',

  // Order status colors
  pending: '#F57C00',
  confirmed: '#6F4E37',
  preparing: '#2196F3',
  ready: '#4CAF50',
  delivered: '#388E3C',
  cancelled: '#D32F2F',
};

// Color utilities
export const colorUtils = {
  // Add alpha to hex color
  hexToRGBA: (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  // Lighten color
  lighten: (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  },

  // Darken color
  darken: (hex: string, percent: number): string => {
    return colorUtils.lighten(hex, -percent);
  },
};

export default colors;
