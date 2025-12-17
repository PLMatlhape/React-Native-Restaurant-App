import { Platform } from 'react-native';
import colors from './colors';

// Font families
export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System'
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System'
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System'
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
    default: 'System'
  })
};

// Font sizes
export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
  hero: 40
};

// Font weights
export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800'
};

// Line heights
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2
};

// Typography styles
export const typography = {
  // Display styles
  hero: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.hero * lineHeight.tight,
    color: colors.text,
    letterSpacing: -0.5
  },
  
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
    color: colors.text,
    letterSpacing: -0.5
  },

  // Heading styles
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
    color: colors.text,
    letterSpacing: -0.3
  },

  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
    color: colors.text,
    letterSpacing: -0.2
  },

  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xl * lineHeight.normal,
    color: colors.text
  },

  h4: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.lg * lineHeight.normal,
    color: colors.text
  },

  h5: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.md * lineHeight.normal,
    color: colors.text
  },

  h6: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.base * lineHeight.normal,
    color: colors.text
  },

  // Body text styles
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.relaxed,
    color: colors.text
  },

  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.relaxed,
    color: colors.text
  },

  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.base * lineHeight.normal,
    color: colors.text
  },

  // Label styles
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.normal,
    color: colors.textLight
  },

  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.textLight
  },

  // Caption styles
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.textSecondary
  },

  captionSmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
    color: colors.textSecondary
  },

  // Button text styles
  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.md * lineHeight.tight,
    textTransform: 'none',
    letterSpacing: 0.5
  },

  buttonSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.base * lineHeight.tight,
    textTransform: 'none',
    letterSpacing: 0.5
  },

  buttonLarge: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * lineHeight.tight,
    textTransform: 'none',
    letterSpacing: 0.5
  },

  // Link styles
  link: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.md * lineHeight.normal,
    color: colors.primary,
    textDecorationLine: 'underline'
  },

  // Overline style
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },

  // Price styles
  priceRegular: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.md * lineHeight.tight,
    color: colors.primary
  },

  priceLarge: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xl * lineHeight.tight,
    color: colors.primary
  },

  // Error text
  error: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.error
  },

  // Success text
  success: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.success
  },

  // Warning text
  warning: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.warning
  }
};

// Text utility functions
export const textUtils = {
  // Apply multiple text styles
  combine: (...styles) => {
    return Object.assign({}, ...styles);
  },

  // Text with color
  withColor: (style, color) => {
    return { ...style, color };
  },

  // Text with weight
  withWeight: (style, weight) => {
    return { ...style, fontWeight: weight };
  },

  // Text with size
  withSize: (style, size) => {
    return { ...style, fontSize: size };
  },

  // Centered text
  centered: (style) => {
    return { ...style, textAlign: 'center' };
  },

  // Uppercase text
  uppercase: (style) => {
    return { ...style, textTransform: 'uppercase' };
  },

  // Italic text
  italic: (style) => {
    return { ...style, fontStyle: 'italic' };
  }
};

export default typography;