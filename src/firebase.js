import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbiHiwceuMS6x0zybmYMVL_Do7h4IYTuE",
  authDomain: "gameslint.firebaseapp.com",
  projectId: "gameslint",
  storageBucket: "gameslint.firebasestorage.app",
  messagingSenderId: "103155088844",
  appId: "1:103155088844:web:d9d31d4eefacbdfe5e7169",
  measurementId: "G-Q2LVWV74BR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
