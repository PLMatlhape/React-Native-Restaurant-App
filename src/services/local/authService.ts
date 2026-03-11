// Local auth service - uses AsyncStorage instead of Firebase
// Simple, straightforward user management

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserData {
  id: string;
  email: string;
  name: string;
  surname: string;
  contactNumber: string;
  address: string;
  password: string; // stored locally only
  role?: "user" | "admin";
  createdAt: string;
}

export const ADMIN_CREDENTIALS = {
  email: "admin@coffeeshop.com",
  password: "Admin@123",
};

export interface AuthResult {
  success: boolean;
  user?: UserData;
  error?: string;
}

const USERS_KEY = "coffee_shop_users";
const CURRENT_USER_KEY = "coffee_shop_current_user";

// Helper to get all users from storage
const getStoredUsers = async (): Promise<UserData[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Helper to save users to storage
const saveUsers = async (users: UserData[]): Promise<void> => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // Seed admin account on first launch
  seedAdmin: async (): Promise<void> => {
    try {
      const users = await getStoredUsers();
      const adminExists = users.some(
        (u) => u.email === ADMIN_CREDENTIALS.email,
      );
      if (!adminExists) {
        const adminUser: UserData = {
          id: "admin_001",
          email: ADMIN_CREDENTIALS.email,
          name: "Admin",
          surname: "Manager",
          contactNumber: "0000000000",
          address: "Coffee Shop HQ",
          password: ADMIN_CREDENTIALS.password,
          role: "admin",
          createdAt: new Date().toISOString(),
        };
        users.push(adminUser);
        await saveUsers(users);
      }
    } catch (error) {
      console.error("Failed to seed admin:", error);
    }
  },

  register: async (
    email: string,
    password: string,
    userData: {
      name: string;
      surname: string;
      contactNumber: string;
      address: string;
    },
  ): Promise<AuthResult> => {
    try {
      const users = await getStoredUsers();

      // Check if email already exists
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return {
          success: false,
          error: "An account with this email already exists",
        };
      }

      const newUser: UserData = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase().trim(),
        name: userData.name.trim(),
        surname: userData.surname.trim(),
        contactNumber: userData.contactNumber.trim(),
        address: userData.address.trim(),
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await saveUsers(users);

      // Auto-login after register
      const { password: _, ...safeUser } = newUser;
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

      return { success: true, user: newUser };
    } catch (error: any) {
      return { success: false, error: error.message || "Registration failed" };
    }
  },

  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const users = await getStoredUsers();
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase().trim() &&
          u.password === password,
      );

      if (!user) {
        return { success: false, error: "Invalid email or password" };
      }

      // Store current user session
      const { password: _, ...safeUser } = user;
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  },

  logout: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getCurrentUser: async (): Promise<UserData | null> => {
    try {
      const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  updateProfile: async (
    userId: string,
    updates: Partial<
      Pick<UserData, "name" | "surname" | "contactNumber" | "address">
    >,
  ): Promise<AuthResult> => {
    try {
      const users = await getStoredUsers();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return { success: false, error: "User not found" };
      }

      users[userIndex] = { ...users[userIndex], ...updates };
      await saveUsers(users);

      // Update current session
      const { password: _, ...safeUser } = users[userIndex];
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

      return { success: true, user: users[userIndex] };
    } catch (error: any) {
      return { success: false, error: error.message || "Update failed" };
    }
  },
};

export default authService;
