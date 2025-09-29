import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBr9gz0Qa5__vdrJxA8wEfT4Wt2HigBWnI",
  authDomain: "frenchfiesta-10cf5.firebaseapp.com",
  projectId: "frenchfiesta-10cf5",
  storageBucket: "frenchfiesta-10cf5.firebasestorage.app",
  messagingSenderId: "337411804388",
  appId: "1:337411804388:web:39795afe5504ca6bdff0f1",
  measurementId: "G-BB84K3G31X",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return { user };
};

export { app, analytics, auth, db, signInAnonymously };