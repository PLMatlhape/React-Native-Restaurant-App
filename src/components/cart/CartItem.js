import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../utils/constants';
import { helpers } from '../../utils/helpers';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.cartItemId, item.quantity + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🍴</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={() => onRemove(item.cartItemId)} style={styles.removeButton}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Customizations */}
        {item.customizations && (
          <View style={styles.customizations}>
            {item.customizations.size && (
              <Text style={styles.customText}>• {item.customizations.size.name}</Text>
            )}
            {item.customizations.milk && item.customizations.milk.price > 0 && (
              <Text style={styles.customText}>• {item.customizations.milk.name}</Text>
            )}
            {item.customizations.extras && item.customizations.extras.length > 0 && (
              <Text style={styles.customText}>
                • {item.customizations.extras.map(e => e.name).join(', ')}
              </Text>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>{helpers.formatCurrency(item.totalPrice)}</Text>

          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrement}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrement}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtotal}>
          Subtotal: {helpers.formatCurrency(item.totalPrice * item.quantity)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 30,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  removeText: {
    fontSize: 18,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  customizations: {
    marginBottom: 8,
  },
  customText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default CartItem;