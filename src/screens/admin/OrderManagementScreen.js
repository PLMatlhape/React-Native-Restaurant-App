import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { firestoreService } from '../../services/firebase/firestoreService';
import { COLORS, ORDER_STATUS } from '../../utils/constants';
import { helpers } from '../../utils/helpers';

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const result = await firestoreService.getAllOrders();
    if (result.success) {
      // Sort by most recent first
      const sortedOrders = result.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await firestoreService.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      Alert.alert('Success', 'Order status updated successfully');
      setModalVisible(false);
      loadOrders();
    } else {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const getStatusColor = (status) => {
    return helpers.getOrderStatusColor(status);
  };

  const getFilteredOrders = () => {
    if (filterStatus === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === filterStatus);
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => openOrderDetails(item)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
          <Text style={styles.orderDate}>
            {helpers.formatDateTime(item.createdAt)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {helpers.getOrderStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <Text style={styles.customerName}>
          {item.userInfo.name} {item.userInfo.surname}
        </Text>
        <Text style={styles.customerContact}>
          {item.userInfo.contactNumber}
        </Text>
        <Text style={styles.itemCount}>
          {item.items.length} item{item.items.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>
          Total: {helpers.formatCurrency(item.total)}
        </Text>
        <Text style={styles.viewDetails}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (status, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterStatus === status && styles.filterButtonTextActive
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderStatusOption = (status, label) => (
    <TouchableOpacity
      style={[styles.statusOption, { backgroundColor: getStatusColor(status) }]}
      onPress={() => handleStatusChange(selectedOrder.id, status)}
    >
      <Text style={styles.statusOptionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        {renderFilterButton('all', 'All Orders')}
        {renderFilterButton(ORDER_STATUS.PENDING, 'Pending')}
        {renderFilterButton(ORDER_STATUS.CONFIRMED, 'Confirmed')}
        {renderFilterButton(ORDER_STATUS.PREPARING, 'Preparing')}
        {renderFilterButton(ORDER_STATUS.READY, 'Ready')}
        {renderFilterButton(ORDER_STATUS.OUT_FOR_DELIVERY, 'Out for Delivery')}
        {renderFilterButton(ORDER_STATUS.DELIVERED, 'Delivered')}
      </ScrollView>

      {/* Orders List */}
      <FlatList
        data={getFilteredOrders()}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>
              {loading ? 'Loading orders...' : 'No orders found'}
            </Text>
          </View>
        }
      />

      {/* Order Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedOrder && (
                <>
                  <Text style={styles.modalTitle}>
                    Order #{selectedOrder.id.slice(-6)}
                  </Text>

                  {/* Customer Info */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Information</Text>
                    <Text style={styles.infoText}>
                      {selectedOrder.userInfo.name} {selectedOrder.userInfo.surname}
                    </Text>
                    <Text style={styles.infoText}>
                      {selectedOrder.userInfo.email}
                    </Text>
                    <Text style={styles.infoText}>
                      {selectedOrder.userInfo.contactNumber}
                    </Text>
                  </View>

                  {/* Delivery Address */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <Text style={styles.infoText}>
                      {selectedOrder.deliveryAddress}
                    </Text>
                  </View>

                  {/* Order Items */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Items</Text>
                    {selectedOrder.items.map((item, index) => (
                      <View key={index} style={styles.orderItem}>
                        <Text style={styles.orderItemName}>
                          {item.quantity}x {item.name}
                        </Text>
                        <Text style={styles.orderItemPrice}>
                          {helpers.formatCurrency(item.price * item.quantity)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Special Instructions */}
                  {selectedOrder.specialInstructions && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Special Instructions</Text>
                      <Text style={styles.infoText}>
                        {selectedOrder.specialInstructions}
                      </Text>
                    </View>
                  )}

                  {/* Order Summary */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal:</Text>
                      <Text style={styles.summaryValue}>
                        {helpers.formatCurrency(selectedOrder.subtotal)}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Delivery Fee:</Text>
                      <Text style={styles.summaryValue}>
                        {helpers.formatCurrency(selectedOrder.deliveryFee)}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                      <Text style={styles.totalLabel}>Total:</Text>
                      <Text style={styles.totalValue}>
                        {helpers.formatCurrency(selectedOrder.total)}
                      </Text>
                    </View>
                  </View>

                  {/* Update Status */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Update Order Status</Text>
                    <View style={styles.statusOptions}>
                      {renderStatusOption(ORDER_STATUS.PENDING, 'Pending')}
                      {renderStatusOption(ORDER_STATUS.CONFIRMED, 'Confirmed')}
                      {renderStatusOption(ORDER_STATUS.PREPARING, 'Preparing')}
                      {renderStatusOption(ORDER_STATUS.READY, 'Ready')}
                      {renderStatusOption(ORDER_STATUS.OUT_FOR_DELIVERY, 'Out for Delivery')}
                      {renderStatusOption(ORDER_STATUS.DELIVERED, 'Delivered')}
                      {renderStatusOption(ORDER_STATUS.CANCELLED, 'Cancelled')}
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterBar: {
    maxHeight: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterBarContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.white,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textLight,
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
  orderBody: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  viewDetails: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  orderItemName: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    backgroundColor: COLORS.divider,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusOptionText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  closeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderManagementScreen;