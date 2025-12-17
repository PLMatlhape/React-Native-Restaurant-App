import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/firebase/authService';
import { auth } from '../services/firebase/config';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            setUser(user);
            // Fetch user data from Firestore
            const result = await authService.getUserData(user.uid);
            if (result.success) {
              setUserData(result.data);
              setIsAdmin(result.data?.role === 'admin');
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
      }, (error) => {
        console.error('Firebase auth error:', error);
        setLoading(false);
      });
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const register = async (email, password, userData) => {
    try {
      const result = await authService.register(email, password, userData);
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        setUserData(result.userData);
        setIsAdmin(result.userData.role === 'admin');
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const result = await authService.updateUserProfile(user.uid, updates);
      if (result.success) {
        // Refresh user data
        const userDataResult = await authService.getUserData(user.uid);
        if (userDataResult.success) {
          setUserData(userDataResult.data);
          await AsyncStorage.setItem('userData', JSON.stringify(userDataResult.data));
        }
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userData,
    isAdmin,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};