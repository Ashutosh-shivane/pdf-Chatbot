import { getEmbeddings } from '../../utils/embed';
import { queryEmbeddings } from '../../utils/pinecone';
import { generateAnswer } from '../../utils/llm';

export default async function handler(req, res) {
  const { question } = req.body;

  const [embedding] = await getEmbeddings([question]);
  const contextChunks = await queryEmbeddings(embedding);
  const context = contextChunks.join(' ');
  const answer = await generateAnswer(context, question);
  res.status(200).json({ answer });
}
