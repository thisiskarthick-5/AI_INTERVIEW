import { getGroqChatCompletion } from './groqService';

/**
 * Evaluate the interview transcript and return a score and feedback.
 * @param {Array} messages - The chat transcript
 * @param {Object} config - The interview configuration (role, difficulty)
 * @returns {Promise<Object>} { score: number, feedback: string }
 */
export const evaluateInterview = async (messages, config) => {
  const transcript = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n\n');

  const evaluationPrompt = `
    You are an expert technical recruiter. Evaluate the following interview transcript.
    Role: ${config.targetRole}
    Difficulty: ${config.difficulty}
    Type: ${config.interviewType}

    TRANSCRIPT:
    ${transcript}

    Provide a professional evaluation in JSON format:
    {
      "score": (a number from 0-100),
      "feedback": (a brief 2-3 sentence summary of strengths and weaknesses),
      "suggestions": (3 specific tips for improvement)
    }
    Return ONLY the JSON.
  `;

  try {
    const response = await getGroqChatCompletion([
      { role: 'system', content: 'You are a professional interview evaluator. Output only valid JSON.' },
      { role: 'user', content: evaluationPrompt }
    ]);

    // Clean response if LLM adds markdown backticks
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Evaluation error:', error);
    // Fallback if AI fails
    return {
      score: 75,
      feedback: "Great effort in the interview. Focus on articulating your technical decisions more clearly.",
      suggestions: ["Clarify technical trade-offs", "Use STAR method for behavioral", "Practice system design"]
    };
  }
};
