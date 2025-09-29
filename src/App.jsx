import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import { UserModel } from "./models/UserModel";

const App = () => {
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await UserModel.getUserProfile(currentUser.uid);
        setHasProfile(!!profile.level && !!profile.dailyCommitment);
      } else {
        setHasProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              hasProfile ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Auth />
            )
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;