import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { LoadingProps } from "../../types";
import { COLORS } from "../../utils/constants";

// Try to import Lottie - it may fail on some setups
let LottieView: any = null;
try {
  LottieView = require("lottie-react-native").default;
} catch (e) {
  console.warn("LottieView not available:", e);
}

// Local Lottie animation asset
let COFFEE_ANIMATION: any = null;
try {
  COFFEE_ANIMATION = require("../../../assets/icon/Coffee love.json");
} catch (e) {
  console.warn("Lottie animation not found:", e);
}

const Loading: React.FC<LoadingProps> = ({
  visible = true,
  message = "Loading...",
  fullScreen = false,
  size = "large",
  color = COLORS.primary,
  overlay = false,
  useLottie = true,
  lottieSize = 200,
}) => {
  const animationRef = useRef<any>(null);
  const [lottieFailed, setLottieFailed] = useState(false);

  // Force play animation on mount (handles reduced motion setting)
  useEffect(() => {
    if (animationRef.current) {
      try {
        animationRef.current.play();
      } catch (e) {
        console.warn("Lottie play failed:", e);
        setLottieFailed(true);
      }
    }
  }, []);

  if (!visible) return null;

  const canUseLottie =
    useLottie && LottieView && COFFEE_ANIMATION && !lottieFailed;

  const renderLoadingIndicator = (): React.ReactElement => {
    if (canUseLottie) {
      try {
        return (
          <LottieView
            ref={animationRef}
            source={COFFEE_ANIMATION}
            autoPlay={true}
            loop={true}
            speed={3}
            style={{ width: lottieSize, height: lottieSize }}
          />
        );
      } catch (e) {
        console.warn("Lottie render failed:", e);
        // Fall through to ActivityIndicator
      }
    }
    return <ActivityIndicator size={size} color={color} />;
  };

  const LoadingContent = (
    <View style={[styles.container, fullScreen && styles.fullScreenContainer]}>
      <View
        style={[styles.loadingBox, canUseLottie && styles.loadingBoxLottie]}
      >
        {renderLoadingIndicator()}
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View
            style={[styles.loadingBox, canUseLottie && styles.loadingBoxLottie]}
          >
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#F5E6D3", // Coffee shop beige/brown background
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    backgroundColor: "transparent", // No white box
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    minWidth: 150,
    // Remove shadow since no box
  },
  loadingBoxLottie: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "transparent", // Ensure transparent
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3428", // Dark coffee brown text
    textAlign: "center",
  },
});

export default Loading;
