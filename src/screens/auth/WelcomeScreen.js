import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SCREEN_NAMES } from '../../utils/constants';

const WelcomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.secondary]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>☕</Text>
          </View>
          <Text style={styles.title}>Coffee Shop</Text>
          <Text style={styles.subtitle}>Begin here</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER)}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('MainApp')}
          >
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