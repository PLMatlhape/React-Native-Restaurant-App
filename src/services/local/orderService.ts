// Local order service - stores orders in AsyncStorage
// No Firebase needed

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
  customizations?: any;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "card" | "cash";
  status: OrderStatus;
  deliveryAddress: string;
  transactionId?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

const ORDERS_KEY = "coffee_shop_orders";

const getStoredOrders = async (): Promise<Order[]> => {
  try {
    const data = await AsyncStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveOrders = async (orders: Order[]): Promise<void> => {
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const orderService = {
  createOrder: async (
    orderData: Omit<Order, "id" | "status" | "createdAt" | "estimatedDelivery">,
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    try {
      const orders = await getStoredOrders();

      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min from now
      };

      orders.unshift(newOrder); // Add to beginning
      await saveOrders(orders);

      return { success: true, order: newOrder };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create order",
      };
    }
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const orders = await getStoredOrders();
    return orders
      .filter((o) => o.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    const orders = await getStoredOrders();
    return orders.find((o) => o.id === orderId) || null;
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
  ): Promise<boolean> => {
    try {
      const orders = await getStoredOrders();
      const index = orders.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        orders[index].status = status;
        await saveOrders(orders);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  getAllOrders: async (): Promise<Order[]> => {
    const orders = await getStoredOrders();
    return orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
};

export default orderService;
