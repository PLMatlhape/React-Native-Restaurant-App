/**
 * Helper utility functions
 */

interface CartItem {
  totalPrice: number;
  quantity: number;
}

interface OrderItem {
  price: number;
  quantity: number;
}

interface GroupedResult<T> {
  [key: string]: T[];
}

type DebounceFunction = (...args: any[]) => void;

export const helpers = {
  // Format currency
  formatCurrency: (amount: number | string): string => {
    return `R${parseFloat(amount as string).toFixed(2)}`;
  },

  // Format date
  formatDate: (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Format date with time
  formatDateTime: (dateString: string | Date): string => {
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
  formatTime: (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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
  truncateText: (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Capitalize first letter
  capitalizeFirst: (str: string | null | undefined): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Capitalize words
  capitalizeWords: (str: string | null | undefined): string => {
    if (!str) return '';
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  },

  // Format phone number
  formatPhoneNumber: (phone: string): string => {
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
  formatCardNumber: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  },

  // Mask card number
  maskCardNumber: (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  },

  // Calculate percentage
  calculatePercentage: (value: number, total: number): string => {
    if (total === 0) return '0';
    return ((value / total) * 100).toFixed(1);
  },

  // Generate unique ID
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Deep clone object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Group array by key
  groupBy: <T extends Record<string, any>>(array: T[], key: keyof T): GroupedResult<T> => {
    return array.reduce((result: GroupedResult<T>, item: T) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  },

  // Sort array
  sortBy: <T extends Record<string, any>>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  },

  // Calculate cart total
  calculateCartTotal: (cartItems: CartItem[]): number => {
    return cartItems.reduce((total, item) => {
      return total + (item.totalPrice * item.quantity);
    }, 0);
  },

  // Calculate order subtotal
  calculateSubtotal: (items: OrderItem[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Get order status color
  getOrderStatusColor: (status: string): string => {
    const statusColors: Record<string, string> = {
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
  getOrderStatusText: (status: string): string => {
    const statusTexts: Record<string, string> = {
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
  isValidImageUrl: (url: string | null | undefined): boolean => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  },

  // Debounce function
  debounce: <F extends DebounceFunction>(func: F, wait: number): F => {
    let timeout: NodeJS.Timeout | null = null;
    return ((...args: Parameters<F>) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    }) as F;
  },

  // Throttle function
  throttle: <F extends DebounceFunction>(func: F, limit: number): F => {
    let lastFunc: NodeJS.Timeout | null = null;
    let lastRan: number | null = null;
    return ((...args: Parameters<F>) => {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        if (lastFunc) clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - (lastRan as number) >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }) as F;
  },

  // Check if object is empty
  isEmpty: (obj: object | null | undefined): boolean => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  },

  // Get initials from name
  getInitials: (name: string | null | undefined): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  // Calculate estimated delivery time
  getEstimatedDeliveryTime: (): string => {
    const now = new Date();
    const estimatedTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    return helpers.formatTime(estimatedTime);
  }
};

export default helpers;
