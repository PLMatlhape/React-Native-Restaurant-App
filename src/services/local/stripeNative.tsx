import React from "react";
import { Platform, Text, View } from "react-native";

type ConfirmPaymentResult = {
  error?: { message?: string } | null;
  paymentIntent?: { id?: string } | null;
};

let nativeStripe: any = null;
if (Platform.OS !== "web") {
  nativeStripe = require("@stripe/stripe-react-native");
}

export const StripeProvider =
  nativeStripe?.StripeProvider ||
  (({ children }: { children: React.ReactNode }) => <>{children}</>);

export const useConfirmPayment = () => {
  if (nativeStripe?.useConfirmPayment) {
    return nativeStripe.useConfirmPayment();
  }

  return {
    confirmPayment: async (): Promise<ConfirmPaymentResult> => ({
      error: {
        message: "Card payments are unavailable in the browser preview.",
      },
      paymentIntent: null,
    }),
  };
};

export const CardField =
  nativeStripe?.CardField ||
  (() => (
    <View style={{ padding: 16, borderRadius: 12, backgroundColor: "#FFF8E1" }}>
      <Text style={{ color: "#3E2723", fontWeight: "600" }}>
        Card payments are available on Android/iOS builds.
      </Text>
    </View>
  ));

export default {
  StripeProvider,
  useConfirmPayment,
  CardField,
};
