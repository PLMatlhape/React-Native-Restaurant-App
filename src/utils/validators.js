export const validators = {
    // Email validation
    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  
    // Phone number validation (South African format)
    isValidPhone: (phone) => {
      // Remove spaces and dashes
      const cleanPhone = phone.replace(/[\s-]/g, '');
      // Check for SA format: 10 digits starting with 0, or with +27
      const phoneRegex = /^(?:\+27|0)[0-9]{9}$/;
      return phoneRegex.test(cleanPhone);
    },
  
    // Password validation
    isValidPassword: (password) => {
      return password && password.length >= 6;
    },
  
    // Card number validation (Luhn algorithm)
    isValidCardNumber: (cardNumber) => {
      const cleanNumber = cardNumber.replace(/\s/g, '');
      
      if (!/^\d{13,19}$/.test(cleanNumber)) {
        return false;
      }
  
      let sum = 0;
      let isEven = false;
  
      for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i]);
  
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
    isValidCVV: (cvv) => {
      return /^\d{3,4}$/.test(cvv);
    },
  
    // Expiry date validation (MM/YY format)
    isValidExpiryDate: (expiry) => {
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return false;
      }
  
      const [month, year] = expiry.split('/').map(num => parseInt(num));
      
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
    isValidName: (name) => {
      return /^[a-zA-Z\s-]{2,50}$/.test(name);
    },
  
    // Address validation
    isValidAddress: (address) => {
      return address && address.trim().length >= 10;
    },
  
    // Price validation
    isValidPrice: (price) => {
      const numPrice = parseFloat(price);
      return !isNaN(numPrice) && numPrice > 0;
    },
  
    // Required field validation
    isRequired: (value) => {
      return value && value.toString().trim().length > 0;
    },
  
    // Min length validation
    hasMinLength: (value, minLength) => {
      return value && value.toString().length >= minLength;
    },
  
    // Max length validation
    hasMaxLength: (value, maxLength) => {
      return value && value.toString().length <= maxLength;
    },
  
    // Numeric validation
    isNumeric: (value) => {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
  
    // URL validation
    isValidURL: (url) => {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    },
  
    // Validate entire registration form
    validateRegistration: (formData) => {
      const errors = {};
  
      if (!validators.isRequired(formData.name)) {
        errors.name = 'Name is required';
      } else if (!validators.isValidName(formData.name)) {
        errors.name = 'Please enter a valid name';
      }
  
      if (!validators.isRequired(formData.surname)) {
        errors.surname = 'Surname is required';
      } else if (!validators.isValidName(formData.surname)) {
        errors.surname = 'Please enter a valid surname';
      }
  
      if (!validators.isRequired(formData.email)) {
        errors.email = 'Email is required';
      } else if (!validators.isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
  
      if (!validators.isRequired(formData.password)) {
        errors.password = 'Password is required';
      } else if (!validators.isValidPassword(formData.password)) {
        errors.password = 'Password must be at least 6 characters';
      }
  
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
  
      if (!validators.isRequired(formData.contactNumber)) {
        errors.contactNumber = 'Contact number is required';
      } else if (!validators.isValidPhone(formData.contactNumber)) {
        errors.contactNumber = 'Please enter a valid phone number';
      }
  
      if (!validators.isRequired(formData.address)) {
        errors.address = 'Address is required';
      } else if (!validators.isValidAddress(formData.address)) {
        errors.address = 'Address must be at least 10 characters';
      }
  
      if (!validators.isRequired(formData.cardNumber)) {
        errors.cardNumber = 'Card number is required';
      } else if (!validators.isValidCardNumber(formData.cardNumber)) {
        errors.cardNumber = 'Please enter a valid card number';
      }
  
      if (!validators.isRequired(formData.cardHolder)) {
        errors.cardHolder = 'Card holder name is required';
      }
  
      if (!validators.isRequired(formData.expiryDate)) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!validators.isValidExpiryDate(formData.expiryDate)) {
        errors.expiryDate = 'Invalid expiry date (MM/YY)';
      }
  
      if (!validators.isRequired(formData.cvv)) {
        errors.cvv = 'CVV is required';
      } else if (!validators.isValidCVV(formData.cvv)) {
        errors.cvv = 'Invalid CVV';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  };