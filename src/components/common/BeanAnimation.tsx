import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../utils/constants";

const BEAN_ANIMATION = require("../../../assets/icon/Coffee Cup Loader.json");

interface BeanAnimationProps {
  size?: number;
}

const BeanAnimation: React.FC<BeanAnimationProps> = ({ size = 220 }) => {
  const animationRef = useRef<LottieView | null>(null);

  const startLottie = () => {
    animationRef.current?.reset();
    animationRef.current?.play();
  };

  useEffect(() => {
    const timers = [0, 300, 900, 1800].map((delay) =>
      setTimeout(startLottie, delay),
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      onLayout={startLottie}
    >
      <LottieView
        ref={animationRef}
        source={BEAN_ANIMATION}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

export const BeanAnimationFallback: React.FC<{ size?: number }> = ({
  size = 120,
}) => (
  <View style={[styles.fallback, { width: size, height: size }]}>
    <Text style={styles.fallbackEmoji}>☕</Text>
    <ActivityIndicator size="small" color={COLORS.white} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  animation: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  fallbackEmoji: {
    fontSize: 50,
  },
});

export default BeanAnimation;
