import axios from 'axios';

export async function getEmbeddings(chunks) {
    // const model = 'sentence-transformers/all-MiniLM-L6-v2';
    const model='sentence-transformers/all-MiniLM-L6-v2';
    // const model = 'intfloat/multilingual-e5-large';

    // chunks="Today is a sunny day and I will get some ice cream.";
    
   try {
    const res = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${model}/pipeline/feature-extraction`,
      { inputs: chunks },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error('Embedding Error:', error.response?.data || error.message);
    throw error;
  }

  return res.data;
}
