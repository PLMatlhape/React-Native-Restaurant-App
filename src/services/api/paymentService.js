// Payment service for processing orders
// This is a mock implementation for development/testing
// In production, integrate with real payment gateway (Stripe, PayPal, PayFast, etc.)

import { validators } from '../../utils/validators';

export const paymentService = {
  // Process payment (mock implementation)
  processPayment: async (paymentData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate payment data
      const validation = paymentService.validatePaymentData(paymentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Mock payment processing
      // In production, this would call your payment gateway API
      const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate for testing

      if (isPaymentSuccessful) {
        return {
          success: true,
          transactionId: generateTransactionId(),
          amount: paymentData.amount,
          currency: 'ZAR',
          timestamp: new Date().toISOString(),
          message: 'Payment processed successfully'
        };
      } else {
        return {
          success: false,
          error: 'Payment declined. Please try again or use a different payment method.'
        };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Payment processing failed. Please try again.'
      };
    }
  },

  // Validate payment data
  validatePaymentData: (data) => {
    if (!data.cardNumber || !validators.isValidCardNumber(data.cardNumber)) {
      return { isValid: false, error: 'Invalid card number' };
    }

    if (!data.expiryDate || !validators.isValidExpiryDate(data.expiryDate)) {
      return { isValid: false, error: 'Invalid expiry date' };
    }

    if (!data.cvv || !validators.isValidCVV(data.cvv)) {
      return { isValid: false, error: 'Invalid CVV' };
    }

    if (!data.cardHolder || data.cardHolder.trim().length < 3) {
      return { isValid: false, error: 'Invalid card holder name' };
    }

    if (!data.amount || data.amount <= 0) {
      return { isValid: false, error: 'Invalid amount' };
    }

    return { isValid: true };
  },

  // Verify card (mock implementation)
  verifyCard: async (cardNumber) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!validators.isValidCardNumber(cardNumber)) {
        return {
          success: false,
          error: 'Invalid card number'
        };
      }

      // Detect card type
      const cardType = detectCardType(cardNumber);

      return {
        success: true,
        cardType,
        message: 'Card verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Card verification failed'
      };
    }
  },

  // Save payment method (mock implementation)
  savePaymentMethod: async (paymentMethod) => {
    try {
      // In production, this would securely store payment method
      // using tokenization from payment gateway
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        paymentMethodId: generatePaymentMethodId(),
        message: 'Payment method saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to save payment method'
      };
    }
  },

  // Get saved payment methods (mock implementation)
  getSavedPaymentMethods: async (userId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data - in production, fetch from backend
      return {
        success: true,
        paymentMethods: [
          {
            id: '1',
            type: 'visa',
            last4: '4242',
            expiryMonth: '12',
            expiryYear: '25',
            isDefault: true
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch payment methods'
      };
    }
  },

  // Process refund (mock implementation)
  processRefund: async (transactionId, amount) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        refundId: generateRefundId(),
        amount,
        timestamp: new Date().toISOString(),
        message: 'Refund processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Refund processing failed'
      };
    }
  },

  // Calculate transaction fee
  calculateFee: (amount) => {
    // Example: 2.9% + R1.50 per transaction
    const percentageFee = amount * 0.029;
    const fixedFee = 1.50;
    return parseFloat((percentageFee + fixedFee).toFixed(2));
  },

  // Format amount for display
  formatAmount: (amount, currency = 'ZAR') => {
    const currencySymbols = {
      ZAR: 'R',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };

    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  }
};

// Helper functions
function generateTransactionId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp.slice(-8)}${random}`;
}

function generatePaymentMethodId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PM${timestamp.slice(-6)}${random}`;
}

function generateRefundId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `REF${timestamp.slice(-6)}${random}`;
}

function detectCardType(cardNumber) {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  // Visa
  if (/^4/.test(cleanNumber)) {
    return 'visa';
  }

  // Mastercard
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard';
  }

  // American Express
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  }

  // Discover
  if (/^6(?:011|5)/.test(cleanNumber)) {
    return 'discover';
  }

  return 'unknown';
}

// Export for Stripe integration (example)
export const stripeConfig = {
  publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
  // Add more Stripe configuration here
};

// Export for PayPal integration (example)
export const paypalConfig = {
  clientId: 'YOUR_PAYPAL_CLIENT_ID',
  // Add more PayPal configuration here
};

// Export for PayFast integration (South African payment gateway)
export const payfastConfig = {
  merchantId: 'YOUR_PAYFAST_MERCHANT_ID',
  merchantKey: 'YOUR_PAYFAST_MERCHANT_KEY',
  // Add more PayFast configuration here
};

export default paymentService;