// Admin Analytics Screen - Purchase stats, charts, and insights
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Order,
    orderService
} from "../../services/local/orderService";
import { COLORS } from "../../utils/constants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ============================================
// TYPES
// ============================================

type TimePeriod = "today" | "week" | "month" | "all";

interface DailySales {
  label: string;
  revenue: number;
  orders: number;
}

interface CategorySales {
  category: string;
  revenue: number;
  count: number;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getStartOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDayLabel = (date: Date): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

const getMonthLabel = (date: Date): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[date.getMonth()];
};

const filterOrdersByPeriod = (orders: Order[], period: TimePeriod): Order[] => {
  if (period === "all") return orders;

  const now = new Date();
  const start = getStartOfDay(now);

  if (period === "today") {
    return orders.filter((o) => new Date(o.createdAt) >= start);
  }

  if (period === "week") {
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() - 7);
    return orders.filter((o) => new Date(o.createdAt) >= weekStart);
  }

  if (period === "month") {
    const monthStart = new Date(start);
    monthStart.setDate(monthStart.getDate() - 30);
    return orders.filter((o) => new Date(o.createdAt) >= monthStart);
  }

  return orders;
};

// ============================================
// SIMPLE BAR CHART COMPONENT
// ============================================

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxBarHeight?: number;
  barWidth?: number;
  showValues?: boolean;
  valuePrefix?: string;
}

