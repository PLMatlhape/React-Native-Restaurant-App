import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { MainTabParamList } from '../types';
import { COLORS, SCREEN_NAMES } from '../utils/constants';

// Import screens
import ProfileScreen from '../screens/auth/ProfileScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import FoodDetailScreen from '../screens/food/FoodDetailScreen';
import HomeScreen from '../screens/food/HomeScreen';
import MenuScreen from '../screens/food/MenuScreen';
import OrderHistoryScreen from '../screens/order/OrderHistoryScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

interface TabBarIconProps {
  icon: string;
  badgeCount?: number;
  focused: boolean;
}

// Home Stack
const HomeStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.HOME} 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name={SCREEN_NAMES.FOOD_DETAIL} 
      component={FoodDetailScreen}
      options={{ 
        title: 'Item Details',
        headerBackTitle: 'Back'
      }}
    />
    <Stack.Screen 
      name={SCREEN_NAMES.MENU} 
      component={MenuScreen}
      options={{ 
        title: 'Menu',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

// Cart Stack
const CartStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.CART} 
      component={CartScreen}
      options={{ title: 'My Cart' }}
    />
    <Stack.Screen 
      name={SCREEN_NAMES.CHECKOUT} 
      component={CheckoutScreen}
      options={{ 
        title: 'Checkout',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

// Orders Stack
const OrdersStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.ORDER_HISTORY} 
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
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}
  >
    <Stack.Screen 
      name={SCREEN_NAMES.PROFILE} 
      component={ProfileScreen}
      options={{ title: 'My Profile' }}
    />
  </Stack.Navigator>
);

// Custom Tab Bar Icon with Badge
const TabBarIcon: React.FC<TabBarIconProps> = ({ icon, badgeCount = 0, focused }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, { opacity: focused ? 1 : 0.6 }]}>{icon}</Text>
    {badgeCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
      </View>
    )}
  </View>
);

const MainNavigator: React.FC = () => {
  const { user } = useAuth();
  const { getCartCount } = useCart();

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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="🏠" focused={focused} />
          ),
        }}
      />

      <Tab.Screen 
        name="CartTab" 
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              icon="🛒" 
              badgeCount={getCartCount()} 
              focused={focused} 
            />
          ),
        }}
      />

      {user && (
        <Tab.Screen 
          name="OrdersTab" 
          component={OrdersStack}
          options={{
            tabBarLabel: 'Orders',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="📦" focused={focused} />
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
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="👤" focused={focused} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MainNavigator;
