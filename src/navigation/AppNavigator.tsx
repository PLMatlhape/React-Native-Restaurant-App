// Simplified App Navigator - No Firebase, No Admin
// Auth flow → Main tabs (Home, Cart, Orders, Profile)

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { COLORS } from "../utils/constants";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";

// Main Screens
import ProfileScreen from "../screens/auth/ProfileScreen";
import CartScreen from "../screens/cart/CartScreen";
import CheckoutScreen from "../screens/cart/CheckoutScreen";
import PaymentGatewayScreen from "../screens/cart/PaymentGatewayScreen";
import FoodDetailScreen from "../screens/food/FoodDetailScreen";
import HomeScreen from "../screens/food/HomeScreen";
import MenuScreen from "../screens/food/MenuScreen";
import OrderHistoryScreen from "../screens/order/OrderHistoryScreen";

// Admin Screens
import AdminAnalyticsScreen from "../screens/admin/AdminAnalyticsScreen";
import AdminMenuScreen from "../screens/admin/AdminMenuScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";

// Tab Icons
const TAB_ICONS = {
  home: require("../../assets/icon/icons8-coffee-cup-64.png"),
  cart: require("../../assets/icon/icons8-card-64.png"),
  orders: require("../../assets/icon/icons8-list-50 (1).png"),
  profile: require("../../assets/icon/icons8-user-50.png"),
  adminOrders: require("../../assets/icon/icons8-list-50 (1).png"),
  adminMenu: require("../../assets/icon/icons8-restaurant-menu-64.png"),
  analytics: require("../../assets/icon/icons8-done-50.png"),
};

// Components
import Loading from "../components/common/Loading";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================
// STACK NAVIGATORS
// ============================================

const AuthStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const HomeStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Menu"
      component={MenuScreen}
      options={{ title: "Menu" }}
    />
    <Stack.Screen
      name="FoodDetail"
      component={FoodDetailScreen as React.ComponentType<any>}
      options={{ title: "Details" }}
    />
  </Stack.Navigator>
);

const CartStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{ title: "My Cart" }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ title: "Checkout" }}
    />
    <Stack.Screen
      name="PaymentGateway"
      component={PaymentGatewayScreen as React.ComponentType<any>}
      options={{
        title: "Payment",
        headerLeft: () => null,
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

const OrdersStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="OrderHistory"
      component={OrderHistoryScreen}
      options={{ title: "My Orders" }}
    />
  </Stack.Navigator>
);

const ProfileStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: "My Profile" }}
    />
  </Stack.Navigator>
);

// ============================================
// TAB BAR ICON WITH BADGE
// ============================================

interface TabIconProps {
  icon?: string;
  source?: ImageSourcePropType;
  focused: boolean;
  badge?: number;
  tintColor?: string;
}

const TabIcon: React.FC<TabIconProps> = ({
  icon,
  source,
  focused,
  badge,
  tintColor,
}) => (
  <View style={styles.iconContainer}>
    {source ? (
      <Image
        source={source}
        style={[
          styles.tabIconImage,
          {
            opacity: focused ? 1 : 0.45,
            tintColor:
              tintColor || (focused ? COLORS.primary : COLORS.textLight),
          },
        ]}
      />
    ) : (
      <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>{icon}</Text>
    )}
    {badge !== undefined && badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
      </View>
    )}
  </View>
);

// ============================================
// MAIN TAB NAVIGATOR
// ============================================

const MainTabs: React.FC = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={TAB_ICONS.home} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={TAB_ICONS.cart}
              focused={focused}
              badge={cartCount}
            />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={TAB_ICONS.orders} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon source={TAB_ICONS.profile} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ============================================
// ADMIN STACK + TABS
// ============================================

const AdminOrdersStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="AdminOrders"
      component={AdminOrdersScreen}
      options={{ title: "Order Management" }}
    />
  </Stack.Navigator>
);

const AdminMenuStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="AdminMenu"
      component={AdminMenuScreen}
      options={{ title: "Menu Management" }}
    />
  </Stack.Navigator>
);

const AdminAnalyticsStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    }}
  >
    <Stack.Screen
      name="AdminAnalytics"
      component={AdminAnalyticsScreen}
      options={{ title: "Analytics" }}
    />
  </Stack.Navigator>
);

const AdminTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        height: Platform.OS === "ios" ? 88 : 65,
        paddingBottom: Platform.OS === "ios" ? 28 : 10,
        paddingTop: 8,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: "600",
        marginTop: -2,
      },
    }}
  >
    <Tab.Screen
      name="AdminOrdersTab"
      component={AdminOrdersStack}
      options={{
        tabBarLabel: "Orders",
        tabBarIcon: ({ focused }) => (
          <TabIcon source={TAB_ICONS.adminOrders} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AdminMenuTab"
      component={AdminMenuStack}
      options={{
        tabBarLabel: "Menu",
        tabBarIcon: ({ focused }) => (
          <TabIcon source={TAB_ICONS.adminMenu} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AdminAnalyticsTab"
      component={AdminAnalyticsStack}
      options={{
        tabBarLabel: "Analytics",
        tabBarIcon: ({ focused }) => (
          <TabIcon source={TAB_ICONS.analytics} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="AdminProfileTab"
      component={ProfileStack}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ focused }) => (
          <TabIcon source={TAB_ICONS.profile} focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ============================================
// ROOT NAVIGATOR
// ============================================

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) {
    return <Loading fullScreen message="Welcome to Coffee Shop..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : isAdmin ? (
          <Stack.Screen name="AdminApp" component={AdminTabs} />
        ) : (
          <Stack.Screen name="MainApp" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 28,
  },
  icon: {
    fontSize: 22,
  },
  tabIconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#E53935",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default AppNavigator;
