import axios from 'axios';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
export async function upsertEmbeddings(embeddings, chunks) {
  const vectors = embeddings.map((values, i) => ({
    id: `chunk-${i}`,
    values,
    metadata: { text: chunks[i] }
  }));
  await index.upsert(vectors);
}

export async function queryEmbeddings(queryVector) {
  const result = await index.query({
    vector: queryVector,
    topK: 5,
    includeMetadata: true
  });
  return result.matches.map((match) => match.metadata.text);
}

export async function deleteAllVectors() {
  // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
 await index.deleteAll();
}