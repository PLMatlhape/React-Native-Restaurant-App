import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    updateEmail,
    sendPasswordResetEmail
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from './config';
  
  export const authService = {
    // Register new user
    register: async (email, password, userData) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
            cardNumber: userData.cardNumber,
            cardHolder: userData.cardHolder,
            expiryDate: userData.expiryDate,
            cvv: userData.cvv
          },
          role: 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
  
        return { success: true, user };
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Login user
    login: async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
  
        return { success: true, user, userData };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Logout user
    logout: async () => {
      try {
        await signOut(auth);
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Update user profile
    updateUserProfile: async (userId, updates) => {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
  
        // Update auth profile if name changed
        if (updates.name || updates.surname) {
          await updateProfile(auth.currentUser, {
            displayName: `${updates.name || ''} ${updates.surname || ''}`.trim()
          });
        }
  
        // Update email if changed
        if (updates.email && updates.email !== auth.currentUser.email) {
          await updateEmail(auth.currentUser, updates.email);
        }
  
        return { success: true };
      } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Get user data
    getUserData: async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          return { success: true, data: userDoc.data() };
        }
        return { success: false, error: 'User not found' };
      } catch (error) {
        console.error('Get user data error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Reset password
    resetPassword: async (email) => {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
      } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Get current user
    getCurrentUser: () => {
      return auth.currentUser;
    }
  };