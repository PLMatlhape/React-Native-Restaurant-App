import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User as FirebaseUser, Auth } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/firebase/authService';
import { auth } from '../services/firebase/config';
import { User, UserProfile, AuthResult } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  isAdmin: boolean;
  loading: boolean;
  register: (email: string, password: string, userData: Partial<UserProfile>) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe = (): void => {};

    try {
      unsubscribe = onAuthStateChanged(
        auth as Auth,
        async (firebaseUser) => {
          try {
            if (firebaseUser) {
              setUser(firebaseUser);
              // Fetch user data from Firestore
              const result = await authService.getUserData(firebaseUser.uid);
              if (result.success && result.data) {
                setUserData(result.data as User);
                setIsAdmin((result.data as User)?.role === 'admin');
                // Cache user data
                await AsyncStorage.setItem('userData', JSON.stringify(result.data));
              }
            } else {
              setUser(null);
              setUserData(null);
              setIsAdmin(false);
              await AsyncStorage.removeItem('userData');
            }
          } catch (error) {
            console.error('Auth state change error:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Firebase auth error:', error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const register = async (
    email: string,
    password: string,
    userDataInput: Partial<UserProfile>
  ): Promise<AuthResult> => {
    try {
      const result = await authService.register(email, password, userDataInput);
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user as FirebaseUser);
        if (result.userData) {
          setUserData(result.userData as User);
          setIsAdmin((result.userData as User)?.role === 'admin');
        }
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async (): Promise<AuthResult> => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<AuthResult> => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }
      const result = await authService.updateUserProfile(user.uid, updates);
      if (result.success) {
        // Refresh user data
        const userDataResult = await authService.getUserData(user.uid);
        if (userDataResult.success && userDataResult.data) {
          setUserData(userDataResult.data as User);
          await AsyncStorage.setItem('userData', JSON.stringify(userDataResult.data));
        }
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    isAdmin,
    loading,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
