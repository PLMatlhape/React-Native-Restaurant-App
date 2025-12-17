import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firebase/firestoreService';
import { COLORS } from '../../utils/constants';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, userData } = useAuth();
  
  const [deliveryAddress, setDeliveryAddress] = useState(userData?.address || '');
  const [selectedCard, setSelectedCard] = useState(userData?.cardDetails?.cardNumber || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 25;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please provide a delivery address');
      return;
    }

    if (!selectedCard.trim()) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Total: R${total.toFixed(2)}\n\nPlace this order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: async () => {
            setLoading(true);

            const orderData = {
              userId: user.uid,
              userInfo: {
                name: userData.name,
                surname: userData.surname,
                email: userData.email,
                contactNumber: userData.contactNumber
              },
              items: cartItems.map(item => ({
                itemId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.totalPrice,
                customizations: item.customizations
              })),
              deliveryAddress: deliveryAddress,
              specialInstructions: specialInstructions,
              subtotal: subtotal,
              deliveryFee: deliveryFee,
              total: total,
              paymentMethod: selectedCard,
              status: 'pending'
            };

            const result = await firestoreService.createOrder(orderData);
            setLoading(false);

            if (result.success) {
              clearCart();
              Alert.alert(
                'Order Placed!',
                'Your order has been placed successfully. You can track it in Order History.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home')
                  }
                ]
              );
            } else {
              Alert.alert('Error', 'Failed to place order. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter delivery address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
            numberOfLines={3}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Card: **** **** **** {selectedCard.slice(-4)}
            </Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Any special requests?"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {cartItems.map((item, index) => (
              <View key={index} style={styles.summaryItem}>
                <Text style={styles.summaryItemText}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  R{(item.totalPrice * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R{subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>R{deliveryFee.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    color: COLORS.text,
  },
  changeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryItemText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CheckoutScreen;