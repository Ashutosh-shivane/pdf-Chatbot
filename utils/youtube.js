import axios from 'axios';

export async function extractTranscript(url) {
  try {
    const videoId = new URL(url).searchParams.get('v'); 
    console.log(videoId);// Extract video ID from full URL
    const options = {
      method: 'GET',
      url: 'https://youtube-transcriptor.p.rapidapi.com/transcript',
      params: {
        video_id: videoId,
        lang: 'en'
      },
      headers: {
        'x-rapidapi-host': 'youtube-transcriptor.p.rapidapi.com',
        'x-rapidapi-key': '2891c9555cmsh8094082fa4dccdep13aac0jsn0f878742984c' // Replace this with your actual API key
      }
    };

    const response = await axios.request(options);

    // console.log(response);
    const transcript = response.data[0].transcriptionAsText;

    // console.log(response.data[0].transcription);

    // console.log(transcript);

    // Join transcript text
    // const fullText = transcript.map((t) => t.text).join(' ');
    // console.log(fullText);
    return transcript;

  } catch (error) {
    console.error('Transcript fetch error:', error);
    throw error;
  }
}
