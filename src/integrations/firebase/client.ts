import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD17PurFS90_08PFTRscCfGM1uH7Y8bpOE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agrifarm-website.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agrifarm-website",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agrifarm-website.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "159145325875",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:159145325875:web:6ba8b4a98e0dfee5097a46",
};

// Initialize Firebase app singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth instance
export const auth = getAuth(app);

// Firestore instance
export const db = getFirestore(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

// Analytics (browser safe)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

