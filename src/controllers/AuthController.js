import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";

export const AuthController = {
  async signIn() {
    await signInAnonymously(auth);
  },
};