const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Set in Firebase environment variables
    pass: process.env.GMAIL_PASS  // Set in Firebase environment variables
  },
});

exports.sendDailyReminders = functions.pubsub.schedule("every day 08:00").timeZone("UTC").onRun(async (context) => {
  const db = admin.firestore();
  const usersSnapshot = await db.collection("users").get();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  for (const userDoc of usersSnapshot.docs) {
    const user = userDoc.data();
    const lastStudyTimestamp = user.lastStudyTimestamp;
    const email = user.email || `${userDoc.id}@example.com`; // Fallback email
    const dailyCommitment = user.dailyCommitment;

    if (!lastStudyTimestamp) continue;

    const lastStudyDate = new Date(lastStudyTimestamp);
    const isToday = lastStudyDate.toDateString() === today.toDateString();
    const isYesterday = lastStudyDate.toDateString() === yesterday.toDateString();

    if (!isToday && !isYesterday) {
      // Send reminder for missed goal
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "FrenchFiesta: We Missed You!",
        text: `You haven't studied your ${dailyCommitment} minutes today. Log in to FrenchFiesta to keep your streak alive!`,
      };

      await transporter.sendMail(mailOptions);
    } else {
      // Send upcoming lesson reminder
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "FrenchFiesta: Time to Study!",
        text: `Your ${dailyCommitment}-minute French lesson awaits! Log in to FrenchFiesta now.`,
      };

      await transporter.sendMail(mailOptions);
    }
  }

  return null;
});