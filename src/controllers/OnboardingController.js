import { UserModel } from "../models/UserModel";

export const OnboardingController = {
  async savePreferences(userId, level, dailyCommitment) {
    try {
      await UserModel.updateUserProfile(userId, { level, dailyCommitment });
      return true;
    } catch (error) {
      console.error("Error saving preferences:", error);
      return false;
    }
  },
};