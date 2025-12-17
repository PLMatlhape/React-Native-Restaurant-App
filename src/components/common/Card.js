import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../../utils/constants';

const Card = ({
  children,
  style,
  onPress,
  variant = 'elevated', // elevated, flat, outlined
  padding = 'medium', // none, small, medium, large
  shadow = true
}) => {
  const getCardStyle = () => {
    let cardStyles = [styles.card];

    // Variant styles
    switch (variant) {
      case 'elevated':
        cardStyles.push(styles.elevatedCard);
        if (shadow) cardStyles.push(styles.shadowCard);
        break;
      case 'flat':
        cardStyles.push(styles.flatCard);
        break;
      case 'outlined':
        cardStyles.push(styles.outlinedCard);
        break;
    }

    // Padding styles
    switch (padding) {
      case 'none':
        cardStyles.push(styles.noPadding);
        break;
      case 'small':
        cardStyles.push(styles.smallPadding);
        break;
      case 'medium':
        cardStyles.push(styles.mediumPadding);
        break;
      case 'large':
        cardStyles.push(styles.largePadding);
        break;
    }

    return cardStyles;
  };

  const CardContent = (
    <View style={[...getCardStyle(), style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },

  // Variant styles
  elevatedCard: {
    backgroundColor: COLORS.white,
  },
  flatCard: {
    backgroundColor: COLORS.white,
  },
  outlinedCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Shadow styles
  shadowCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  // Padding styles
  noPadding: {
    padding: 0,
  },
  smallPadding: {
    padding: 8,
  },
  mediumPadding: {
    padding: 15,
  },
  largePadding: {
    padding: 20,
  },
});

export default Card;