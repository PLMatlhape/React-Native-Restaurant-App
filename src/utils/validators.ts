/**
 * Validation utility functions
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface RegistrationData {
  name: string;
  surname: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

export const validators = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone number validation (South African format)
  isValidPhone: (phone: string): boolean => {
    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // Check for SA format: 10 digits starting with 0, or with +27
    const phoneRegex = /^(?:\+27|0)[0-9]{9}$/;
    return phoneRegex.test(cleanPhone);
  },

  // Password validation
  isValidPassword: (password: string): boolean => {
    return password && password.length >= 6;
  },

  // Strong password validation
  isStrongPassword: (password: string): { isValid: boolean; message: string } => {
    if (!password || password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain an uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain a lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain a number' };
    }
    return { isValid: true, message: '' };
  },

  // Card number validation (Luhn algorithm)
  isValidCardNumber: (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  // CVV validation
  isValidCVV: (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  },

  // Expiry date validation (MM/YY format)
  isValidExpiryDate: (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return false;
    }

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    if (month < 1 || month > 12) {
      return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear) {
      return false;
    }

    if (year === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  },

  // Name validation (letters, spaces, hyphens only)
  isValidName: (name: string): boolean => {
    return /^[a-zA-Z\s-]{2,50}$/.test(name);
  },

  // Address validation
  isValidAddress: (address: string): boolean => {
    return address && address.trim().length >= 10;
  },

  // Price validation
  isValidPrice: (price: string | number): boolean => {
    const numPrice = parseFloat(price as string);
    return !isNaN(numPrice) && numPrice > 0;
  },

  // Required field validation
  isRequired: (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.toString().trim().length > 0;
  },

  // Quantity validation
  isValidQuantity: (quantity: number): boolean => {
    return Number.isInteger(quantity) && quantity > 0 && quantity <= 99;
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // South African ID validation
  isValidSAID: (idNumber: string): boolean => {
    const cleanId = idNumber.replace(/\s/g, '');
    
    if (!/^\d{13}$/.test(cleanId)) {
      return false;
    }

    // Luhn algorithm for SA ID
    let total = 0;
    let count = 0;

    for (let i = 0; i < 13; i++) {
      const digit = parseInt(cleanId[i], 10);
      
      if (i % 2 === 0) {
        total += digit;
      } else {
        count += digit;
      }
    }

    count *= 2;
    
    let countTotal = 0;
    count.toString().split('').forEach(d => {
      countTotal += parseInt(d, 10);
    });

    total += countTotal;
    
    return total % 10 === 0;
  },

  // Validate registration form
  validateRegistration: (data: RegistrationData): ValidationResult => {
    const errors: string[] = [];

    if (!validators.isValidName(data.name)) {
      errors.push('Please enter a valid first name');
    }

    if (!validators.isValidName(data.surname)) {
      errors.push('Please enter a valid surname');
    }

    if (!validators.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!validators.isValidPhone(data.contactNumber)) {
      errors.push('Please enter a valid phone number');
    }

    if (!validators.isValidPassword(data.password)) {
      errors.push('Password must be at least 6 characters');
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate payment form
  validatePayment: (data: PaymentData): ValidationResult => {
    const errors: string[] = [];

    if (!validators.isValidCardNumber(data.cardNumber)) {
      errors.push('Please enter a valid card number');
    }

    if (!validators.isValidExpiryDate(data.expiryDate)) {
      errors.push('Please enter a valid expiry date (MM/YY)');
    }

    if (!validators.isValidCVV(data.cvv)) {
      errors.push('Please enter a valid CVV');
    }

    if (!validators.isRequired(data.cardHolder)) {
      errors.push('Please enter the cardholder name');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default validators;
