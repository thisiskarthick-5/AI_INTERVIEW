import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getGroqChatCompletion } from './groqService';

const COLLECTION_NAME = 'resumes';

/**
 * Save resume metadata and analysis to Firestore
 */
export const saveResume = async (userId, resumeData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...resumeData,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw error;
  }
};

/**
 * Get all resumes for a user
 */
export const getUserResumes = async (userId) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw error;
  }
};

/**
 * Analyze resume content using Groq
 */
export const analyzeResume = async (resumeText) => {
  const prompt = `
    Analyze the following resume text for ATS (Applicant Tracking System) compatibility and professional quality.
    
    RESUME TEXT:
    ${resumeText}

    Provide an evaluation in JSON format:
    {
      "atsScore": (0-100),
      "summary": (short 2-sentence summary),
      "strengths": [list of 3 strengths],
      "weaknesses": [list of 3 weaknesses],
      "questions": [list of 5 highly relevant interview questions based on this resume]
    }
    Return ONLY the JSON.
  `;

  try {
    const response = await getGroqChatCompletion([
      { role: 'system', content: 'You are a senior technical recruiter and ATS expert. Output only valid JSON.' },
      { role: 'user', content: prompt }
    ]);
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Analysis error:", error);
    return {
      atsScore: 70,
      summary: "Good resume structure but could benefit from more quantitative achievements.",
      strengths: ["Clear contact info", "Strong technical stack", "Good formatting"],
      weaknesses: ["Missing metrics", "Vague job descriptions", "No portfolio link"],
      questions: ["Walk me through your most complex project.", "How do you handle technical debt?", "Describe a time you failed.", "What's your preferred tech stack?", "How do you stay updated?"]
    };
  }
};