const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  maxBarHeight = 120,
  barWidth,
  showValues = true,
  valuePrefix = "",
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const calculatedBarWidth =
    barWidth ||
    Math.min(40, (SCREEN_WIDTH - 80 - data.length * 6) / data.length);

  return (
    <View style={chartStyles.barChartContainer}>
      <View style={chartStyles.barsRow}>
        {data.map((item, index) => {
          const barHeight = Math.max(4, (item.value / maxValue) * maxBarHeight);
          return (
            <View key={index} style={chartStyles.barColumn}>
              {showValues && item.value > 0 && (
                <Text style={chartStyles.barValue} numberOfLines={1}>
                  {valuePrefix}
                  {item.value >= 1000
                    ? `${(item.value / 1000).toFixed(1)}k`
                    : item.value % 1 === 0
                      ? item.value
                      : item.value.toFixed(0)}
                </Text>
              )}
              <View
                style={[
                  chartStyles.bar,
                  {
                    height: barHeight,
                    width: calculatedBarWidth,
                    backgroundColor: item.color || COLORS.primary,
                  },
                ]}
              />
              <Text style={chartStyles.barLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ============================================
// DONUT/PIE SEGMENT (simple horizontal bar alternative)
// ============================================

interface SegmentBarProps {
  segments: { label: string; value: number; color: string }[];
}

const SegmentBar: React.FC<SegmentBarProps> = ({ segments }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <View style={chartStyles.segmentBarEmpty}>
        <Text style={chartStyles.segmentBarEmptyText}>No data</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={chartStyles.segmentBarTrack}>
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          if (pct === 0) return null;
          return (
            <View
              key={i}
              style={[
                chartStyles.segmentBarFill,
                {
                  width: `${pct}%` as any,
                  backgroundColor: seg.color,
                  borderTopLeftRadius: i === 0 ? 6 : 0,
                  borderBottomLeftRadius: i === 0 ? 6 : 0,
                  borderTopRightRadius: i === segments.length - 1 ? 6 : 0,
                  borderBottomRightRadius: i === segments.length - 1 ? 6 : 0,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={chartStyles.segmentLegend}>
        {segments.map((seg, i) => (
          <View key={i} style={chartStyles.legendItem}>
            <View
              style={[chartStyles.legendDot, { backgroundColor: seg.color }]}
            />
            <Text style={chartStyles.legendLabel}>
              {seg.label} ({((seg.value / total) * 100).toFixed(0)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const AdminAnalyticsScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<TimePeriod>("all");

  const fetchOrders = useCallback(async () => {
    try {
      const all = await orderService.getAllOrders();
      setOrders(all);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  // ---- COMPUTED DATA ----
  const filtered = filterOrdersByPeriod(orders, period);
  const completed = filtered.filter((o) => o.status !== "cancelled");
  const delivered = filtered.filter((o) => o.status === "delivered");
  const cancelled = filtered.filter((o) => o.status === "cancelled");

  const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filtered.length;
  const avgOrderValue =
    delivered.length > 0 ? totalRevenue / delivered.length : 0;
  const deliveryRate =
    totalOrders > 0 ? ((delivered.length / totalOrders) * 100).toFixed(0) : "0";

  // ---- ORDER STATUS DISTRIBUTION ----
  const statusCounts: Record<string, number> = {};
  filtered.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  const statusColors: Record<string, string> = {
    pending: "#FF9800",
    confirmed: "#2196F3",
    preparing: "#FF5722",
    ready: "#4CAF50",
    delivered: "#388E3C",
    cancelled: "#D32F2F",
  };

  const statusSegments = Object.entries(statusCounts).map(
    ([status, count]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status] || COLORS.textLight,
    }),
  );

  // ---- DAILY SALES (last 7 days) ----
  const dailySales: DailySales[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = getStartOfDay(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayOrders = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= dayStart && d < dayEnd && o.status === "delivered";
    });

    dailySales.push({
      label: i === 0 ? "Today" : getDayLabel(date),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // ---- POPULAR ITEMS ----
  const itemMap = new Map<string, TopItem>();
  completed.forEach((order) => {
    order.items.forEach((item) => {
      const existing = itemMap.get(item.name);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        itemMap.set(item.name, {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
    });
  });
  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // ---- CATEGORY BREAKDOWN ----
  const catMap = new Map<string, CategorySales>();
  completed.forEach((order) => {
    order.items.forEach((item) => {
      // Try to extract category from item or use "Other"
      const cat = "Menu Item";
      const existing = catMap.get(item.name);
      if (existing) {
        existing.revenue += item.price * item.quantity;
        existing.count += item.quantity;
      } else {
        catMap.set(item.name, {
          category: item.name,
          revenue: item.price * item.quantity,
          count: item.quantity,
        });
      }
    });
  });
  const categoryBreakdown = Array.from(catMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const catColors = [
    "#6F4E37",
    "#D2B48C",
    "#8B4513",
    "#A1887F",
    "#795548",
    "#BCAAA4",
  ];

  // ---- PAYMENT METHOD SPLIT ----
  const cardOrders = completed.filter((o) => o.paymentMethod === "card").length;
  const cashOrders = completed.filter((o) => o.paymentMethod === "cash").length;

  // ---- HOURLY DISTRIBUTION ----
  const hourlyMap: number[] = new Array(24).fill(0);
  filtered.forEach((o) => {
    const hour = new Date(o.createdAt).getHours();
    hourlyMap[hour]++;
  });
  // Show only hours with data or common business hours (6am-10pm)
  const hourlyData: { label: string; value: number; color: string }[] = [];
  for (let h = 6; h <= 22; h += 2) {
    const count = hourlyMap[h] + (hourlyMap[h + 1] || 0);
    hourlyData.push({
      label: `${h > 12 ? h - 12 : h}${h >= 12 ? "p" : "a"}`,
      value: count,
      color: count > 0 ? COLORS.primary : COLORS.border,
    });
  }

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Period Selector */}
      <View style={styles.periodRow}>
        {(
          [
            { key: "today", label: "Today" },
            { key: "week", label: "7 Days" },
            { key: "month", label: "30 Days" },
            { key: "all", label: "All Time" },
          ] as { key: TimePeriod; label: string }[]
        ).map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.periodChip,
              period === p.key && styles.periodChipActive,
            ]}
            onPress={() => setPeriod(p.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodChipText,
                period === p.key && styles.periodChipTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.kpiLabel}>Revenue</Text>
          <Text style={[styles.kpiValue, { color: COLORS.success }]}>
            R{totalRevenue.toFixed(2)}
          </Text>
          <Text style={styles.kpiSub}>{delivered.length} delivered</Text>
        </View>
        <View style={[styles.kpiCard, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.kpiLabel}>Orders</Text>
          <Text style={[styles.kpiValue, { color: COLORS.primary }]}>
            {totalOrders}
          </Text>
          <Text style={styles.kpiSub}>{cancelled.length} cancelled</Text>
        </View>
      </View>
      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { borderLeftColor: COLORS.warning }]}>
          <Text style={styles.kpiLabel}>Avg Order</Text>
          <Text style={[styles.kpiValue, { color: COLORS.warning }]}>
            R{avgOrderValue.toFixed(2)}
          </Text>
          <Text style={styles.kpiSub}>per delivery</Text>
        </View>
        <View style={[styles.kpiCard, { borderLeftColor: "#2196F3" }]}>
          <Text style={styles.kpiLabel}>Completion</Text>
          <Text style={[styles.kpiValue, { color: "#2196F3" }]}>
            {deliveryRate}%
          </Text>
          <Text style={styles.kpiSub}>delivery rate</Text>
        </View>
      </View>

      {/* Revenue Chart (7 days) */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue (Last 7 Days)</Text>
        <Text style={styles.chartSubtitle}>Daily delivered order totals</Text>
        {dailySales.some((d) => d.revenue > 0) ? (
          <SimpleBarChart
            data={dailySales.map((d) => ({
              label: d.label,
              value: d.revenue,
              color: COLORS.primary,
            }))}
            maxBarHeight={100}
            showValues
            valuePrefix="R"
          />
        ) : (
          <View style={styles.noDataBox}>
            <Text style={styles.noDataText}>
              No delivered orders in the last 7 days
            </Text>
          </View>
        )}
      </View>

      {/* Order Volume Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Order Volume (Last 7 Days)</Text>
        <Text style={styles.chartSubtitle}>Number of orders per day</Text>
        {dailySales.some((d) => d.orders > 0) ? (
          <SimpleBarChart
            data={dailySales.map((d) => ({
              label: d.label,
              value: d.orders,
              color: COLORS.accent,
            }))}
            maxBarHeight={80}
            showValues
          />
        ) : (
          <View style={styles.noDataBox}>
            <Text style={styles.noDataText}>No orders in the last 7 days</Text>
          </View>
        )}
      </View>

      {/* Order Status Distribution */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Order Status</Text>
        <Text style={styles.chartSubtitle}>Current status distribution</Text>
        {statusSegments.length > 0 ? (
          <SegmentBar segments={statusSegments} />
        ) : (
          <View style={styles.noDataBox}>
            <Text style={styles.noDataText}>No orders yet</Text>
          </View>
        )}
      </View>

      {/* Peak Hours */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Peak Hours</Text>
        <Text style={styles.chartSubtitle}>When customers order the most</Text>
        {hourlyData.some((d) => d.value > 0) ? (
          <SimpleBarChart data={hourlyData} maxBarHeight={70} showValues />
        ) : (
          <View style={styles.noDataBox}>
            <Text style={styles.noDataText}>No hourly data available</Text>
          </View>
        )}
      </View>

      {/* Payment Methods */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Payment Methods</Text>
        <SegmentBar
          segments={[
            { label: "Card", value: cardOrders, color: "#2196F3" },
            { label: "Cash", value: cashOrders, color: "#FF9800" },
          ]}
        />
        <View style={styles.paymentStats}>
          <View style={styles.paymentStatItem}>
            <Image
              source={require("../../../assets/icon/icons8-card-64.png")}
              style={styles.paymentIcon}
            />
            <Text style={styles.paymentStatLabel}>Card</Text>
            <Text style={styles.paymentStatValue}>{cardOrders}</Text>
          </View>
          <View style={styles.paymentStatDivider} />
          <View style={styles.paymentStatItem}>
            <Image
              source={require("../../../assets/icon/icons8-cash-64.png")}
              style={styles.paymentIcon}
            />
            <Text style={styles.paymentStatLabel}>Cash</Text>
            <Text style={styles.paymentStatValue}>{cashOrders}</Text>
          </View>
        </View>
      </View>

      {/* Top Selling Items */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Top Selling Items</Text>
        <Text style={styles.chartSubtitle}>By quantity ordered</Text>
        {topItems.length > 0 ? (
          <View>
            {topItems.map((item, index) => {
              const maxQty = topItems[0].quantity;
              const pct = (item.quantity / maxQty) * 100;
              return (
                <View key={index} style={styles.topItemRow}>
                  <View style={styles.topItemRank}>
                    <Text style={styles.topItemRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topItemInfo}>
                    <Text style={styles.topItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.topItemBarTrack}>
                      <View
                        style={[
                          styles.topItemBarFill,
                          {
                            width: `${pct}%` as any,
                            backgroundColor:
                              index === 0
                                ? COLORS.primary
                                : index === 1
                                  ? COLORS.secondary
                                  : COLORS.border,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.topItemStats}>
                    <Text style={styles.topItemQty}>×{item.quantity}</Text>
                    <Text style={styles.topItemRevenue}>
                      R{item.revenue.toFixed(0)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.noDataBox}>
            <Text style={styles.noDataText}>No items sold yet</Text>
          </View>
        )}
      </View>

      {/* Revenue by Item */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue by Item</Text>
        <Text style={styles.chartSubtitle}>Top earners</Text>
        {categoryBreakdown.length > 0 ? (
          <SimpleBarChart
            data={categoryBreakdown.map((c, i) => ({
              label:
                c.category.length > 8
                  ? c.category.slice(0, 7) + "…"
                  : c.category,
              value: c.revenue,
              color: catColors[i % catColors.length],
            }))}
            maxBarHeight={100}
            showValues
            valuePrefix="R"
          />
        ) : (
          <View style={styles.noDataBox}>
            <Text style={styles.noDataText}>No revenue data</Text>
          </View>
        )}
      </View>

      {/* Quick Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Quick Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items Sold</Text>
          <Text style={styles.summaryValue}>
            {completed.reduce(
              (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
              0,
            )}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Delivery Fees</Text>
          <Text style={styles.summaryValue}>
            R{delivered.reduce((sum, o) => sum + o.deliveryFee, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Highest Order</Text>
          <Text style={styles.summaryValue}>
            R
            {filtered.length > 0
              ? Math.max(...filtered.map((o) => o.total)).toFixed(2)
              : "0.00"}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Unique Customers</Text>
          <Text style={styles.summaryValue}>
            {new Set(filtered.map((o) => o.userId)).size}
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textLight,
  },

  // Period Selector
  periodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 8,
  },
  periodChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  periodChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  periodChipTextActive: {
    color: COLORS.white,
  },

  // KPI Cards
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  kpiLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  kpiSub: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // Chart Card
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  chartSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 14,
  },

  // No data
  noDataBox: {
    paddingVertical: 24,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontStyle: "italic",
  },

  // Payment
  paymentStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  paymentStatItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  paymentIcon: {
    width: 28,
    height: 28,
    tintColor: COLORS.textLight,
  },
  paymentStatLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  paymentStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  paymentStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.divider,
  },

  // Top Items
  topItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  topItemRank: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  topItemRankText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  topItemBarTrack: {
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    overflow: "hidden",
  },
  topItemBarFill: {
    height: 6,
    borderRadius: 3,
  },
  topItemStats: {
    alignItems: "flex-end",
  },
  topItemQty: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  topItemRevenue: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  // Summary
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});

const chartStyles = StyleSheet.create({
  barChartContainer: {
    paddingTop: 8,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minWidth: 16,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 6,
    fontWeight: "500",
  },

  // Segment bar
  segmentBarTrack: {
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    overflow: "hidden",
  },
  segmentBarFill: {
    height: 14,
  },
  segmentBarEmpty: {
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  segmentBarEmptyText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  segmentLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
  },
});

export default AdminAnalyticsScreen;
