import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS } from '../../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Conditionally import LottieView - it may fail on web
let LottieView = null;
let Error404Animation = null;

try {
  LottieView = require('lottie-react-native').default;
  Error404Animation = require('../../../assets/icon/Error 404.json');
} catch (error) {
  console.log('Lottie not available, using fallback');
}

/**
 * NotFoundScreen Component
 * 
 * A 404 error page with animated illustration.
 * Displays when user navigates to a non-existent route or resource.
 * 
 * @param {Object} props
 * @param {Object} props.navigation - Navigation object for routing
 * @param {string} props.title - Custom title (default: "Oops! Page Not Found")
 * @param {string} props.message - Custom message
 * @param {Function} props.onGoBack - Custom go back handler
 * @param {Function} props.onGoHome - Custom go home handler
 */
const NotFoundScreen = ({ 
  navigation,
  title = "Oops! Page Not Found",
  message = "The page you're looking for seems to have wandered off for a coffee break.",
  onGoBack,
  onGoHome
}) => {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else if (navigation) {
      navigation.navigate('Home');
    }
  };

  const canUseLottie = Platform.OS !== 'web' && LottieView && Error404Animation;

  return (
    <View style={styles.container}>
      {/* Animated Illustration */}
      <View style={styles.animationContainer}>
        {canUseLottie ? (
          <LottieView
            source={Error404Animation}
            autoPlay
            loop
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
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleGoHome}
        >
          <Text style={styles.primaryButtonText}>🏠 Go Home</Text>
        </TouchableOpacity>

        {(navigation?.canGoBack() || onGoBack) && (
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleGoBack}
          >
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
