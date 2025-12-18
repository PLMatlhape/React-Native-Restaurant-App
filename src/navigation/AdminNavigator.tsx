import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import type { AdminStackParamList } from '../types';
import { COLORS, SCREEN_NAMES } from '../utils/constants';

// Import admin screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageFoodScreen from '../screens/admin/ManageFoodScreen';
import OrderManagementScreen from '../screens/admin/OrderManagementScreen';

const Stack = createStackNavigator<AdminStackParamList>();

const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen 
        name={SCREEN_NAMES.ADMIN_DASHBOARD as keyof AdminStackParamList} 
        component={AdminDashboard}
        options={{ 
          title: 'Admin Dashboard',
          headerLeft: () => null // Remove back button on dashboard
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.MANAGE_FOOD as keyof AdminStackParamList} 
        component={ManageFoodScreen}
        options={{ 
          title: 'Manage Menu Items',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ORDER_MANAGEMENT as keyof AdminStackParamList} 
        component={OrderManagementScreen}
        options={{ 
          title: 'Manage Orders',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
