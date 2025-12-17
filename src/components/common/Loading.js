import { ActivityIndicator, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../utils/constants';

// Conditionally import LottieView - it may fail on web
let LottieView = null;
let CoffeeLoveAnimation = null;

try {
  LottieView = require('lottie-react-native').default;
  CoffeeLoveAnimation = require('../../../assets/icon/Coffee love.json');
} catch (error) {
  console.log('Lottie not available, using fallback');
}

const Loading = ({
  visible = true,
  message = 'Loading...',
  fullScreen = false,
  size = 'large',
  color = COLORS.primary,
  overlay = false,
  useLottie = Platform.OS !== 'web', // Disable Lottie on web by default
  lottieSize = 150
}) => {
  if (!visible) return null;

  const canUseLottie = useLottie && LottieView && CoffeeLoveAnimation;

  const renderLoadingIndicator = () => {
    if (canUseLottie) {
      return (
        <LottieView
          source={CoffeeLoveAnimation}
          autoPlay
          loop
          style={{ width: lottieSize, height: lottieSize }}
        />
      );
    }
    return <ActivityIndicator size={size} color={color} />;
  };

  const LoadingContent = (
    <View style={[styles.container, fullScreen && styles.fullScreenContainer]}>
      <View style={[styles.loadingBox, canUseLottie && styles.loadingBoxLottie]}>
        {renderLoadingIndicator()}
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.loadingBox, canUseLottie && styles.loadingBoxLottie]}>
            {renderLoadingIndicator()}
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  return LoadingContent;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingBoxLottie: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default Loading;