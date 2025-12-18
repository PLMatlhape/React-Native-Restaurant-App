export const helpers = {
    // Format currency
    formatCurrency: (amount) => {
      return `R${parseFloat(amount).toFixed(2)}`;
    },
  
    // Format date
    formatDate: (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
  
    // Format date with time
    formatDateTime: (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
  
    // Format time
    formatTime: (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
  
    // Get relative time (e.g., "2 hours ago")
    getRelativeTime: (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
  
      if (diffInSeconds < 60) {
        return 'Just now';
      }
  
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      }
  
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      }
  
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }
  
      return helpers.formatDate(dateString);
    },
  
    // Truncate text
    truncateText: (text, maxLength) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
  
    // Capitalize first letter
    capitalizeFirst: (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  
    // Capitalize words
    capitalizeWords: (str) => {
      if (!str) return '';
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    },
  
    // Format phone number
    formatPhoneNumber: (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      
      if (cleaned.startsWith('27')) {
        return `+27 ${cleaned.substring(2, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
      }
      
      if (cleaned.startsWith('0')) {
        return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
      }
      
      return phone;
    },
  
    // Format card number
    formatCardNumber: (cardNumber) => {
      const cleaned = cardNumber.replace(/\s/g, '');
      const groups = cleaned.match(/.{1,4}/g);
      return groups ? groups.join(' ') : cleaned;
    },
  
    // Mask card number
    maskCardNumber: (cardNumber) => {
      const cleaned = cardNumber.replace(/\s/g, '');
      return `**** **** **** ${cleaned.slice(-4)}`;
    },
  
    // Calculate percentage
    calculatePercentage: (value, total) => {
      if (total === 0) return 0;
      return ((value / total) * 100).toFixed(1);
    },
  
    // Generate unique ID
    generateId: () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
  
    // Deep clone object
    deepClone: (obj) => {
      return JSON.parse(JSON.stringify(obj));
    },
  
    // Group array by key
    groupBy: (array, key) => {
      return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
          result[group] = [];
        }
        result[group].push(item);
        return result;
      }, {});
    },
  
    // Sort array
    sortBy: (array, key, order = 'asc') => {
      return [...array].sort((a, b) => {
        if (order === 'asc') {
          return a[key] > b[key] ? 1 : -1;
        }
        return a[key] < b[key] ? 1 : -1;
      });
    },
  
    // Calculate cart total
    calculateCartTotal: (cartItems) => {
      return cartItems.reduce((total, item) => {
        return total + (item.totalPrice * item.quantity);
      }, 0);
    },
  
    // Calculate order subtotal
    calculateSubtotal: (items) => {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
  
    // Get order status color
    getOrderStatusColor: (status) => {
      const statusColors = {
        pending: '#F57C00',
        confirmed: '#6F4E37',
        preparing: '#6F4E37',
        ready: '#2196F3',
        out_for_delivery: '#2196F3',
        delivered: '#388E3C',
        cancelled: '#D32F2F'
      };
      return statusColors[status] || '#757575';
    },
  
    // Get order status display text
    getOrderStatusText: (status) => {
      const statusTexts = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        ready: 'Ready',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      };
      return statusTexts[status] || status;
    },
  
    // Validate image URL
    isValidImageUrl: (url) => {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    },
  
    // Debounce function
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  
    // Throttle function
    throttle: (func, limit) => {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
  
    // Check if object is empty
    isEmpty: (obj) => {
      return Object.keys(obj).length === 0;
    },
  
    // Get initials from name
    getInitials: (name) => {
      if (!name) return '';
      const names = name.split(' ');
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    },
  
    // Calculate delivery estimate
    getDeliveryEstimate: () => {
      const now = new Date();
      const deliveryTime = new Date(now.getTime() + 45 * 60000); // 45 minutes
      return helpers.formatTime(deliveryTime);
    },
  
    // Get day of week
    getDayOfWeek: (dateString) => {
      const date = new Date(dateString);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    },
  
    // Check if business hours
    isBusinessHours: () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // Monday to Friday: 7am - 7pm
      // Saturday: 8am - 6pm
      // Sunday: 9am - 5pm
      
      if (day === 0) { // Sunday
        return hour >= 9 && hour < 17;
      } else if (day === 6) { // Saturday
        return hour >= 8 && hour < 18;
      } else { // Weekdays
        return hour >= 7 && hour < 19;
      }
    },
  
    // Generate order number
    generateOrderNumber: () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORD${timestamp.slice(-6)}${random}`;
    },
  
    // Search array
    searchArray: (array, searchTerm, keys) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return array.filter(item => {
        return keys.some(key => {
          const value = item[key];
          return value && value.toString().toLowerCase().includes(lowerSearchTerm);
        });
      });
    },
  
    // Calculate discount
    calculateDiscount: (originalPrice, discountPercentage) => {
      return originalPrice - (originalPrice * discountPercentage / 100);
    },
  
    // Format file size
    formatFileSize: (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
  };