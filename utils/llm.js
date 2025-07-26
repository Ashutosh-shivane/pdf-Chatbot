import axios from 'axios';

export async function generateAnswer(context, question) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: `Context: ${context}\n\nQuestion: ${question}` }
          ]
        }
      ]
    }
  );
  return res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}