import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    DocumentSnapshot,
    getDoc,
    getDocs,
    orderBy,
    query,
    QuerySnapshot,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './config';

// Types
interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface FoodItemData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface Order {
  id: string;
  userId: string;
  userInfo: {
    name: string;
    surname: string;
    email: string;
    contactNumber: string;
  };
  items: OrderItem[];
  deliveryAddress: string;
  specialInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  customizations: any;
}

interface OrderData {
  userId: string;
  userInfo: {
    name: string;
    surname: string;
    email: string;
    contactNumber: string;
  };
  items: OrderItem[];
  deliveryAddress: string;
  specialInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
}

interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  id?: string;
  error?: string;
}

export const firestoreService = {
  // Food Items
  getFoodItems: async (category: string | null = null): Promise<ServiceResult<FoodItem[]>> => {
    try {
      let q;
      if (category) {
        q = query(collection(db, 'foodItems'), where('category', '==', category));
      } else {
        q = query(collection(db, 'foodItems'));
      }
      
      const querySnapshot: QuerySnapshot = await getDocs(q);
      const items: FoodItem[] = [];
      querySnapshot.forEach((docSnapshot) => {
        items.push({ id: docSnapshot.id, ...docSnapshot.data() } as FoodItem);
      });
      
      return { success: true, data: items };
    } catch (error: any) {
      console.error('Get food items error:', error);
      return { success: false, error: error.message };
    }
  },

  getFoodItemById: async (itemId: string): Promise<ServiceResult<FoodItem>> => {
    try {
      const docRef = doc(db, 'foodItems', itemId);
      const docSnap: DocumentSnapshot = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as FoodItem };
      }
      return { success: false, error: 'Item not found' };
    } catch (error: any) {
      console.error('Get food item error:', error);
      return { success: false, error: error.message };
    }
  },

  addFoodItem: async (itemData: FoodItemData): Promise<ServiceResult> => {
    try {
      const docRef = await addDoc(collection(db, 'foodItems'), {
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Add food item error:', error);
      return { success: false, error: error.message };
    }
  },

  updateFoodItem: async (itemId: string, updates: Partial<FoodItemData>): Promise<ServiceResult> => {
    try {
      const itemRef = doc(db, 'foodItems', itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Update food item error:', error);
      return { success: false, error: error.message };
    }
  },

  deleteFoodItem: async (itemId: string): Promise<ServiceResult> => {
    try {
      await deleteDoc(doc(db, 'foodItems', itemId));
      return { success: true };
    } catch (error: any) {
      console.error('Delete food item error:', error);
      return { success: false, error: error.message };
    }
  },

  // Orders
  createOrder: async (orderData: OrderData): Promise<ServiceResult> => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Create order error:', error);
      return { success: false, error: error.message };
    }
  },

  getUserOrders: async (userId: string): Promise<ServiceResult<Order[]>> => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot: QuerySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((docSnapshot) => {
        orders.push({ id: docSnapshot.id, ...docSnapshot.data() } as Order);
      });
      
      return { success: true, data: orders };
    } catch (error: any) {
      console.error('Get user orders error:', error);
      return { success: false, error: error.message };
    }
  },

  getAllOrders: async (): Promise<ServiceResult<Order[]>> => {
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot: QuerySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((docSnapshot) => {
        orders.push({ id: docSnapshot.id, ...docSnapshot.data() } as Order);
      });
      
      return { success: true, data: orders };
    } catch (error: any) {
      console.error('Get all orders error:', error);
      return { success: false, error: error.message };
    }
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<ServiceResult> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Update order status error:', error);
      return { success: false, error: error.message };
    }
  },

  // User Profile
  getUserProfile: async (userId: string): Promise<ServiceResult<DocumentData>> => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap: DocumentSnapshot = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      }
      return { success: false, error: 'User not found' };
    } catch (error: any) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  },

  updateUserProfile: async (userId: string, updates: Record<string, any>): Promise<ServiceResult> => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Update user profile error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default firestoreService;
