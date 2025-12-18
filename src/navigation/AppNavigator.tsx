import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import type { MainTabParamList, RootStackParamList } from '../types';
import { COLORS, SCREEN_NAMES } from '../utils/constants';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

// Food Screens
import FoodDetailScreen from '../screens/food/FoodDetailScreen';
import HomeScreen from '../screens/food/HomeScreen';

// Cart Screens
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';

// Order Screens
import OrderHistoryScreen from '../screens/order/OrderHistoryScreen';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageFoodScreen from '../screens/admin/ManageFoodScreen';
import OrderManagementScreen from '../screens/admin/OrderManagementScreen';

// Common Screens
import NotFoundScreen from '../screens/common/NotFoundScreen';

// Common Components
import Loading from '../components/common/Loading';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack
const AuthStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: COLORS.background }
    }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Home Stack
const HomeStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.HOME as any} 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name={SCREEN_NAMES.FOOD_DETAIL as any} 
      component={FoodDetailScreen}
      options={{ title: 'Food Details' }}
    />
  </Stack.Navigator>
);

// Cart Stack
const CartStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.CART as any} 
      component={CartScreen}
      options={{ title: 'My Cart' }}
    />
    <Stack.Screen 
      name={SCREEN_NAMES.CHECKOUT as any} 
      component={CheckoutScreen}
      options={{ title: 'Checkout' }}
    />
  </Stack.Navigator>
);

// Orders Stack
const OrdersStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.ORDER_HISTORY as any} 
      component={OrderHistoryScreen}
      options={{ title: 'My Orders' }}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.PROFILE as any} 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

// Admin Stack
const AdminStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.ADMIN_DASHBOARD as any} 
      component={AdminDashboard}
      options={{ title: 'Admin Dashboard' }}
    />
    <Stack.Screen 
      name={SCREEN_NAMES.MANAGE_FOOD as any} 
      component={ManageFoodScreen}
      options={{ title: 'Manage Menu' }}
    />
    <Stack.Screen 
      name={SCREEN_NAMES.ORDER_MANAGEMENT as any} 
      component={OrderManagementScreen}
      options={{ title: 'Order Management' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🛒</Text>
          ),
        }}
      />
      {user && (
        <Tab.Screen 
          name="OrdersTab" 
          component={OrdersStack}
          options={{
            tabBarLabel: 'Orders',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>📦</Text>
            ),
          }}
        />
      )}
      {user && (
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>👤</Text>
            ),
          }}
        />
      )}
      {isAdmin && (
        <Tab.Screen 
          name="AdminTab" 
          component={AdminStack}
          options={{
            tabBarLabel: 'Admin',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>⚙️</Text>
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Show loading screen for at least 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading if either auth is loading OR splash timer is still active
  if (loading || showSplash) {
    return <Loading fullScreen message="Starting Coffee Shop..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="MainApp" component={MainTabs} />
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
