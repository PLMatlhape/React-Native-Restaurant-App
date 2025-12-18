import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SCREEN_NAMES } from '../../utils/constants';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You need to login to place an order',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Auth') }
        ]
      );
      return;
    }

    navigation.navigate(SCREEN_NAMES.CHECKOUT);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearCart() }
      ]
    );
  };

  const handleRemoveItem = (cartItemId, itemName) => {
    Alert.alert(
      'Remove Item',
      `Remove ${itemName} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(cartItemId) }
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImage}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🖼️</Text>
          </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        
        {/* Customizations */}
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
          {item.customizations.sides && item.customizations.sides.length > 0 && (
            <Text style={styles.customText}>
              • {item.customizations.sides.map(s => s.name).join(', ')}
            </Text>
          )}
        </View>

        <Text style={styles.itemPrice}>
          R{item.totalPrice.toFixed(2)} each
        </Text>

        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.cartItemId, item.name)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>
          Subtotal: R{(item.totalPrice * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate(SCREEN_NAMES.HOME)}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.cartItemId}
        contentContainerStyle={styles.list}
      />

      {/* Bottom Summary */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>R{getCartTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 10,
  },
  cartItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 30,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  customizations: {
    marginBottom: 8,
  },
  customText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 25,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  removeButtonText: {
    fontSize: 20,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;