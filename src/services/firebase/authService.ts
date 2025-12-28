import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updateProfile,
    User,
    UserCredential
} from 'firebase/auth';
import { doc, DocumentData, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, getAuthAsync } from './config';

// Types
interface UserData {
  name: string;
  surname: string;
  contactNumber: string;
  address: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface UserDocument extends DocumentData {
  uid: string;
  name: string;
  surname: string;
  email: string;
  contactNumber: string;
  address: string;
  cardDetails: CardDetails;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  userData?: UserDocument;
  error?: string;
}

interface ProfileUpdateData {
  name?: string;
  surname?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  cardDetails?: CardDetails;
}

export const authService = {
  // Register new user
  register: async (email: string, password: string, userData: UserData): Promise<AuthResult> => {
    try {
      const auth = await getAuthAsync();
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, {
        displayName: `${userData.name} ${userData.surname}`
      });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: userData.name,
        surname: userData.surname,
        email: email,
        contactNumber: userData.contactNumber,
        address: userData.address,
        cardDetails: {
          cardNumber: userData.cardNumber || '',
          cardHolder: userData.cardHolder || '',
          expiryDate: userData.expiryDate || '',
          cvv: userData.cvv || ''
        },
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return { success: true, user };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const auth = await getAuthAsync();
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() as UserDocument | undefined;

      return { success: true, user, userData };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const auth = await getAuthAsync();
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: ProfileUpdateData): Promise<{ success: boolean; error?: string }> => {
    try {
      const auth = await getAuthAsync();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // Update auth profile if name changed
      if ((updates.name || updates.surname) && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: `${updates.name || ''} ${updates.surname || ''}`.trim()
        });
      }

      // Update email if changed
      if (updates.email && auth.currentUser && updates.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, updates.email);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user data
  getUserData: async (userId: string): Promise<{ success: boolean; data?: UserDocument; error?: string }> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() as UserDocument };
      }
      return { success: false, error: 'User not found' };
    } catch (error: any) {
      console.error('Get user data error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  sendPasswordReset: async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const auth = await getAuthAsync();
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default authService;
