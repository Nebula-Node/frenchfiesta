import React from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";
import { AuthController } from "../controllers/AuthController";
import "./Auth.css";

const Auth = () => {
  const handleSignIn = async () => {
    try {
      await AuthController.signIn();
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome to FrenchFiesta</h2>
      <button onClick={handleSignIn} className="auth-button">
        Sign In Anonymously
      </button>
    </div>
  );
};

export default Auth;