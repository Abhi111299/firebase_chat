import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging'; 
import { initializeFirestore, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkk3nCfTck9UiJhwLX2-zXDnxvzA_JigI",
  authDomain: "chat-website-be22c.firebaseapp.com",
  databaseURL: "https://chat-website-be22c-default-rtdb.firebaseio.com",
  projectId: "chat-website-be22c",
  storageBucket: "chat-website-be22c.appspot.com",
  messagingSenderId: "8296876788",
  appId: "1:8296876788:web:1544dabdafbfab19186ca1",
  measurementId: "G-YD8QNGGYQ5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore with ignoreUndefinedProperties enabled
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,  // This option will ignore undefined fields
});

// Firebase services
export const auth = getAuth(app); 
export const storage = getStorage(app);  // Firebase Storage
export const messaging = getMessaging(app); 

// Export functions from Firestore that you may use in your app
export { signInWithCustomToken, db, collection, addDoc, query, where, orderBy, onSnapshot };
