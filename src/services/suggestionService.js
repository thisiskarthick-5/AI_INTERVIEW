import { getGroqChatCompletion } from './groqService';

/**
 * Generates a real-time suggestion/tip for the candidate based on the current interview state.
 * @param {Array} apiMessages - The full history of the conversation (system, assistant, user)
 * @param {Object} config - The interview configuration
 * @returns {Promise<string>} A brief suggestion (max 2 sentences)
 */
export const getRealtimeSuggestion = async (apiMessages, config) => {
  const lastMessage = apiMessages[apiMessages.length - 1];

  // If the last message was from the user, we suggest how to handle the expected follow-up.
  // If the last message was from Max, we suggest how to answer the current question.
  const prompt = `You are an expert Interview Coach. 
Analyze the candidate's last response in this ${config.targetRole} interview.

DECISION RULE:
- If the candidate's last response is "CORRECT ENOUGH" (meaning they showed basic competency and wouldn't be rejected for that specific answer), return an empty JSON object: {"feedback": "", "suggestion": ""}.
- ONLY trigger if the response is fundamentally incorrect, extremely vague, or contains a major red flag that would lead to rejection.

FORMAT:
Return ONLY a raw JSON object. No other text.
Example for acceptable response: {"feedback": "", "suggestion": ""}
Example for failing response: {"feedback": "...", "suggestion": "..."}

CRITICAL: Be a supportive coach. Your goal is to ensure the user is "good enough" to pass. Only intervene if they are genuinely struggling.`;

  const suggestionMessages = [
    { role: 'system', content: 'You are a concise Interview Copilot. Give 1-2 sentence tips.' },
    ...apiMessages.slice(-5), // Only send last 5 messages for speed/context
    { role: 'user', content: prompt }
  ];

  try {
    const rawResult = await getGroqChatCompletion(suggestionMessages);
    // Attempt to parse JSON, if it fails, try to extract JSON from the string or return a fallback object
    try {
      const cleaned = rawResult.substring(rawResult.indexOf('{'), rawResult.lastIndexOf('}') + 1);
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('JSON Parse Error, using raw:', rawResult);
      return { feedback: rawResult, suggestion: "Focus on providing a structured, technical response." };
    }
  } catch (error) {
    console.error('Suggestion Error:', error);
    return { feedback: "Be more specific.", suggestion: "Stay calm and focus." };
  }
};
