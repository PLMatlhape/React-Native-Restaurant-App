import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase configuration type
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase configuration using environment variables (Expo public env vars)
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Validate Firebase config
const isConfigured: boolean = !firebaseConfig.apiKey.includes('demo-');

if (!isConfigured) {
  console.warn('⚠️ Firebase is not configured. Running in demo mode.');
}

// Initialize Firebase - check if already initialized
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Auth type import
import type { Auth } from 'firebase/auth';

// Auth singleton - initialized lazily
let _auth: Auth | null = null;
let _authInitPromise: Promise<Auth> | null = null;

// Initialize auth asynchronously to avoid "Component auth has not been registered yet" error
const initializeAuthAsync = async (): Promise<Auth> => {
  if (_auth) return _auth;
  
  // Small delay to ensure React Native environment is ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Dynamic import
  const firebaseAuth = await import('firebase/auth');
  
  if (Platform.OS === 'web') {
    _auth = firebaseAuth.getAuth(app);
  } else {
    try {
      // Try to initialize with persistence
      // @ts-ignore - getReactNativePersistence exists at runtime
      const persistence = firebaseAuth.getReactNativePersistence(AsyncStorage);
      _auth = firebaseAuth.initializeAuth(app, {
        persistence: persistence,
      });
    } catch (error: any) {
      // Already initialized or other error - fallback to getAuth
      if (error.code === 'auth/already-initialized') {
        _auth = firebaseAuth.getAuth(app);
      } else {
        console.warn('Auth initialization warning:', error.message);
        _auth = firebaseAuth.getAuth(app);
      }
    }
  }
  
  return _auth;
};

// Get auth instance - returns promise
export const getAuthAsync = (): Promise<Auth> => {
  if (_auth) return Promise.resolve(_auth);
  if (!_authInitPromise) {
    _authInitPromise = initializeAuthAsync();
  }
  return _authInitPromise;
};

// Synchronous getter - may return null if not initialized
export const getAuthSync = (): Auth | null => _auth;

// Initialize other services
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const isFirebaseConfigured: boolean = isConfigured;

export default app;
