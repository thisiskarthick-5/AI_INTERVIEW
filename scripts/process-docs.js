import fs from 'fs';
import path from 'path';
import { pipeline } from '@xenova/transformers';

const KNOWLEDGE_DIR = './knowledge';
const OUTPUT_FILE = './src/data/knowledge-base.json';

async function processDocs() {
  console.log('🚀 Initializing BGE-en embedding model...');
  
  // Initialize the pipeline
  const extractor = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.txt'));
  const knowledgeBase = [];

  if (files.length === 0) {
    console.log('⚠️ No .txt files found in /knowledge folder.');
    return;
  }

  for (const file of files) {
    console.log(`📄 Processing ${file}...`);
    const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf-8');
    
    // Simple chunking (by paragraph or 500 characters)
    const chunks = content.split('\n\n').filter(c => c.trim().length > 0);

    for (const chunk of chunks) {
      const output = await extractor(chunk, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);

      knowledgeBase.push({
        id: crypto.randomUUID(),
        source: file,
        text: chunk.trim(),
        embedding: embedding
      });
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase, null, 2));
  console.log(`✅ Success! Knowledge base saved to ${OUTPUT_FILE}`);
  console.log(`📊 Total chunks vectorized: ${knowledgeBase.length}`);
}

processDocs().catch(console.error);
