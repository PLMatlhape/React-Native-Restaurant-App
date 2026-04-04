// Checkout Screen - Stripe payment integration + delivery address options
import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { orderService } from "../../services/local/orderService";
import {
    CardField,
    useConfirmPayment,
} from "../../services/local/stripeNative";
import { stripeService } from "../../services/local/stripeService";
import { COLORS } from "../../utils/constants";

interface CheckoutScreenProps {
  navigation: any;
}

type PaymentMethod = "card" | "cash";
type AddressOption = "default" | "different";

const DELIVERY_FEE = 15;

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { confirmPayment } = useConfirmPayment();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardComplete, setCardComplete] = useState(false);
  const [addressOption, setAddressOption] = useState<AddressOption>("default");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [differentAddress, setDifferentAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  const subtotal = getCartTotal();
  const total = subtotal + DELIVERY_FEE;

  const getActiveAddress = (): string => {
    if (addressOption === "default") return deliveryAddress;
    return differentAddress;
  };

  const getRecipientDisplay = (): string => {
    if (addressOption === "different" && recipientName.trim()) {
      return recipientName.trim();
    }
    return user?.name ? `${user.name} ${user.surname || ""}`.trim() : "Guest";
  };

  const handlePlaceOrder = async () => {
    Keyboard.dismiss();

    const activeAddress = getActiveAddress();
    if (!activeAddress.trim()) {
      Alert.alert(
        "Missing Address",
        addressOption === "default"
          ? "Please enter your delivery address."
          : "Please enter the delivery address for the recipient.",
      );
      return;
    }

    if (addressOption === "different" && !recipientName.trim()) {
      Alert.alert("Missing Recipient", "Please enter the recipient's name.");
      return;
    }

    if (paymentMethod === "card" && !cardComplete) {
      Alert.alert("Card Required", "Please fill in your card details.");
      return;
    }

    setLoading(true);

    try {
      let paymentResult;

      if (paymentMethod === "card") {
        // Process through Stripe
        paymentResult = await stripeService.processStripePayment(
          total,
          confirmPayment,
        );
      } else {
        // Cash on delivery
        paymentResult = await stripeService.processCashPayment();
      }

      if (!paymentResult.success) {
        Alert.alert(
          "Payment Failed",
          paymentResult.error || "Please try again.",
        );
        setLoading(false);
        return;
      }

      // Create order
      const orderResult = await orderService.createOrder({
        userId: user?.id || "guest",
        userName: getRecipientDisplay(),
        userEmail: user?.email || "",
        items: cartItems.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customizations: item.customizations,
        })),
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        paymentMethod,
        deliveryAddress: activeAddress.trim(),
        transactionId: paymentResult.transactionId,
      });

      if (orderResult.success) {
        clearCart();
        navigation.navigate("PaymentGateway", {
          amount: total,
          paymentMethod,
          cardLast4: paymentMethod === "card" ? "••••" : undefined,
          cardType: paymentMethod === "card" ? "Stripe" : undefined,
          transactionId: paymentResult.transactionId || "CASH",
          orderId: orderResult.order?.id || "N/A",
          deliveryAddress: activeAddress.trim(),
          recipientName:
            addressOption === "different" ? recipientName.trim() : undefined,
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal,
          deliveryFee: DELIVERY_FEE,
        });
      } else {
        Alert.alert(
          "Order Failed",
          orderResult.error || "Something went wrong.",
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {cartItems.map((item) => (
              <View key={item.cartItemId} style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <Text style={styles.summaryItemQty}>{item.quantity}x</Text>
                  <Text style={styles.summaryItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                <Text style={styles.summaryItemPrice}>
                  R{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>
                R{DELIVERY_FEE.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalSummaryRow]}>
              <Text style={styles.totalSummaryLabel}>Total</Text>
              <Text style={styles.totalSummaryValue}>R{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          {/* Address toggle */}
          <View style={styles.addressToggle}>
            <TouchableOpacity
              style={[
                styles.addressToggleBtn,
                addressOption === "default" && styles.addressToggleBtnActive,
              ]}
              onPress={() => setAddressOption("default")}
            >
              <Text
                style={[
                  styles.addressToggleText,
                  addressOption === "default" && styles.addressToggleTextActive,
                ]}
              >
                My Address
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addressToggleBtn,
                addressOption === "different" && styles.addressToggleBtnActive,
              ]}
              onPress={() => {
                setAddressOption("different");
                scrollToBottom();
              }}
            >
              <Text
                style={[
                  styles.addressToggleText,
                  addressOption === "different" &&
                    styles.addressToggleTextActive,
                ]}
              >
                Different Address
              </Text>
            </TouchableOpacity>
          </View>

          {addressOption === "default" ? (
            <View>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your delivery address"
                placeholderTextColor={COLORS.textLight}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                numberOfLines={2}
              />
              {user?.address && deliveryAddress === user.address && (
                <Text style={styles.addressHint}>
                  ✓ Using your profile address
                </Text>
              )}
            </View>
          ) : (
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Recipient Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Who is this order for?"
                  placeholderTextColor={COLORS.border}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Delivery Address</Text>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Enter the delivery address"
                  placeholderTextColor={COLORS.textLight}
                  value={differentAddress}
                  onChangeText={setDifferentAddress}
                  multiline
                  numberOfLines={2}
                  onFocus={scrollToBottom}
                />
              </View>
              <View style={styles.differentAddressNote}>
                <Text style={styles.noteIcon}>ℹ️</Text>
                <Text style={styles.noteText}>
                  This order will be delivered to{" "}
                  {recipientName || "the recipient"} at the address above.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "card" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("card")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../../assets/icon/icons8-card-64.png")}
                style={{ width: 24, height: 24, tintColor: COLORS.primary }}
              />
              <View style={styles.paymentTextWrap}>
                <Text
                  style={[
                    styles.paymentText,
                    paymentMethod === "card" && styles.paymentTextActive,
                  ]}
                >
                  Card Payment
                </Text>
                <Text style={styles.paymentSubtext}>Powered by Stripe</Text>
              </View>
              {paymentMethod === "card" && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("cash")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../../assets/icon/icons8-cash-64.png")}
                style={{ width: 24, height: 24, tintColor: COLORS.success }}
              />
              <View style={styles.paymentTextWrap}>
                <Text
                  style={[
                    styles.paymentText,
                    paymentMethod === "cash" && styles.paymentTextActive,
                  ]}
                >
                  Cash on Delivery
                </Text>
                <Text style={styles.paymentSubtext}>Pay when delivered</Text>
              </View>
              {paymentMethod === "cash" && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stripe Card Field (conditional) */}
        {paymentMethod === "card" && (
          <View style={styles.section}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Card Details</Text>
              <View style={styles.stripeBadge}>
                <Text style={styles.stripeBadgeText}>🔒 Stripe</Text>
              </View>
            </View>
            <View style={styles.cardFieldWrapper}>
              <CardField
                postalCodeEnabled={false}
                placeholders={{
                  number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                  backgroundColor: COLORS.white,
                  textColor: COLORS.text,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 12,
                  fontSize: 16,
                  placeholderColor: COLORS.border,
                }}
                style={styles.cardField}
                onCardChange={(cardDetails) => {
                  setCardComplete(cardDetails.complete);
                }}
              />
            </View>
            <Text style={styles.cardSecurityNote}>
              🔒 Your card details are securely processed by Stripe. We never
              store your card information.
            </Text>
          </View>
        )}

        {/* Cash Info */}
        {paymentMethod === "cash" && (
          <View style={styles.cashInfo}>
            <Text style={styles.cashInfoIcon}>ℹ️</Text>
            <Text style={styles.cashInfoText}>
              Pay R{total.toFixed(2)} in cash when your order is delivered.
              Please have the exact amount ready.
            </Text>
          </View>
        )}

        {/* Place Order Button */}
        <TouchableOpacity
          style={[
            styles.placeOrderBtn,
            loading && styles.placeOrderBtnDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={loading || cartItems.length === 0}
          activeOpacity={0.7}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.white} size="small" />
              <Text style={styles.placeOrderBtnText}> Processing...</Text>
            </View>
          ) : (
            <Text style={styles.placeOrderBtnText}>
              Place Order — R{total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 150 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  section: { marginBottom: 22 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
  },
  summaryCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16 },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  summaryItemQty: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 8,
    width: 28,
  },
  summaryItemName: { fontSize: 14, color: COLORS.text, flex: 1 },
  summaryItemPrice: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: { fontSize: 14, color: COLORS.textLight },
  summaryValue: { fontSize: 14, color: COLORS.text, fontWeight: "500" },
  totalSummaryRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 10,
    marginTop: 6,
    marginBottom: 0,
  },
  totalSummaryLabel: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  totalSummaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  // Address toggle
  addressToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  addressToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  addressToggleBtnActive: { backgroundColor: COLORS.primary },
  addressToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  addressToggleTextActive: { color: COLORS.white },
  addressInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 60,
    textAlignVertical: "top",
  },
  addressHint: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: "500",
    marginTop: 6,
    marginLeft: 4,
  },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  differentAddressNote: {
    flexDirection: "row",
    backgroundColor: COLORS.cream,
    borderRadius: 10,
    padding: 12,
    alignItems: "flex-start",
  },
  noteIcon: { fontSize: 14, marginRight: 8, marginTop: 1 },
  noteText: { fontSize: 13, color: COLORS.text, lineHeight: 18, flex: 1 },
  // Payment options
  paymentOptions: { gap: 10 },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#FAF5F0",
  },
  paymentTextWrap: { flex: 1, marginLeft: 12 },
  paymentText: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  paymentTextActive: { color: COLORS.primary },
  paymentSubtext: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  checkMark: { fontSize: 18, color: COLORS.primary, fontWeight: "bold" },
  // Stripe card field
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  stripeBadge: {
    backgroundColor: "#635BFF20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stripeBadgeText: { fontSize: 12, color: "#635BFF", fontWeight: "600" },
  cardFieldWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  cardField: { width: "100%", height: 50 },
  cardSecurityNote: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 10,
    lineHeight: 18,
  },
  // Cash info
  cashInfo: {
    flexDirection: "row",
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
    alignItems: "flex-start",
  },
  cashInfoIcon: { fontSize: 18, marginRight: 10, marginTop: 1 },
  cashInfoText: { fontSize: 14, color: COLORS.text, lineHeight: 20, flex: 1 },
  // Place order
  placeOrderBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  placeOrderBtnDisabled: { opacity: 0.6 },
  placeOrderBtnText: { fontSize: 17, fontWeight: "700", color: COLORS.white },
  loadingRow: { flexDirection: "row", alignItems: "center" },
});

export default CheckoutScreen;
