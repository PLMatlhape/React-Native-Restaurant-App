
export interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  white: string;
  black: string;
  text: string;
  textLight: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  lightBrown: string;
  cream: string;
  shadow?: string;
}

export const COLORS: Colors = {
  primary: '#6F4E37',
  secondary: '#D2B48C',
  accent: '#8B4513',
  background: '#F5E6D3',
  white: '#FFFFFF',
  black: '#000000',
  text: '#3E2723',
  textLight: '#795548',
  border: '#BCAAA4',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  lightBrown: '#D7CCC8',
  cream: '#FFF8E1',
  shadow: '#000000',
};

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Coffee', icon: '☕' },
  { id: '2', name: 'Tea', icon: '🍵' },
  { id: '3', name: 'Cappuccino', icon: '☕' },
  { id: '4', name: 'Waffles', icon: '🧇' },
  { id: '5', name: 'Cakes', icon: '🍰' },
  { id: '6', name: 'Churros', icon: '🥨' },
  { id: '7', name: 'Croissants', icon: '🥐' },
  { id: '8', name: 'Crepes', icon: '🥞' },
  { id: '9', name: 'Muffins', icon: '🧁' },
  { id: '10', name: 'Donuts', icon: '🍩' },
  { id: '11', name: 'Oreos', icon: '🍪' },
  { id: '12', name: 'Pancakes', icon: '🥞' },
  { id: '13', name: 'Cake Rolls', icon: '🍥' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export interface SizeOption {
  id: string;
  name: string;
  price: number;
}

export const COFFEE_SIZES: SizeOption[] = [
  { id: 'small', name: 'Small', price: 0 },
  { id: 'medium', name: 'Medium', price: 5 },
  { id: 'large', name: 'Large', price: 10 },
];

export interface MilkOption {
  id: string;
  name: string;
  price: number;
}

export const MILK_OPTIONS: MilkOption[] = [
  { id: 'regular', name: 'Regular Milk', price: 0 },
  { id: 'almond', name: 'Almond Milk', price: 8 },
  { id: 'oat', name: 'Oat Milk', price: 8 },
  { id: 'soy', name: 'Soy Milk', price: 7 },
];

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export const EXTRAS: ExtraOption[] = [
  { id: 'extra_shot', name: 'Extra Shot', price: 10 },
  { id: 'whipped_cream', name: 'Whipped Cream', price: 5 },
  { id: 'caramel_drizzle', name: 'Caramel Drizzle', price: 5 },
  { id: 'chocolate_syrup', name: 'Chocolate Syrup', price: 5 },
  { id: 'vanilla_syrup', name: 'Vanilla Syrup', price: 5 },
];

export interface SideOption {
  id: string;
  name: string;
  price: number;
}

export const SIDE_OPTIONS: SideOption[] = [
  { id: 'butter', name: 'Butter', price: 0 },
  { id: 'jam', name: 'Jam', price: 0 },
  { id: 'honey', name: 'Honey', price: 0 },
  { id: 'syrup', name: 'Maple Syrup', price: 5 },
];

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_CARD: 'Please enter a valid card number',
} as const;

export type ValidationMessageType = typeof VALIDATION_MESSAGES[keyof typeof VALIDATION_MESSAGES];

export const SCREEN_NAMES = {
  // Auth
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  PROFILE: 'Profile',

  // Main
  HOME: 'Home',
  MENU: 'Menu',
  FOOD_DETAIL: 'FoodDetail',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  ORDER_HISTORY: 'OrderHistory',

  // Admin
  ADMIN_DASHBOARD: 'AdminDashboard',
  MANAGE_FOOD: 'ManageFood',
  ORDER_MANAGEMENT: 'OrderManagement',

  // Common
  NOT_FOUND: 'NotFound',
} as const;

export type ScreenNameType = typeof SCREEN_NAMES[keyof typeof SCREEN_NAMES];
