import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT =
  'You are a helpful support assistant for LinkedIn Auto Poster app. Help users with login issues, posting problems, dashboard questions, and general app usage.';

const getApiUrl = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
};

const chat = async (messages) => {
  if (messages.length === 0) {
    throw new Error('At least one message is required');
  }

  const response = await fetch(getApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response text returned from Gemini API');
  }

  return text;
};

export default { chat, SYSTEM_PROMPT };
