import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackNavigationProp } from '../../types';
import { SCREEN_NAMES } from '../../utils/constants';

const CoffeeLoveAnimation = require('../../../assets/icon/Coffee love.json');

const { height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: RootStackNavigationProp;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate logo
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Fade in buttons after a delay
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim, logoScale]);

  return (
    <LinearGradient
      colors={['#F5E6D3', '#E8D4C4', '#D4BBA8']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
          {isNative ? (
            <LottieView
              source={CoffeeLoveAnimation}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          ) : (
            <Text style={styles.coffeeEmoji}>☕</Text>
          )}
        </Animated.View>
        
        <Text style={styles.title}>Coffee Shop</Text>
        <Text style={styles.subtitle}>Freshly brewed happiness</Text>
      </View>

      {/* Buttons Section */}
      <Animated.View 
        style={[
          styles.buttonSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('MainApp' as any)}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Browse as Guest</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  coffeeEmoji: {
    fontSize: 120,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#4A3428',
    marginTop: 20,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 8,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  buttonSection: {
    paddingHorizontal: 32,
    paddingBottom: 60,
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#4A3428',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A3428',
  },
  signUpButtonText: {
    color: '#4A3428',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: '#8B7355',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
