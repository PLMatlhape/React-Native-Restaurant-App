import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { COLORS } from '../../utils/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const buttonStyles: ViewStyle[] = [styles.button];

    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        buttonStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        buttonStyles.push(styles.outlineButton);
        break;
      case 'danger':
        buttonStyles.push(styles.dangerButton);
        break;
      default:
        buttonStyles.push(styles.primaryButton);
    }

    // Size styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.smallButton);
        break;
      case 'large':
        buttonStyles.push(styles.largeButton);
        break;
      default:
        buttonStyles.push(styles.mediumButton);
    }

    // State styles
    if (disabled || loading) {
      buttonStyles.push(styles.disabledButton);
    }

    if (fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }

    return buttonStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const textStyles: TextStyle[] = [styles.buttonText];

    switch (variant) {
      case 'primary':
        textStyles.push(styles.primaryText);
        break;
      case 'secondary':
        textStyles.push(styles.secondaryText);
        break;
      case 'outline':
        textStyles.push(styles.outlineText);
        break;
      case 'danger':
        textStyles.push(styles.dangerText);
        break;
    }

    switch (size) {
      case 'small':
        textStyles.push(styles.smallText);
        break;
      case 'large':
        textStyles.push(styles.largeText);
        break;
    }

    return textStyles;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.white} />
      ) : (
        <>
          {icon && icon}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },

  // Variant styles
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },

  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },

  // Text styles
  buttonText: {
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 16,
  },
  secondaryText: {
    color: COLORS.text,
    fontSize: 16,
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  dangerText: {
    color: COLORS.white,
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },

  // State styles
  disabledButton: {
    opacity: 0.5,
  },
});

export default Button;
