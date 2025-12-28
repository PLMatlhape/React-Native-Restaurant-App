import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { LoadingProps } from '../../types';
import { COLORS } from '../../utils/constants';

// Conditionally import LottieView - it may fail on web
let LottieView: any = null;

try {
  LottieView = require('lottie-react-native').default;
} catch (error) {
  console.log('Lottie not available, using fallback');
}

// Lottie animation URL from lottie.host
const COFFEE_ANIMATION_URL = 'https://lottie.host/40c22274-9e6d-479b-8461-78d7d7d8bc5c/mRuXq2MJu1.json';

const Loading: React.FC<LoadingProps> = ({
  visible = true,
  message = 'Loading...',
  fullScreen = false,
  size = 'large',
  color = COLORS.primary,
  overlay = false,
  useLottie = Platform.OS !== 'web',
  lottieSize = 200,
}) => {
  const animationRef = useRef<any>(null);

  // Force play animation on mount (handles reduced motion setting)
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  if (!visible) return null;

  const canUseLottie = useLottie && LottieView;

  const renderLoadingIndicator = (): React.ReactElement => {
    if (canUseLottie) {
      return (
        <LottieView
          ref={animationRef}
          source={{ uri: COFFEE_ANIMATION_URL }}
          autoPlay={true}
          loop={true}
          speed={3}
          renderMode="AUTOMATIC"
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
    backgroundColor: '#F5E6D3', // Coffee shop beige/brown background
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: 'transparent', // No white box
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    minWidth: 150,
    // Remove shadow since no box
  },
  loadingBoxLottie: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'transparent', // Ensure transparent
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#4A3428', // Dark coffee brown text
    textAlign: 'center',
  },
});

export default Loading;
