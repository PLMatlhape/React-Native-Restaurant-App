import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, SCREEN_NAMES } from '../utils/constants';

// Import screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
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
        name={SCREEN_NAMES.WELCOME} 
        component={WelcomeScreen}
        options={{
          title: 'Welcome'
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.LOGIN} 
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
        name={SCREEN_NAMES.REGISTER} 
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