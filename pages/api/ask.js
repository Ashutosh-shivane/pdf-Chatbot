import { extractTextFromPdf } from '../../utils/pdf';
import { getEmbeddings } from '../../utils/embed';
import { upsertEmbeddings, queryEmbeddings,deleteAllVectors } from '../../utils/pinecone';
import { generateAnswer } from '../../utils/llm';
import { IncomingForm } from 'formidable';
import fs from 'fs';


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    const file = files.file[0];
    const pdfBuffer = fs.readFileSync(file.filepath);
    const text = await extractTextFromPdf(pdfBuffer);
    const chunks = text.match(/(.|\s){1,500}/g);
    const embeddings = await getEmbeddings(chunks);
    // await deleteAllVectors();
    await upsertEmbeddings(embeddings, chunks);
    const contextChunks = await queryEmbeddings(embeddings[0]);
    const answer = await generateAnswer(contextChunks.join(' '), 'Give insights from this PDF');
    res.status(200).json({ answer });
  });
}