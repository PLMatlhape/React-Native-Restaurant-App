import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp
  } from 'firebase/firestore';
  import { db } from './config';
  
  export const firestoreService = {
    // Food Items
    getFoodItems: async (category = null) => {
      try {
        let q;
        if (category) {
          q = query(collection(db, 'foodItems'), where('category', '==', category));
        } else {
          q = query(collection(db, 'foodItems'));
        }
        
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: items };
      } catch (error) {
        console.error('Get food items error:', error);
        return { success: false, error: error.message };
      }
    },
  
    getFoodItemById: async (itemId) => {
      try {
        const docRef = doc(db, 'foodItems', itemId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, error: 'Item not found' };
      } catch (error) {
        console.error('Get food item error:', error);
        return { success: false, error: error.message };
      }
    },
  
    addFoodItem: async (itemData) => {
      try {
        const docRef = await addDoc(collection(db, 'foodItems'), {
          ...itemData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error('Add food item error:', error);
        return { success: false, error: error.message };
      }
    },
  
    updateFoodItem: async (itemId, updates) => {
      try {
        const itemRef = doc(db, 'foodItems', itemId);
        await updateDoc(itemRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        return { success: true };
      } catch (error) {
        console.error('Update food item error:', error);
        return { success: false, error: error.message };
      }
    },
  
    deleteFoodItem: async (itemId) => {
      try {
        await deleteDoc(doc(db, 'foodItems', itemId));
        return { success: true };
      } catch (error) {
        console.error('Delete food item error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Orders
    createOrder: async (orderData) => {
      try {
        const docRef = await addDoc(collection(db, 'orders'), {
          ...orderData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error('Create order error:', error);
        return { success: false, error: error.message };
      }
    },
  
    getUserOrders: async (userId) => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: orders };
      } catch (error) {
        console.error('Get user orders error:', error);
        return { success: false, error: error.message };
      }
    },
  
    getAllOrders: async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: orders };
      } catch (error) {
        console.error('Get all orders error:', error);
        return { success: false, error: error.message };
      }
    },
  
    updateOrderStatus: async (orderId, status) => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
          status,
          updatedAt: new Date().toISOString()
        });
        
        return { success: true };
      } catch (error) {
        console.error('Update order status error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Categories
    getCategories: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: categories };
      } catch (error) {
        console.error('Get categories error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Restaurant Info
    getRestaurantInfo: async () => {
      try {
        const docRef = doc(db, 'restaurant', 'info');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { success: true, data: docSnap.data() };
        }
        return { success: false, error: 'Restaurant info not found' };
      } catch (error) {
        console.error('Get restaurant info error:', error);
        return { success: false, error: error.message };
      }
    },
  
    updateRestaurantInfo: async (updates) => {
      try {
        const restaurantRef = doc(db, 'restaurant', 'info');
        await updateDoc(restaurantRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        return { success: true };
      } catch (error) {
        console.error('Update restaurant info error:', error);
        return { success: false, error: error.message };
      }
    }
  };