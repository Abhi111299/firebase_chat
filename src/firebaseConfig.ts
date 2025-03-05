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

// Initialize Firebase Messaging
export const messaging = getMessaging(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

export { signInWithCustomToken, collection, addDoc, query, where, orderBy, onSnapshot };
