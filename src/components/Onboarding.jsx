import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase";
import { UserModel } from "../models/UserModel";
import "./Onboarding.css";

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  const [dailyCommitment, setDailyCommitment] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (level && dailyCommitment && user) {
      await UserModel.updateUserProfile(user.uid, { level, dailyCommitment });
      navigate("/dashboard");
    } else {
      alert("Please select both proficiency level and daily commitment.");
    }
  };

  return (
    <div className="onboarding-container">
      <h2>Set Your Learning Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Proficiency Level:</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select Level</option>
            <option value="Débutant">Débutant (Beginner)</option>
            <option value="Intermédiaire">Intermédiaire (Middle)</option>
            <option value="Avancé">Avancé (Pro)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Daily Commitment:</label>
          <select value={dailyCommitment || ""} onChange={(e) => setDailyCommitment(Number(e.target.value))}>
            <option value="">Select Time</option>
            <option value="10">10 Minutes</option>
            <option value="30">30 Minutes</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Save Preferences</button>
      </form>
    </div>
  );
};

export default Onboarding;