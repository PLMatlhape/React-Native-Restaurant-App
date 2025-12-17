import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firebase/firestoreService';
import { COLORS, ORDER_STATUS } from '../../utils/constants';

const OrderHistoryScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const result = await firestoreService.getUserOrders(user.uid);
    if (result.success) {
      setOrders(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return COLORS.warning;
      case ORDER_STATUS.CONFIRMED:
      case ORDER_STATUS.PREPARING:
        return COLORS.primary;
      case ORDER_STATUS.READY:
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return '#2196F3';
      case ORDER_STATUS.DELIVERED:
        return COLORS.success;
      case ORDER_STATUS.CANCELLED:
        return COLORS.error;
      default:
        return COLORS.textLight;
    }
  };

  const getStatusText = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>

      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.deliveryText}>
          Delivery to: {item.deliveryAddress}
        </Text>
        <Text style={styles.totalText}>R{item.total.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>No orders yet</Text>
        <Text style={styles.emptySubtext}>Start ordering to see your history here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  orderItems: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  deliveryText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'right',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default OrderHistoryScreen;