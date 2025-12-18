import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import type { AuthStackParamList } from '../types';
import { COLORS, SCREEN_NAMES } from '../utils/constants';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name={SCREEN_NAMES.WELCOME as keyof AuthStackParamList} 
        component={WelcomeScreen}
        options={{
          title: 'Welcome'
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.LOGIN as keyof AuthStackParamList} 
        component={LoginScreen}
        options={{
          title: 'Login',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.background,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.REGISTER as keyof AuthStackParamList} 
        component={RegisterScreen}
        options={{
          title: 'Sign Up',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.background,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
