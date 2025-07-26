import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}