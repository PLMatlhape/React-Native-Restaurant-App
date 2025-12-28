// Navigation Types
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Root Stack Navigator
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  Auth: undefined;
  AdminDashboard: undefined;
  NotFound: undefined;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  HomeTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
  AdminTab: undefined;
};

// Home Stack Navigator
export type HomeStackParamList = {
  Home: undefined;
  FoodDetail: { item: FoodItem };
  Menu: { category?: string };
  Cart: undefined;
};

// Cart Stack Navigator
export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
};

// Orders Stack Navigator
export type OrdersStackParamList = {
  OrderHistory: undefined;
};

// Profile Stack Navigator
export type ProfileStackParamList = {
  Profile: undefined;
};

// Food Stack Navigator
export type FoodStackParamList = {
  HomeScreen: undefined;
  FoodDetail: { foodId: string; item?: FoodItem };
  MenuScreen: undefined;
};

// Admin Stack Navigator
export type AdminStackParamList = {
  Dashboard: undefined;
  ManageFood: undefined;
  OrderManagement: undefined;
};

// Navigation Props
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type FoodStackNavigationProp = NativeStackNavigationProp<FoodStackParamList>;
export type AdminStackNavigationProp = NativeStackNavigationProp<AdminStackParamList>;

// Route Props
export type FoodDetailRouteProp = RouteProp<FoodStackParamList, 'FoodDetail'>;

// User Types
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  name?: string;
  surname?: string;
  contactNumber?: string;
  address?: string;
  role?: 'user' | 'admin';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UserProfile {
  name: string;
  surname: string;
  contactNumber: string;
  address: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

// Food Types
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  rating?: number;
  reviews?: number;
  ingredients?: string[];
  allergens?: string[];
  preparationTime?: number;
  calories?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  image?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  estimatedDelivery?: Date;
}

// Auth Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  surname: string;
  contactNumber: string;
  address: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Theme Types
export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textLight: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  white: string;
  shadow: string;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export interface SalesData {
  date: string;
  amount: number;
  orders: number;
}

// Form Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface LoadingProps {
  visible?: boolean;
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
  useLottie?: boolean;
  lottieSize?: number;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: object;
  textStyle?: object;
}

export interface CardProps {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
  elevation?: number;
}

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  style?: object;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
}

// Declare JSON modules
// (moved to global.d.ts)
