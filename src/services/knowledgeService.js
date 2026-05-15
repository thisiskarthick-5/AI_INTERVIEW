import knowledgeBase from '../data/knowledge-base.json';

/**
 * Searches the knowledge base for chunks relevant to the current interview config.
 * For now, it uses a high-performance keyword match to avoid loading heavy 
 * embedding models in the browser.
 */
export const getRelevantContext = (config) => {
  const { targetRole, interviewType } = config;
  const keywords = [
    targetRole.toLowerCase(),
    interviewType.toLowerCase(),
    'grading',
    'communication',
    'star method',
    'pitfalls'
  ];

  // Filter chunks that match our keywords
  const relevantChunks = knowledgeBase.filter(chunk => {
    const text = chunk.text.toLowerCase();
    const source = chunk.source.toLowerCase();
    return keywords.some(key => text.includes(key) || source.includes(key));
  });

  // Return the top 5 most relevant chunks as a single string
  return relevantChunks
    .slice(0, 8)
    .map(chunk => `[Context from ${chunk.source}]: ${chunk.text}`)
    .join('\n\n');
};
