// Auth context - local AsyncStorage-based authentication
// No Firebase dependency

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { authService, UserData } from "../services/local/authService";

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    userData: {
      name: string;
      surname: string;
      contactNumber: string;
      address: string;
    },
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<
      Pick<UserData, "name" | "surname" | "contactNumber" | "address">
    >,
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await authService.seedAdmin(); // Ensure admin account exists
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("App initialization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (
    email: string,
    password: string,
    userData: {
      name: string;
      surname: string;
      contactNumber: string;
      address: string;
    },
  ) => {
    try {
      const result = await authService.register(email, password, userData);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Registration failed" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (
    updates: Partial<
      Pick<UserData, "name" | "surname" | "contactNumber" | "address">
    >,
  ) => {
    if (!user) return { success: false, error: "Not logged in" };
    try {
      const result = await authService.updateProfile(user.id, updates);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Update failed" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
