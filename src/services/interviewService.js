import { collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'interviews';

/**
 * Save a new interview session to Firestore
 * @param {string} userId - The ID of the authenticated user
 * @param {Object} sessionData - Details of the session (role, type, difficulty, duration)
 * @returns {Promise<string>} The document ID of the new session
 */
export const saveInterviewSession = async (userId, sessionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...sessionData,
      userId,
      status: 'in-progress',
      createdAt: serverTimestamp(),
      messages: []
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

/**
 * Get all interviews for a specific user
 * @param {string} userId - The ID of the authenticated user
 * @returns {Promise<Array>} Array of interview objects
 */
export const getUserInterviews = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort on client side to avoid requiring a composite index during development
    return docs.sort((a, b) => {
       const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
       const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
       return timeB - timeA;
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

/**
 * Update an existing interview session
 * @param {string} sessionId - The ID of the session document
 * @param {Object} updateData - Data to update (e.g. messages, status, score)
 */
export const updateInterviewSession = async (sessionId, updateData) => {
  try {
    const sessionRef = doc(db, COLLECTION_NAME, sessionId);
    await updateDoc(sessionRef, updateData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};
