// Stripe Service - handles Stripe payment integration via backend server
// PaymentIntents are created on the backend (secret key is server-side only).
// The client only uses the publishable key for the Stripe SDK.

import { Platform } from "react-native";

// Stripe publishable key from .env
export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51T9kH7FN5o3zPyVhIf38017xtfXJa4H3N7Dqo43vONgad7VlXRq87Ix0PfgQKrYaIEl6IHbUD5JxOXgu0qenoXPQ00antJqPpS";

// Backend server URL — use your machine's LAN IP for real-device testing
// e.g. "http://192.168.x.x:3001"
const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  (Platform.OS === "web" ? "http://localhost:3001" : "http://10.0.2.2:3001");

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const stripeService = {
  /**
   * Create a PaymentIntent via our backend server.
   * The secret key never touches the client.
   */
  createPaymentIntent: async (
    amountInRands: number,
    metadata?: Record<string, string>,
  ): Promise<PaymentIntentResponse> => {
    const response = await fetch(`${BACKEND_URL}/api/payments/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountInRands,
        currency: "zar",
        metadata: metadata || {},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend PaymentIntent error:", data);
      throw new Error(data.error || "Failed to create payment intent");
    }

    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
    };
  },

  /**
   * Confirm / log a completed card payment on the backend.
   * Call this after the Stripe SDK confirms the payment on the client.
   */
  confirmPaymentOnBackend: async (details: {
    paymentIntentId: string;
    orderId?: string;
    userId?: string;
    userName?: string;
    items?: { name: string; price: number; quantity: number }[];
  }): Promise<void> => {
    try {
      await fetch(`${BACKEND_URL}/api/payments/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
    } catch (err) {
      // Non-blocking — payment already succeeded via Stripe
      console.warn("Could not log payment to backend:", err);
    }
  },

  /**
   * Log a cash payment on the backend.
   */
  logCashPaymentOnBackend: async (details: {
    amount: number;
    orderId?: string;
    userId?: string;
    userName?: string;
    items?: { name: string; price: number; quantity: number }[];
  }): Promise<string | null> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/payments/cash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await response.json();
      return data.transactionId || null;
    } catch (err) {
      console.warn("Could not log cash payment to backend:", err);
      return null;
    }
  },

  /**
   * Process a card payment through Stripe.
   * 1. Creates PaymentIntent on backend
   * 2. Confirms payment with Stripe SDK on client
   * 3. Logs the result back to backend
   */
  processStripePayment: async (
    amountInRands: number,
    confirmPayment: (clientSecret: string, params: any) => Promise<any>,
    orderMetadata?: {
      orderId?: string;
      userId?: string;
      userName?: string;
      items?: { name: string; price: number; quantity: number }[];
    },
  ): Promise<PaymentResult> => {
    try {
      // Step 1: Create PaymentIntent on backend
      const { clientSecret, paymentIntentId } =
        await stripeService.createPaymentIntent(amountInRands, {
          orderId: orderMetadata?.orderId || "",
          userId: orderMetadata?.userId || "",
        });

      // Step 2: Confirm the payment with Stripe SDK
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Payment failed. Please try again.",
        };
      }

      // Step 3: Log the completed payment on backend
      await stripeService.confirmPaymentOnBackend({
        paymentIntentId: paymentIntent?.id || paymentIntentId,
        orderId: orderMetadata?.orderId,
        userId: orderMetadata?.userId,
        userName: orderMetadata?.userName,
        items: orderMetadata?.items,
      });

      return {
        success: true,
        transactionId: paymentIntent?.id || paymentIntentId,
      };
    } catch (error: any) {
      console.warn("Stripe payment failed:", error?.message || error);
      return {
        success: false,
        error:
          error?.message ||
          "Card payment could not be completed. Verify backend and Stripe setup.",
      };
    }
  },

  /**
   * Process cash on delivery payment
   */
  processCashPayment: async (orderMetadata?: {
    amount?: number;
    orderId?: string;
    userId?: string;
    userName?: string;
    items?: { name: string; price: number; quantity: number }[];
  }): Promise<PaymentResult> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const transactionId = `COD-${Date.now().toString(36).toUpperCase()}`;

    // Log to backend
    if (orderMetadata) {
      const backendId = await stripeService.logCashPaymentOnBackend({
        amount: orderMetadata.amount || 0,
        orderId: orderMetadata.orderId,
        userId: orderMetadata.userId,
        userName: orderMetadata.userName,
        items: orderMetadata.items,
      });
      if (backendId) {
        return { success: true, transactionId: backendId };
      }
    }

    return {
      success: true,
      transactionId,
    };
  },

  /**
   * Format amount for display
   */
  formatAmount: (amount: number): string => {
    return `R${amount.toFixed(2)}`;
  },
};
