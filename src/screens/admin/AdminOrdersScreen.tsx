// Admin Orders Screen - manage all customer orders
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { notificationService } from "../../services/local/notificationService";
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

type FilterTab = "all" | "pending" | "active" | "completed";

const STATUS_INFO: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bg: string;
    icon?: string;
    iconAsset?: any;
    iconTint?: string;
  }
> = {
  pending: { label: "Pending", color: "#E65100", bg: "#FFF3E0", icon: "⏳" },
  confirmed: {
    label: "Confirmed",
    color: "#1565C0",
    bg: "#E3F2FD",
    iconAsset: require("../../../assets/icon/icons8-done-50.png"),
    iconTint: "#1565C0",
  },
  preparing: {
    label: "Preparing",
    color: "#EF6C00",
    bg: "#FFF3E0",
    icon: "👨‍🍳",
  },
  ready: { label: "Ready", color: "#2E7D32", bg: "#E8F5E9", icon: "📦" },
  delivered: {
    label: "Delivered",
    color: "#1B5E20",
    bg: "#E8F5E9",
    iconAsset: require("../../../assets/icon/icons8-motorcycle-delivery-single-box-50.png"),
  },
  cancelled: {
    label: "Cancelled",
    color: "#C62828",
    bg: "#FFEBEE",
    icon: "❌",
  },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Accept Order",
  confirmed: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Delivered",
};

const FILTER_TABS: { key: FilterTab; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "📋" },
  { key: "pending", label: "Pending", icon: "⏳" },
  { key: "active", label: "Active", icon: "🔥" },
  { key: "completed", label: "Done", icon: "✅" },
];

const AdminOrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const ordersListRef = useRef<FlatList<Order> | null>(null);

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
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refresh when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation, fetchOrders]);

  useEffect(() => {
    requestAnimationFrame(() => {
      ordersListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [activeTab]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "pending":
        return order.status === "pending";
      case "active":
        return ["confirmed", "preparing", "ready"].includes(order.status);
      case "completed":
        return ["delivered", "cancelled"].includes(order.status);
      default:
        return true;
    }
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    active: orders.filter((o) =>
      ["confirmed", "preparing", "ready"].includes(o.status),
    ).length,
    completed: orders.filter((o) =>
      ["delivered", "cancelled"].includes(o.status),
    ).length,
  };

  const handleAdvance = async (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = NEXT_STATUS[currentStatus];
    if (!nextStatus) return;

    const success = await orderService.updateOrderStatus(orderId, nextStatus);
    if (success) {
      // Find the order to get total for notification
      const order = orders.find((o) => o.id === orderId);
      // Send push notification to user
      await notificationService.sendOrderStatusNotification(
        orderId,
        nextStatus,
        order?.total,
      );
      fetchOrders();
    } else {
      Alert.alert("Error", "Failed to update order status.");
    }
  };

  const handleReject = (orderId: string) => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          const success = await orderService.updateOrderStatus(
            orderId,
            "cancelled",
          );
          if (success) {
            // Find the order to get total for notification
            const order = orders.find((o) => o.id === orderId);
            // Send push notification to user
            await notificationService.sendOrderStatusNotification(
              orderId,
              "cancelled",
              order?.total,
            );
            fetchOrders();
          } else {
            Alert.alert("Error", "Failed to reject order.");
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOrder = ({ item: order }: { item: Order }) => {
    const info = STATUS_INFO[order.status] || STATUS_INFO.pending;
    const nextLabel = NEXT_LABEL[order.status];
    const canAdvance = !!nextLabel;
    const canReject =
      order.status === "pending" || order.status === "confirmed";
    const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.orderMeta}>
              {formatDate(order.createdAt)} · {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: info.bg }]}>
            {info.iconAsset ? (
              <Image
                source={info.iconAsset}
                style={[
                  styles.statusIconImg,
                  info.iconTint ? { tintColor: info.iconTint } : undefined,
                ]}
              />
            ) : (
              <Text style={styles.statusIcon}>{info.icon}</Text>
            )}
            <Text style={[styles.statusText, { color: info.color }]}>
              {info.label}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerRow}>
          <View style={styles.customerInfo}>
            <Image
              source={require("../../../assets/icon/icons8-user-50.png")}
              style={styles.customerIconImg}
            />
            <Text style={styles.customerName} numberOfLines={1}>
              {order.userName || "Guest"}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Image
              source={require("../../../assets/icon/icons8-location-50.png")}
              style={styles.customerIconImg}
            />
            <Text style={styles.customerAddress} numberOfLines={1}>
              {order.deliveryAddress}
            </Text>
          </View>
        </View>

        {/* Items - tap to expand details */}
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
                    <Text style={styles.itemQty}>{item.quantity}x</Text>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>
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
          <View style={styles.itemsList}>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemQty}>{item.quantity}x</Text>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  R{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.orderFooter}>
          <View style={styles.paymentBadge}>
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
            <Text style={styles.paymentLabel}>
              {order.paymentMethod === "card" ? "Card" : "Cash"}
            </Text>
          </View>
          <Text style={styles.orderTotal}>R{order.total.toFixed(2)}</Text>
        </View>

        {/* Action Buttons */}
        {(canAdvance || canReject) && (
          <View style={styles.actions}>
            {canReject && (
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleReject(order.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
            )}
            {canAdvance && (
              <TouchableOpacity
                style={styles.advanceBtn}
                onPress={() => handleAdvance(order.id, order.status)}
                activeOpacity={0.7}
              >
                <Text style={styles.advanceBtnText}>{nextLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Image
          source={require("../../../assets/icon/icons8-list-50 (1).png")}
          style={{ width: 50, height: 50, tintColor: COLORS.primary }}
        />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#FFF3E0" }]}>
          <Text style={[styles.statCount, { color: "#E65100" }]}>
            {counts.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#E3F2FD" }]}>
          <Text style={[styles.statCount, { color: "#1565C0" }]}>
            {counts.active}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#E8F5E9" }]}>
          <Text style={[styles.statCount, { color: "#2E7D32" }]}>
            {counts.completed}
          </Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key];
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
              {count > 0 && (
                <View
                  style={[styles.tabBadge, isActive && styles.tabBadgeActive]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.tabBadgeText,
                      isActive && styles.tabBadgeTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Orders List */}
      <FlatList
        ref={ordersListRef}
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<View style={styles.listTopSpacer} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Image
              source={require("../../../assets/icon/icons8-mail-box-66.png")}
              style={styles.emptyIconImg}
            />
            <Text style={styles.emptyTitle}>No orders</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "all"
                ? "No orders have been placed yet"
                : `No ${activeTab} orders right now`}
            </Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textLight,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statCount: {
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "600",
    marginTop: 2,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    marginBottom: 4,
    gap: 8,
    alignItems: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 36,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabBadge: {
    marginLeft: 6,
    backgroundColor: COLORS.border,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.text,
  },
  tabBadgeTextActive: {
    color: COLORS.white,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  listTopSpacer: {
    height: 8,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  orderMeta: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  statusIconImg: {
    width: 14,
    height: 14,
    marginRight: 4,
    resizeMode: "contain",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  customerRow: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerIcon: {
    fontSize: 13,
    marginRight: 8,
    width: 20,
  },
  customerName: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
    flex: 1,
  },
  customerAddress: {
    fontSize: 13,
    color: COLORS.textLight,
    flex: 1,
  },
  itemsList: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
  },
  itemQty: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    width: 28,
  },
  itemName: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paymentLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C62828",
  },
  advanceBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  advanceBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyIconImg: {
    width: 60,
    height: 60,
    tintColor: COLORS.textLight,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  customerIconImg: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: COLORS.textLight,
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
  paymentIconImg: {
    width: 18,
    height: 18,
  },
});

export default AdminOrdersScreen;
