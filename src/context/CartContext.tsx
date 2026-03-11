// Cart context - manages shopping cart with AsyncStorage persistence
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export interface CartItem {
  id: string;
  cartItemId: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
  customizations?: any;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, "cartItemId">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItem: (cartItemId: string, updates: Partial<CartItem>) => void;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (!loading) saveCart();
  }, [cartItems, loading]);

  const loadCart = async () => {
    try {
      const data = await AsyncStorage.getItem("coffee_shop_cart");
      if (data) setCartItems(JSON.parse(data));
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem("coffee_shop_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addToCart = (item: Omit<CartItem, "cartItemId">) => {
    const existingIndex = cartItems.findIndex(
      (ci) =>
        ci.foodId === item.foodId &&
        JSON.stringify(ci.customizations) ===
          JSON.stringify(item.customizations),
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += item.quantity;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        { ...item, cartItemId: `cart_${Date.now()}` },
      ]);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item,
      ),
    );
  };

  const updateCartItem = (cartItemId: string, updates: Partial<CartItem>) => {
    setCartItems(
      cartItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, ...updates } : item,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCartItem,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
