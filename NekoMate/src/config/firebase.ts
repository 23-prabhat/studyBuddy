import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAP82TYM7Rhs7mBuAAsNj5YBdDOMlZf3wI",
  authDomain: "studybuddy-9af22.firebaseapp.com",
  projectId: "studybuddy-9af22",
  storageBucket: "studybuddy-9af22.firebasestorage.app",
  messagingSenderId: "1041516127488",
  appId: "1:1041516127488:web:4c69c863be8123ab647fe5",
  measurementId: "G-6GGHH2TXPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
