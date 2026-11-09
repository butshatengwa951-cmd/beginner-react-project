import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../services/firebase.js";

// Context makes the authenticated user available to many components without
// passing it through every intermediate component as a prop.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    // Observe Firebase's session state, including after a browser refresh.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register(email, password) {
    if (!isFirebaseConfigured) {
      throw new Error("Add your Firebase web-app settings to client/.env first.");
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    return result.user;
  }

  async function login(email, password) {
    if (!isFirebaseConfigured) {
      throw new Error("Add your Firebase web-app settings to client/.env first.");
    }

    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    return result.user;
  }

  async function logout() {
    if (auth) {
      await signOut(auth);
      setUser(null);
    }
  }

  const value = { user, loading, register, login, logout, isFirebaseConfigured };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A custom hook keeps context access consistent in pages and components.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }
  return context;
}
