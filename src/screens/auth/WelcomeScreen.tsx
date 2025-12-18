import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackNavigationProp } from '../../types';
import { COLORS, SCREEN_NAMES } from '../../utils/constants';

// Conditionally import LottieView - it may fail on web
let LottieView: any = null;
let CoffeeLoveAnimation: any = null;

try {
  LottieView = require('lottie-react-native').default;
  CoffeeLoveAnimation = require('../../../assets/icon/Coffee love.json');
} catch (error) {
  console.log('Lottie not available, using fallback');
}

interface WelcomeScreenProps {
  navigation: RootStackNavigationProp;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const canUseLottie = Platform.OS !== 'web' && LottieView && CoffeeLoveAnimation;

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.secondary]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          {canUseLottie ? (
            <LottieView
              source={CoffeeLoveAnimation}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          ) : (
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>☕</Text>
            </View>
          )}
          <Text style={styles.title}>Coffee Shop</Text>
          <Text style={styles.subtitle}>Begin here</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN as any)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER as any)}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('MainApp')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 50,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
  skipText: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
