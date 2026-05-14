const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const getApiKey = () => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error("VITE_GROQ_API_KEY is not set in .env.local");
  return key;
};

/**
 * Send a chat request to Groq and return the full response text.
 * @param {Array} messages - Array of { role, content } objects
 * @returns {Promise<string>} The assistant's response text
 */
export const getGroqChatCompletion = async (messages) => {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 1024 }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content ?? "";
};

/**
 * Send a streaming chat request to Groq.
 * Calls onChunk(text) for each streamed chunk, returns full response string.
 * @param {Array} messages
 * @param {Function} onChunk - called with each new text chunk
 * @returns {Promise<string>} The full assembled response
 */
export const getGroqChatStream = async (messages, onChunk) => {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      const json = line.replace("data: ", "").trim();
      if (json === "[DONE]") break;
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content ?? "";
        if (content) {
          fullText += content;
          onChunk(fullText);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return fullText;
};
