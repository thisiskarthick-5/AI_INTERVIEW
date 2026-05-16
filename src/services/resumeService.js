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
    Analyze the following text to determine if it is a professional resume. 
    
    IMPORTANT RULES:
    1. If the text is NOT a resume (e.g., it is study material, a book, notes, or unrelated content), return an "atsScore" of 0 and set the "summary" to "This document does not appear to be a professional resume."
    2. If it IS a resume, evaluate it for ATS compatibility and professional quality.
    
    RESUME TEXT:
    ${resumeText}

    Provide an evaluation in JSON format:
    {
      "isResume": (boolean),
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
    // Robust JSON extraction
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not find valid analysis data in AI response.");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error(error.message || "The AI could not analyze this resume. Please check your API key or file content.");
  }
};

