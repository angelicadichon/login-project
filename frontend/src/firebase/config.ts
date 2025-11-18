import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use the exact config from your Firebase console (no process.env)
const firebaseConfig = {
  apiKey: "AIzaSyCcbPOWPAkt_aMVkTEv4gKWi5T1-jDev2o",
  authDomain: "login-project-1dc51.firebaseapp.com",
  projectId: "login-project-1dc51",
  storageBucket: "login-project-1dc51.firebasestorage.app",
  messagingSenderId: "33485598310",
  appId: "1:33485598310:web:33230716db93dfbfc947a7",
  measurementId: "G-5829YCZSL4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);