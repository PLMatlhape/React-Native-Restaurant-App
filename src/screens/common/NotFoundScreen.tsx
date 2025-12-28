import React, { useEffect, useRef } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackNavigationProp } from '../../types';
import { COLORS } from '../../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Conditionally import LottieView - it may fail on web
let LottieView: any = null;

try {
  LottieView = require('lottie-react-native').default;
} catch (error) {
  console.log('Lottie not available, using fallback');
}

// Lottie animation URL from lottie.host
const ERROR_404_ANIMATION_URL = 'https://lottie.host/ec7b6347-8efc-42fb-ade8-567d180189bf/rKEeuHreP6.json';

interface NotFoundScreenProps {
  navigation?: RootStackNavigationProp;
  title?: string;
  message?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

/**
 * NotFoundScreen Component
 *
 * A 404 error page with animated illustration.
 * Displays when user navigates to a non-existent route or resource.
 */
const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  navigation,
  title = "Oops! Page Not Found",
  message = "The page you're looking for seems to have wandered off for a coffee break.",
  onGoBack,
  onGoHome,
}) => {
  const animationRef = useRef<any>(null);

  // Force play animation on mount (handles reduced motion setting)
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const handleGoBack = (): void => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleGoHome = (): void => {
    if (onGoHome) {
      onGoHome();
    } else if (navigation) {
      navigation.navigate('MainApp');
    }
  };

  const canUseLottie = Platform.OS !== 'web' && LottieView;

  return (
    <View style={styles.container}>
      {/* Animated Illustration */}
      <View style={styles.animationContainer}>
        {canUseLottie ? (
          <LottieView
            ref={animationRef}
            source={{ uri: ERROR_404_ANIMATION_URL }}
            autoPlay={true}
            loop={true}
            speed={3}
            renderMode="AUTOMATIC"
            style={styles.animation}
          />
        ) : (
          <Text style={styles.fallbackEmoji}>🔍</Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <Text style={styles.primaryButtonText}>🏠 Go Home</Text>
        </TouchableOpacity>

        {(navigation?.canGoBack() || onGoBack) && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
            <Text style={styles.secondaryButtonText}>← Go Back</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Decorative Elements */}
      <View style={styles.decoration}>
        <Text style={styles.coffeeEmoji}>☕</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  animationContainer: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
    maxWidth: 400,
    maxHeight: 300,
    marginBottom: 10,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  fallbackEmoji: {
    fontSize: 100,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  errorCode: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.2,
    position: 'absolute',
    top: -40,
    letterSpacing: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  actions: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  decoration: {
    position: 'absolute',
    bottom: 40,
    opacity: 0.1,
  },
  coffeeEmoji: {
    fontSize: 60,
  },
});

export default NotFoundScreen;
