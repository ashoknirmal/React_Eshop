// frontend/src/firebase/firebaseConfig.js (debug)
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app = null;
try {
  if (firebaseConfig.apiKey) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.info("Firebase initialized.");
    } else {
      app = getApps()[0];
      console.info("Firebase already initialized.");
    }
  } else {
    console.warn("Firebase config missing or empty. Check your .env file.");
  }
} catch (err) {
  console.error("Firebase initialization error:", err);
}

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
