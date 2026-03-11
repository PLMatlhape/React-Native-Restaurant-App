// Payment Gateway Screen - Visual payment processing flow
// Shows step-by-step payment processing with animations + receipt
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../utils/constants";

// ============================================
// TYPES
// ============================================

interface PaymentGatewayScreenProps {
  navigation: any;
  route: {
    params: {
      amount: number;
      paymentMethod: "card" | "cash";
      cardLast4?: string;
      cardType?: string;
      transactionId: string;
      orderId: string;
      deliveryAddress: string;
      itemCount: number;
      subtotal: number;
      deliveryFee: number;
    };
  };
}

type PaymentStep =
  | "verifying"
  | "processing"
  | "confirming"
  | "complete"
  | "failed";

const STEPS: { key: PaymentStep; label: string; duration: number }[] = [
  { key: "verifying", label: "Verifying payment details...", duration: 1200 },
  { key: "processing", label: "Processing payment...", duration: 1800 },
  { key: "confirming", label: "Confirming with bank...", duration: 1400 },
  { key: "complete", label: "Payment successful!", duration: 0 },
];

// ============================================
// COMPONENT
// ============================================

const PaymentGatewayScreen: React.FC<PaymentGatewayScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    amount,
    paymentMethod,
    cardLast4,
    cardType,
    transactionId,
    orderId,
    deliveryAddress,
    itemCount,
    subtotal,
    deliveryFee,
  } = route.params;

  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<PaymentStep>("verifying");
  const [showReceipt, setShowReceipt] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const receiptFade = useRef(new Animated.Value(0)).current;

  // Animate entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Step progression
  const runSteps = useCallback(async () => {
    for (let i = 0; i < STEPS.length; i++) {
      setCurrentStep(i);
      setStatus(STEPS[i].key);

      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: (i + 1) / STEPS.length,
        duration: STEPS[i].duration || 500,
        useNativeDriver: false,
      }).start();

      if (STEPS[i].duration > 0) {
        await new Promise((resolve) => setTimeout(resolve, STEPS[i].duration));
      }
    }

    // Show receipt
    setShowReceipt(true);
    Animated.timing(receiptFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [progressAnim, receiptFade]);

  useEffect(() => {
    // Small delay to let the screen render first
    const timer = setTimeout(() => runSteps(), 500);
    return () => clearTimeout(timer);
  }, [runSteps]);

  const handleViewOrders = () => {
    // Navigate back to main and open orders tab
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Cart",
        },
      ],
    });
    // Navigate to the Orders tab
    setTimeout(() => {
      navigation.getParent()?.navigate("OrdersTab");
    }, 100);
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Cart",
        },
      ],
    });
    setTimeout(() => {
      navigation.getParent()?.navigate("HomeTab");
    }, 100);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const now = new Date();
  const receiptDate = now.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const receiptTime = now.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Payment Icon */}
          <View style={styles.iconContainer}>
            {status === "complete" ? (
              <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
                <Image
                  source={require("../../../assets/icon/icons8-done-50.png")}
                  style={{ width: 36, height: 36, tintColor: COLORS.white }}
                />
              </View>
            ) : (
              <View style={styles.iconCircle}>
                <Image
                  source={
                    paymentMethod === "card"
                      ? require("../../../assets/icon/icons8-card-64.png")
                      : require("../../../assets/icon/icons8-cash-64.png")
                  }
                  style={{ width: 36, height: 36, tintColor: COLORS.primary }}
                />
              </View>
            )}
          </View>

          {/* Amount */}
          <Text style={styles.amount}>R{amount.toFixed(2)}</Text>
          <Text style={styles.methodLabel}>
            {paymentMethod === "card"
              ? `${cardType || "Card"} ending in ${cardLast4 || "****"}`
              : "Cash on Delivery"}
          </Text>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                    backgroundColor:
                      status === "complete" ? COLORS.success : COLORS.primary,
                  },
                ]}
              />
            </View>
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isDone = index < currentStep || status === "complete";
              return (
                <View key={step.key} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepDot,
                      isDone && styles.stepDotDone,
                      isActive && !isDone && styles.stepDotActive,
                    ]}
                  >
                    {isDone ? (
                      <Text style={styles.stepCheck}>✓</Text>
                    ) : isActive ? (
                      <View style={styles.stepPulse} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.stepText,
                      isDone && styles.stepTextDone,
                      isActive && !isDone && styles.stepTextActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Receipt */}
          {showReceipt && (
            <Animated.View style={[styles.receipt, { opacity: receiptFade }]}>
              <View style={styles.receiptHeader}>
                <Text style={styles.receiptTitle}>Payment Receipt</Text>
                <Text style={styles.receiptIcon}>🧾</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Transaction ID</Text>
                <Text style={styles.receiptValue}>{transactionId}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Order ID</Text>
                <Text style={styles.receiptValue}>#{orderId}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date</Text>
                <Text style={styles.receiptValue}>{receiptDate}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Time</Text>
                <Text style={styles.receiptValue}>{receiptTime}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment Method</Text>
                <Text style={styles.receiptValue}>
                  {paymentMethod === "card"
                    ? `${cardType || "Card"} ****${cardLast4}`
                    : "Cash on Delivery"}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Items</Text>
                <Text style={styles.receiptValue}>
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Subtotal</Text>
                <Text style={styles.receiptValue}>R{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Delivery Fee</Text>
                <Text style={styles.receiptValue}>
                  R{deliveryFee.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.receiptRow, styles.receiptTotalRow]}>
                <Text style={styles.receiptTotalLabel}>Total Paid</Text>
                <Text style={styles.receiptTotalValue}>
                  R{amount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Delivery To</Text>
                <Text
                  style={[styles.receiptValue, { flex: 1, textAlign: "right" }]}
                  numberOfLines={2}
                >
                  {deliveryAddress}
                </Text>
              </View>

              <View style={styles.receiptFooter}>
                <Text style={styles.receiptFooterText}>
                  Estimated delivery: ~30 minutes
                </Text>
                <Text style={styles.receiptFooterText}>
                  Thank you for your order! ☕
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Action Buttons (show after complete) */}
          {showReceipt && (
            <Animated.View style={[styles.actions, { opacity: receiptFade }]}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleViewOrders}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryBtnText}>View My Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleBackToHome}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  content: {
    alignItems: "center",
  },

  // Icon
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cream,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  iconCircleSuccess: {
    backgroundColor: COLORS.success,
  },

  // Amount
  amount: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  methodLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 28,
  },

  // Progress
  progressContainer: {
    width: "100%",
    marginBottom: 24,
  },
  progressBg: {
    width: "100%",
    height: 6,
    backgroundColor: COLORS.divider,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Steps
  stepsContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 28,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.divider,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepDotDone: {
    backgroundColor: COLORS.success,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepCheck: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "bold",
  },
  stepPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.border,
  },
  stepTextDone: {
    color: COLORS.success,
    fontWeight: "500",
  },
  stepTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Receipt
  receipt: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  receiptIcon: {
    fontSize: 24,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 14,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  receiptLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  receiptValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },
  receiptTotalRow: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
  },
  receiptTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  receiptTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  receiptFooter: {
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  receiptFooterText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
  },

  // Actions
  actions: {
    width: "100%",
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  secondaryBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
});

export default PaymentGatewayScreen;
