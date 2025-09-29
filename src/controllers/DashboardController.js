import { UserModel } from "../models/UserModel";

export const DashboardController = {
  subscribeToProgress(userId, callback) {
    return UserModel.subscribeToProgress(userId, callback);
  },

  subscribeToStreak(userId, callback) {
    return UserModel.subscribeToStreak(userId, callback);
  },

  async markLessonComplete(userId) {
    try {
      const progress = await UserModel.getUserProgress(userId);
      const newCompletedLessons = progress.completedLessons + 1;
      await UserModel.updateProgress(userId, newCompletedLessons);
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  },
};