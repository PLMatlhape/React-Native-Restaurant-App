import { Platform, TextStyle } from 'react-native';
import colors from './colors';

// Font families
export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System'
  }) as string,
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System'
  }) as string,
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System'
  }) as string,
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
    default: 'System'
  }) as string
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
} as const;

// Font weights
export const fontWeight = {
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight']
};

// Line heights
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2
} as const;

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
  } as TextStyle,
  
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
    color: colors.text,
    letterSpacing: -0.5
  } as TextStyle,

  // Heading styles
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
    color: colors.text,
    letterSpacing: -0.3
  } as TextStyle,

  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
    color: colors.text,
    letterSpacing: -0.2
  } as TextStyle,

  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl * lineHeight.tight,
    color: colors.text
  } as TextStyle,

  h4: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * lineHeight.normal,
    color: colors.text
  } as TextStyle,

  // Body styles
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
    color: colors.text
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.base * lineHeight.normal,
    color: colors.text
  } as TextStyle,

  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.relaxed,
    color: colors.text
  } as TextStyle,

  // Caption/Label styles
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.textLight
  } as TextStyle,

  captionSmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
    color: colors.textLight
  } as TextStyle,

  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5
  } as TextStyle,

  // Button text styles
  buttonText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.2
  } as TextStyle,

  buttonTextSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.1
  } as TextStyle,

  // Link styles
  link: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.primary,
    textDecorationLine: 'underline' as const
  } as TextStyle,

  // Price styles
  price: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary
  } as TextStyle,

  priceLarge: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary
  } as TextStyle,

  // Status styles
  badge: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5
  } as TextStyle
};

export default typography;
