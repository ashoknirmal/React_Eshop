// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import API from "../api/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Initialize from localStorage so manual admin login works immediately
  const [user, setUserState] = useState(() => {
    try {
      const raw = localStorage.getItem("eshop_user");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Failed to parse eshop_user from localStorage:", err);
      return null;
    }
  });

  // exposed setter that also syncs to localStorage
  function setUser(u) {
    try {
      if (u) localStorage.setItem("eshop_user", JSON.stringify(u));
      else localStorage.removeItem("eshop_user");
    } catch (err) {
      console.warn("Failed to write user to localStorage:", err);
    }
    setUserState(u);
  }

  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com").trim();

  useEffect(() => {
    // If Firebase auth is not initialized, skip attaching listener but keep saved local user.
    if (!auth || typeof onAuthStateChanged !== "function") {
      console.warn("Firebase auth is not initialized. Auth state listener not attached.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Build a normalized user object from firebase
          const userPayload = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || null,
            isAdmin: (firebaseUser.email || "").trim() === adminEmail,
          };

          // Upsert user in json-server (by uid) - keep non-blocking on failure
          try {
            const res = await API.get(`/users?uid=${firebaseUser.uid}`);
            if (!res?.data || res.data.length === 0) {
              await API.post("/users", {
                id: `user_${firebaseUser.uid}`,
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || "",
                isAdmin: userPayload.isAdmin,
              });
            } else {
              const existing = res.data[0];
              await API.patch(`/users/${existing.id}`, {
                email: firebaseUser.email,
                name: firebaseUser.displayName || "",
                isAdmin: userPayload.isAdmin,
              });
            }
          } catch (err) {
            console.error("user upsert error", err);
          }

          // Persist and set context
          setUser(userPayload);
        } else {
          // firebaseUser is null (signed out)
          // Do not blindly clear localStorage if a manual login stored an admin user.
          // Prefer a locally-persisted user if it exists, otherwise clear.
          try {
            const raw = localStorage.getItem("eshop_user");
            if (raw) {
              const persisted = JSON.parse(raw);
              // keep the persisted value (useful for manual admin login using env credentials)
              setUserState(persisted);
            } else {
              setUserState(null);
            }
          } catch (err) {
            console.warn("Error reading eshop_user during onAuthStateChanged:", err);
            setUserState(null);
          }
        }
      } catch (innerErr) {
        console.error("Error in onAuthStateChanged callback:", innerErr);
      }
    });

    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
      } catch (cleanupErr) {
        console.warn("Failed to cleanup auth listener:", cleanupErr);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminEmail]); // adminEmail is stable, but included for clarity

  async function loginWithGoogle() {
    try {
      if (!auth) {
        const message = "Firebase auth is not initialized. Check your .env and firebaseConfig.js";
        console.error(message);
        throw new Error(message);
      }

      const result = await signInWithPopup(auth, googleProvider);
      console.info("Google sign-in success:", result?.user?.email);
      // onAuthStateChanged will pick up and upsert user
      return result;
    } catch (err) {
      console.error("Google login failed (full error):", err);
      const code = err?.code || "no_code";
      const message = err?.message || String(err);
      // Friendly alert while testing
      alert(`Login failed — ${code}: ${message}`);
      throw err;
    }
  }

  async function logout() {
    try {
      if (!auth) {
        console.warn("Firebase auth is not initialized. Skipping signOut.");
        // still clear local manual login
        setUser(null);
        return;
      }
      await signOut(auth);
      // onAuthStateChanged will run and preserve local persisted user if present,
      // but we explicitly clear here (expected for real sign out)
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed — check console for details.");
    }
  }

  const value = { user, setUser, loginWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
