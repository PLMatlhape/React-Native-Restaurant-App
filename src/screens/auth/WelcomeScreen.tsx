// Welcome/Splash Screen - improved with Lottie animation
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../utils/constants";

// Safe Lottie import
let LottieView: any = null;
try {
  LottieView = require("lottie-react-native").default;
} catch (e) {
  console.warn("LottieView not available in WelcomeScreen:", e);
}

let CoffeeLoveAnimation: any = null;
try {
  CoffeeLoveAnimation = require("../../../assets/icon/Coffee love.json");
} catch (e) {
  console.warn("Lottie animation not found:", e);
}

const { width, height } = Dimensions.get("window");

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const animationRef = useRef<any>(null);

  useEffect(() => {
    try {
      animationRef.current?.play();
    } catch (e) {
      console.warn("Lottie play failed:", e);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.animationContainer}>
          {LottieView && CoffeeLoveAnimation ? (
            <LottieView
              ref={animationRef}
              source={CoffeeLoveAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
          ) : (
            <View
              style={[
                styles.animation,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <Text style={{ fontSize: 80 }}>☕</Text>
              <ActivityIndicator
                size="large"
                color={COLORS.white}
                style={{ marginTop: 16 }}
              />
            </View>
          )}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Coffee Shop</Text>
        <Text style={styles.subtitle}>
          Discover the finest coffee, pastries,{"\n"}and sweet treats crafted
          with love
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  topSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  animationContainer: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  bottomSection: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 35,
    paddingBottom: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  registerButton: {
    backgroundColor: "transparent",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 20,
  },
  registerButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "700",
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

export default WelcomeScreen;
