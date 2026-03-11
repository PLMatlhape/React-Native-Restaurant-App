// Order History Screen - view past orders and their status
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
    Order,
    orderService,
    OrderStatus,
} from "../../services/local/orderService";
import {
    COFFEE_SIZES,
    COLORS,
    EXTRAS,
    MILK_OPTIONS,
} from "../../utils/constants";

interface OrderHistoryScreenProps {
  navigation: any;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "Pending", color: COLORS.warning, icon: "⏳" },
  confirmed: { label: "Confirmed", color: "#2196F3", icon: "✅" },
  preparing: { label: "Preparing", color: "#FF9800", icon: "👨‍🍳" },
  ready: { label: "Ready", color: "#4CAF50", icon: "📦" },
  delivered: { label: "Delivered", color: COLORS.success, icon: "🎉" },
  cancelled: { label: "Cancelled", color: COLORS.error, icon: "❌" },
};

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const getCustomizationDetails = (customizations: any) => {
    if (!customizations) return null;
    const size = COFFEE_SIZES.find((s) => s.name === customizations.size);
    const milk = MILK_OPTIONS.find((m) => m.name === customizations.milk);
    const extras = (customizations.extras || []).map((eName: string) => {
      const extra = EXTRAS.find((e) => e.name === eName);
      return { name: eName, price: extra?.price || 0 };
    });
    return { size, milk, extras };
  };

  const fetchOrders = useCallback(async () => {
    try {
      if (user?.id) {
        const userOrders = await orderService.getUserOrders(user.id);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refresh when screen is focused (to see updated order statuses)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation, fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const renderOrder = ({ item: order }: { item: Order }) => {
    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusInfo.color + "20" },
            ]}
          >
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
            <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Items - tap to expand */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
          }
        >
          <View style={styles.itemsToggle}>
            <Text style={styles.itemsToggleText}>
              {itemCount} {itemCount === 1 ? "item" : "items"} — tap to{" "}
              {expandedOrderId === order.id ? "collapse" : "view details"}
            </Text>
            <Text style={styles.expandArrow}>
              {expandedOrderId === order.id ? "▲" : "▼"}
            </Text>
          </View>
        </TouchableOpacity>

        {expandedOrderId === order.id ? (
          <View style={styles.expandedItems}>
            {order.items.map((item, index) => {
              const details = getCustomizationDetails(item.customizations);
              return (
                <View key={index} style={styles.expandedItem}>
                  <View style={styles.expandedItemHeader}>
                    <Text style={styles.expandedItemQty}>{item.quantity}x</Text>
                    <Text style={styles.expandedItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.expandedItemPrice}>
                      R{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  {details && (
                    <View style={styles.customizations}>
                      {details.size && (
                        <View style={styles.customRow}>
                          <Text style={styles.customLabel}>
                            Size: {details.size.name}
                          </Text>
                          {details.size.price > 0 && (
                            <Text style={styles.customPrice}>
                              +R{details.size.price}
                            </Text>
                          )}
                        </View>
                      )}
                      {details.milk && (
                        <View style={styles.customRow}>
                          <Text style={styles.customLabel}>
                            Milk: {details.milk.name}
                          </Text>
                          {details.milk.price > 0 && (
                            <Text style={styles.customPrice}>
                              +R{details.milk.price}
                            </Text>
                          )}
                        </View>
                      )}
                      {details.extras.length > 0 &&
                        details.extras.map(
                          (
                            extra: { name: string; price: number },
                            i: number,
                          ) => (
                            <View key={i} style={styles.customRow}>
                              <Text style={styles.customLabel}>
                                + {extra.name}
                              </Text>
                              {extra.price > 0 && (
                                <Text style={styles.customPrice}>
                                  +R{extra.price}
                                </Text>
                              )}
                            </View>
                          ),
                        )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.orderItems}>
            {order.items.slice(0, 3).map((item, index) => (
              <Text key={index} style={styles.orderItemText} numberOfLines={1}>
                {item.quantity}x {item.name}
              </Text>
            ))}
            {order.items.length > 3 && (
              <Text style={styles.moreItems}>
                +{order.items.length - 3} more items
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.orderFooter}>
          <View style={styles.paymentInfo}>
            <Image
              source={
                order.paymentMethod === "card"
                  ? require("../../../assets/icon/icons8-card-64.png")
                  : require("../../../assets/icon/icons8-cash-64.png")
              }
              style={[
                styles.paymentIconImg,
                {
                  tintColor:
                    order.paymentMethod === "card"
                      ? COLORS.primary
                      : COLORS.success,
                },
              ]}
            />
            <Text style={styles.paymentText}>
              {order.paymentMethod === "card" ? "Card" : "Cash"}
            </Text>
          </View>
          <View>
            <Text style={styles.itemCount}>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Text>
            <Text style={styles.orderTotal}>R{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Status Progress Bar */}
        {order.status !== "cancelled" ? (
          <View style={styles.progressBar}>
            {(
              ["confirmed", "preparing", "ready", "delivered"] as OrderStatus[]
            ).map((status, index) => {
              const statusOrder: Record<string, number> = {
                confirmed: 0,
                preparing: 1,
                ready: 2,
                delivered: 3,
                pending: -1,
                cancelled: -1,
              };
              const currentIdx = statusOrder[order.status] ?? -1;
              const stepIdx = statusOrder[status];
              const isActive = stepIdx <= currentIdx;

              return (
                <View key={status} style={styles.progressStep}>
                  <View
                    style={[
                      styles.progressDot,
                      isActive && { backgroundColor: statusInfo.color },
                    ]}
                  />
                  {index < 3 && (
                    <View
                      style={[
                        styles.progressLine,
                        isActive &&
                          stepIdx < currentIdx && {
                            backgroundColor: statusInfo.color,
                          },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.progressBar}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.error,
                fontWeight: "600",
              }}
            >
              This order was cancelled
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ fontSize: 40 }}>☕</Text>
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Your order history will appear here once you place your first
              order.
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate("HomeTab")}
              activeOpacity={0.8}
            >
              <Text style={styles.browseBtnText}>Start Ordering</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  orderItems: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  orderItemText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 3,
  },
  moreItems: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIconImg: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  paymentText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  itemCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "right",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.divider,
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.divider,
    marginHorizontal: 2,
  },
  // Empty
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  browseBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  itemsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 4,
  },
  itemsToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  expandArrow: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  expandedItems: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  expandedItem: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
  },
  expandedItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandedItemQty: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    width: 28,
  },
  expandedItemName: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  expandedItemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  customizations: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.divider,
    paddingLeft: 28,
  },
  customRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  customLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  customPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
});

export default OrderHistoryScreen;
