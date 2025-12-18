import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { helpers } from '../../utils/helpers';

const CartSummary = ({ subtotal, deliveryFee = 0, discount = 0, style }) => {
  const total = subtotal + deliveryFee - discount;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{helpers.formatCurrency(subtotal)}</Text>
      </View>

      {deliveryFee > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.value}>{helpers.formatCurrency(deliveryFee)}</Text>
        </View>
      )}

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, styles.discountLabel]}>Discount</Text>
          <Text style={[styles.value, styles.discountValue]}>
            -{helpers.formatCurrency(discount)}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{helpers.formatCurrency(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  discountLabel: {
    color: COLORS.success,
  },
  discountValue: {
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
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
});

export default CartSummary;