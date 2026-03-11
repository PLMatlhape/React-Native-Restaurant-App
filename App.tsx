// App.tsx - Root component
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Notifications from "expo-notifications";
import React, {
    Component,
    ErrorInfo,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import AppNavigator from "./src/navigation/AppNavigator";

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Stripe publishable key from .env (falls back to Stripe test key if not set)
const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_TYooMQauvdEDq54NiTphI7jx";
const STRIPE_MERCHANT_ID =
  process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID ||
  "merchant.com.matlhape.coffeeshop";

// ============================================
// ERROR BOUNDARY - catches render errors
// ============================================
interface EBProps {
  children: ReactNode;
}
interface EBState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class AppErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<EBState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error("AppErrorBoundary caught:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={ebStyles.container}>
          <ScrollView contentContainerStyle={ebStyles.scroll}>
            <Text style={ebStyles.emoji}>☕</Text>
            <Text style={ebStyles.title}>Something Went Wrong</Text>
            <Text style={ebStyles.subtitle}>
              The error details are shown below:
            </Text>
            <View style={ebStyles.errorBox}>
              <Text style={ebStyles.errorText}>
                {this.state.error?.toString() || "Unknown error"}
              </Text>
              {this.state.errorInfo?.componentStack && (
                <Text style={ebStyles.stackText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={ebStyles.retryBtn}
              onPress={() =>
                this.setState({
                  hasError: false,
                  error: null,
                  errorInfo: null,
                })
              }
            >
              <Text style={ebStyles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const ebStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6D3",
    paddingTop: 80,
  },
  scroll: {
    padding: 24,
    alignItems: "center",
  },
  emoji: { fontSize: 60, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3E2723",
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#795548", marginBottom: 20 },
  errorBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#D32F2F",
    marginBottom: 20,
  },
  errorText: { fontSize: 13, color: "#D32F2F", fontWeight: "600" },
  stackText: { fontSize: 11, color: "#795548", marginTop: 8 },
  retryBtn: {
    backgroundColor: "#6F4E37",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  retryText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

// ============================================
// APP COMPONENT
// ============================================
const App: React.FC = () => {
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const existingPerms = await Notifications.getPermissionsAsync();
      let isGranted = existingPerms.granted;
      if (!isGranted) {
        const newPerms = await Notifications.requestPermissionsAsync();
        isGranted = newPerms.granted;
      }
      if (!isGranted) {
        console.log("Notification permissions not granted");
      }

      // Android notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("orders", {
          name: "Order Updates",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#6F4E37",
        });
      }
    };

    requestPermissions();

    // Listen for incoming notifications while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // Listen for user interaction with notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <AppErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StripeProvider
            publishableKey={STRIPE_PUBLISHABLE_KEY}
            merchantIdentifier={STRIPE_MERCHANT_ID}
          >
            <AuthProvider>
              <CartProvider>
                <AppNavigator />
              </CartProvider>
            </AuthProvider>
          </StripeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AppErrorBoundary>
  );
};

export default App;
