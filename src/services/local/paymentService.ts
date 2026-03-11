// Local payment service - mock payment processing
// Card validation + simulated payment

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

export const paymentService = {
  validateCard: (card: PaymentDetails): { valid: boolean; error?: string } => {
    const cardNum = card.cardNumber.replace(/\s/g, "");

    if (!cardNum || cardNum.length < 13 || cardNum.length > 19) {
      return { valid: false, error: "Invalid card number" };
    }

    if (!card.cardHolder || card.cardHolder.trim().length < 2) {
      return { valid: false, error: "Card holder name is required" };
    }

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
    const expiry = new Date(year, month, 0);
    if (expiry < now) {
      return { valid: false, error: "Card has expired" };
    }

    if (!card.cvv || card.cvv.length < 3 || card.cvv.length > 4) {
      return { valid: false, error: "Invalid CVV" };
    }

    return { valid: true };
  },

  processCardPayment: async (
    amount: number,
    card: PaymentDetails,
  ): Promise<PaymentResult> => {
    try {
      const validation = paymentService.validateCard(card);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // 95% success rate for demo
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        return { success: true, transactionId };
      } else {
        return { success: false, error: "Payment declined. Please try again." };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Payment processing failed",
      };
    }
  },

  processCashPayment: async (): Promise<PaymentResult> => {
    // Simulate brief processing
    await new Promise((resolve) => setTimeout(resolve, 500));
    const transactionId = `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return { success: true, transactionId };
  },

  formatCardNumber: (text: string): string => {
    const cleaned = text.replace(/\D/g, "").substring(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  },

  formatExpiryDate: (text: string): string => {
    const cleaned = text.replace(/\D/g, "").substring(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    return cleaned;
  },

  getCardType: (cardNumber: string): string => {
    const num = cardNumber.replace(/\s/g, "");
    if (/^4/.test(num)) return "Visa";
    if (/^5[1-5]/.test(num)) return "Mastercard";
    if (/^3[47]/.test(num)) return "Amex";
    if (/^6(?:011|5)/.test(num)) return "Discover";
    return "Card";
  },
};

export default paymentService;
