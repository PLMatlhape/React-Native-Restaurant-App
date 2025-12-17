// Main color palette for the Coffee Shop app
export const colors = {
  // Primary colors
  primary: '#6F4E37',        // Coffee brown
  primaryLight: '#8B6545',   // Lighter coffee brown
  primaryDark: '#5A3E2B',    // Darker coffee brown
  
  // Secondary colors
  secondary: '#D2B48C',      // Tan/Beige
  secondaryLight: '#E8D4B0', // Light tan
  secondaryDark: '#C19A6B',  // Dark tan
  
  // Accent colors
  accent: '#8B4513',         // Saddle brown
  accentLight: '#A0522D',    // Sienna
  accentDark: '#654321',     // Dark brown
  
  // Background colors
  background: '#F5E6D3',     // Cream/Beige background
  backgroundLight: '#FFF8E1', // Light cream
  backgroundDark: '#E8D4B0', // Darker cream
  
  // Surface colors
  surface: '#FFFFFF',        // White
  surfaceLight: '#FAFAFA',   // Off-white
  surfaceDark: '#F5F5F5',    // Light gray
  
  // Text colors
  text: '#3E2723',           // Dark brown text
  textLight: '#795548',      // Light brown text
  textSecondary: '#8D6E63',  // Secondary text
  textDisabled: '#BCAAA4',   // Disabled text
  
  // UI element colors
  border: '#BCAAA4',         // Border color
  divider: '#D7CCC8',        // Divider color
  overlay: 'rgba(0, 0, 0, 0.5)', // Overlay
  shadow: 'rgba(0, 0, 0, 0.1)',  // Shadow
  
  // Status colors
  success: '#388E3C',        // Green for success
  successLight: '#4CAF50',   // Light green
  successDark: '#2E7D32',    // Dark green
  
  error: '#D32F2F',          // Red for error
  errorLight: '#E53935',     // Light red
  errorDark: '#C62828',      // Dark red
  
  warning: '#F57C00',        // Orange for warning
  warningLight: '#FF9800',   // Light orange
  warningDark: '#E65100',    // Dark orange
  
  info: '#1976D2',           // Blue for info
  infoLight: '#2196F3',      // Light blue
  infoDark: '#0D47A1',       // Dark blue
  
  // Additional utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Coffee-themed colors
  espresso: '#3E2723',       // Dark espresso
  latte: '#D7CCC8',          // Latte color
  cappuccino: '#C19A6B',     // Cappuccino color
  mocha: '#654321',          // Mocha color
  cream: '#FFF8E1',          // Cream color
  caramel: '#D2691E',        // Caramel color
  
  // Category colors (for visual distinction)
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
  cancelled: '#D32F2F'
};

// Color utilities
export const colorUtils = {
  // Add alpha to hex color
  hexToRGBA: (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Lighten color
  lighten: (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  },
  
  // Darken color
  darken: (hex, percent) => {
    return colorUtils.lighten(hex, -percent);
  }
};

export default colors;