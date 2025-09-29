import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const LessonModel = {
  async getLessons(level) {
    // Placeholder: Fetch lessons based on proficiency level
    const lessonsRef = collection(db, "lessons");
    const lessonsSnap = await getDocs(lessonsRef);
    const lessons = lessonsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(lesson => lesson.level === level || lesson.level === undefined);
    // Mock data for now
    return lessons.length > 0 ? lessons : [
      { id: "1", title: "Lesson 1: Greetings", level, content: "Placeholder content" }
    ];
  },
};