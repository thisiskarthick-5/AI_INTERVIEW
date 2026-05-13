import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmLAI5hm9KVvSACIHGhtoyjQFcl0UJeIw",
  authDomain: "vantage-ai-interview.firebaseapp.com",
  projectId: "vantage-ai-interview",
  storageBucket: "vantage-ai-interview.firebasestorage.app",
  messagingSenderId: "579056202773",
  appId: "1:579056202773:web:41e4e64f0f809c6ac54a1c",
  measurementId: "G-EVCCK6QZLZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();