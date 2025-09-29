import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase";
import { DashboardController } from "../controllers/DashboardController";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({ percentage: 0, completedLessons: 0, totalLessons: 20 });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let unsubscribeProgress, unsubscribeStreak;
    if (user) {
      unsubscribeProgress = DashboardController.subscribeToProgress(user.uid, setProgress);
      unsubscribeStreak = DashboardController.subscribeToStreak(user.uid, setStreak);
    }
    return () => {
      unsubscribeProgress && unsubscribeProgress();
      unsubscribeStreak && unsubscribeStreak();
    };
  }, [user]);

  const handleMarkComplete = async () => {
    if (user) {
      await DashboardController.markLessonComplete(user.uid);
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome to FrenchFiesta, {user?.uid}</h2>
      <div className="progress-section">
        <h3>Progress Toward A1 Certification</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress.percentage}%` }}></div>
        </div>
        <p>{progress.percentage.toFixed(1)}% Complete ({progress.completedLessons}/{progress.totalLessons} Lessons)</p>
        <button onClick={handleMarkComplete} className="complete-button">
          Mark Lesson Complete
        </button>
      </div>
      <div className="streak-section">
        <h3>Daily Streak</h3>
        <p>{streak} Day{streak !== 1 ? "s" : ""}</p>
      </div>
      <div className="progress-chart">
        <h3>Progress Visualization</h3>
        ```chartjs
        {
          "type": "bar",
          "data": {
            "labels": ["Completed", "Remaining"],
            "datasets": [{
              "label": "Lessons",
              "data": [${progress.completedLessons}, ${progress.totalLessons - progress.completedLessons}],
              "backgroundColor": ["#4CAF50", "#E0E0E0"],
              "borderColor": ["#388E3C", "#B0B0B0"],
              "borderWidth": 1
            }]
          },
          "options": {
            "scales": {
              "y": {
                "beginAtZero": true,
                "title": { "display": true, "text": "Lessons" }
              },
              "x": {
                "title": { "display": true, "text": "Progress" }
              }
            },
            "plugins": {
              "legend": { "display": false }
            }
          }
        }
        ```
      </div>
      <div className="lesson-section">
        <h3>Current Lesson</h3>
        <p>Lesson Placeholder (Video/Quiz content to be added)</p>
      </div>
    </div>
  );
};

export default Dashboard;