import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { firestoreService } from '../../services/firebase/firestoreService';
import { COLORS, SCREEN_NAMES } from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await firestoreService.getAllOrders();
    if (result.success) {
      const ordersData = result.data;
      setOrders(ordersData);
      calculateStats(ordersData);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
    const completedOrders = ordersData.filter(o => o.status === 'delivered').length;

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    });
  };

  const getRevenueData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        revenue: 0
      });
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.date === orderDate);
      if (dayData) {
        dayData.revenue += order.total;
      }
    });

    return {
      labels: last7Days.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en', { weekday: 'short' });
      }),
      datasets: [{
        data: last7Days.map(d => d.revenue)
      }]
    };
  };

  const getOrderStatusData = () => {
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      delivered: 0
    };

    orders.forEach(order => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status]++;
      }
    });

    return {
      labels: ['Pending', 'Confirmed', 'Preparing', 'Delivered'],
      datasets: [{
        data: [
          statusCounts.pending,
          statusCounts.confirmed,
          statusCounts.preparing,
          statusCounts.delivered
        ]
      }]
    };
  };

  const chartConfig = {
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(111, 78, 55, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(62, 39, 35, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: COLORS.primary
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.success }]}>
            <Text style={styles.statValue}>R{stats.totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: COLORS.warning }]}>
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
            <Text style={styles.statValue}>{stats.completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue (Last 7 Days)</Text>
          <LineChart
            data={getRevenueData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Order Status Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Orders by Status</Text>
          <BarChart
            data={getOrderStatusData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.MANAGE_FOOD)}
          >
            <Text style={styles.actionIcon}>🍽️</Text>
            <Text style={styles.actionText}>Manage Menu Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.ORDER_MANAGEMENT)}
          >
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionText}>View All Orders</Text>
          </TouchableOpacity>
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  chart: {
    borderRadius: 12,
  },
  actionsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
});

export default AdminDashboard;