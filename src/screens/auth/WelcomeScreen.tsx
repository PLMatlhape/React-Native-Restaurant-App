// Welcome/Splash Screen - improved with Lottie animation
import React from "react";
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../utils/constants";

const { width } = Dimensions.get("window");

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.animationContainer}>
          <View style={styles.iconBadge}>
            <Image
              source={require("../../../assets/icon/icons8-coffee-cup-64.png")}
              style={styles.topIcon}
              resizeMode="contain"
            />
          </View>
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
    width: Math.min(width * 0.7, 280),
    height: Math.min(width * 0.7, 280),
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    width: Math.min(width * 0.42, 170),
    height: Math.min(width * 0.42, 170),
    borderRadius: Math.min(width * 0.21, 85),
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  topIcon: {
    width: "58%",
    height: "58%",
    tintColor: COLORS.white,
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
