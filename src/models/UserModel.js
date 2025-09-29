import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const UserModel = {
  async getUserProfile(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : {};
  },

  async updateUserProfile(userId, data) {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...data,
      progress: { a1: { completedLessons: 0, totalLessons: 20 } },
      lastStudyTimestamp: new Date().toISOString(),
    }, { merge: true });
  },

  async getUserProgress(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const completedLessons = data.progress?.a1?.completedLessons || 0;
      const totalLessons = data.progress?.a1?.totalLessons || 20;
      return {
        completedLessons,
        totalLessons,
        percentage: (completedLessons / totalLessons) * 100,
      };
    }
    return { completedLessons: 0, totalLessons: 20, percentage: 0 };
  },

  async updateProgress(userId, completedLessons) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      "progress.a1.completedLessons": completedLessons,
      lastStudyTimestamp: new Date().toISOString(),
    });
  },

  subscribeToProgress(userId, callback) {
    const userRef = doc(db, "users", userId);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const completedLessons = data.progress?.a1?.completedLessons || 0;
        const totalLessons = data.progress?.a1?.totalLessons || 20;
        callback({
          completedLessons,
          totalLessons,
          percentage: (completedLessons / totalLessons) * 100,
        });
      } else {
        callback({ completedLessons: 0, totalLessons: 20, percentage: 0 });
      }
    });
  },

  subscribeToStreak(userId, callback) {
    const userRef = doc(db, "users", userId);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const lastStudyTimestamp = data.lastStudyTimestamp;
        const streak = UserModel.calculateStreak(lastStudyTimestamp);
        callback(streak);
      } else {
        callback(0);
      }
    });
  },

  calculateStreak(lastStudyTimestamp) {
    if (!lastStudyTimestamp) return 0;
    const lastStudyDate = new Date(lastStudyTimestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = lastStudyDate.toDateString() === today.toDateString();
    const isYesterday = lastStudyDate.toDateString() === yesterday.toDateString();

    // For simplicity, assume streak increments if studied today or yesterday
    // In a full implementation, track streak history in Firestore
    return isToday || isYesterday ? 1 : 0;
  },
};