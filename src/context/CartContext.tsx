import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CartItem as CartItemType } from '../types';

interface CartItem extends CartItemType {
  cartItemId: string;
  totalPrice: number;
  customizations?: any;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateItemCustomizations: (cartItemId: string, customizations: any, price: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveCart();
    }
  }, [cartItems, loading]);

  const loadCart = async (): Promise<void> => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item: Omit<CartItem, 'cartItemId'>): void => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
    );

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedCart);
    } else {
      // New item, add to cart
      setCartItems([...cartItems, { ...item, cartItemId: Date.now().toString() } as CartItem]);
    }
  };

  const removeFromCart = (cartItemId: string): void => {
    setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
  };

  const updateItemCustomizations = (
    cartItemId: string,
    customizations: any,
    price: number
  ): void => {
    const updatedCart = cartItems.map((item) =>
      item.cartItemId === cartItemId
        ? { ...item, customizations, totalPrice: price }
        : item
    );
    setCartItems(updatedCart);
  };

  const clearCart = (): void => {
    setCartItems([]);
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      return total + item.totalPrice * item.quantity;
    }, 0);
  };

  const getCartCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemCustomizations,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
