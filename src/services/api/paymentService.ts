import { firestoreService } from "../firebase/firestoreService";

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface OrderPaymentData {
  userId: string;
  userInfo: {
    name: string;
    surname: string;
    email: string;
    contactNumber: string;
  };
  items: Array<{
    foodId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }>;
  deliveryAddress: string;
  specialInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  notes?: string;
}

/**
 * Payment Service
 * Handles payment processing and order creation.
 * In production, this would integrate with a payment gateway (Stripe, PayFast, etc.)
 * Currently simulates payment processing for development.
 */
export const paymentService = {
  /**
   * Validate card details
   */
  validateCard: (card: PaymentDetails): { valid: boolean; error?: string } => {
    const cardNum = card.cardNumber.replace(/\s/g, "");

    if (!cardNum || cardNum.length < 13 || cardNum.length > 19) {
      return { valid: false, error: "Invalid card number" };
    }

    if (!card.cardHolder || card.cardHolder.trim().length < 2) {
      return { valid: false, error: "Card holder name is required" };
    }

    // Check expiry (MM/YY format)
    const expiryMatch = card.expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      return { valid: false, error: "Invalid expiry date format (MM/YY)" };
    }

    const month = parseInt(expiryMatch[1], 10);
    const year = parseInt(expiryMatch[2], 10) + 2000;

    if (month < 1 || month > 12) {
      return { valid: false, error: "Invalid expiry month" };
    }

    const now = new Date();
    const expiry = new Date(year, month, 0); // Last day of expiry month
    if (expiry < now) {
      return { valid: false, error: "Card has expired" };
    }

    if (!card.cvv || card.cvv.length < 3 || card.cvv.length > 4) {
      return { valid: false, error: "Invalid CVV" };
    }

    return { valid: true };
  },

  /**
   * Process payment (simulated)
   * In production, this would call a real payment gateway API.
   */
  processPayment: async (
    amount: number,
    card: PaymentDetails,
  ): Promise<PaymentResult> => {
    try {
      // Validate card first
      const validation = paymentService.validateCard(card);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate a transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Simulate: 95% success rate for demo
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        return {
          success: true,
          transactionId,
        };
      } else {
        return {
          success: false,
          error: "Payment declined. Please try again or use a different card.",
        };
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        error: error.message || "Payment processing failed",
      };
    }
  },

  /**
   * Process cash on delivery (no real payment needed)
   */
  processCashOnDelivery: async (): Promise<PaymentResult> => {
    const transactionId = `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return {
      success: true,
      transactionId,
    };
  },

  /**
   * Create order after successful payment
   */
  createOrder: async (
    orderData: OrderPaymentData,
    transactionId: string,
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      const order = {
        userId: orderData.userId,
        userInfo: orderData.userInfo,
        items: orderData.items,
        deliveryAddress: orderData.deliveryAddress,
        specialInstructions: orderData.specialInstructions || "",
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
      };

      const result = await firestoreService.createOrder(order);
      if (result.success) {
        return { success: true, orderId: result.id };
      }
      return {
        success: false,
        error: result.error || "Failed to create order",
      };
    } catch (error: any) {
      console.error("Create order error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Full checkout flow: validate → pay → create order
   */
  checkout: async (
    orderData: OrderPaymentData,
    card?: PaymentDetails,
  ): Promise<{
    success: boolean;
    orderId?: string;
    transactionId?: string;
    error?: string;
  }> => {
    try {
      let paymentResult: PaymentResult;

      if (orderData.paymentMethod === "cash") {
        paymentResult = await paymentService.processCashOnDelivery();
      } else if (card) {
        paymentResult = await paymentService.processPayment(
          orderData.total,
          card,
        );
      } else {
        return {
          success: false,
          error: "Payment details required for card payment",
        };
      }

      if (!paymentResult.success) {
        return { success: false, error: paymentResult.error };
      }

      // Create the order
      const orderResult = await paymentService.createOrder(
        orderData,
        paymentResult.transactionId!,
      );

      if (orderResult.success) {
        return {
          success: true,
          orderId: orderResult.orderId,
          transactionId: paymentResult.transactionId,
        };
      }

      return { success: false, error: orderResult.error };
    } catch (error: any) {
      console.error("Checkout error:", error);
      return { success: false, error: error.message };
    }
  },
};

export default paymentService;
