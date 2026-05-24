import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT =
  'You are a helpful support assistant for LinkedIn Auto Poster app. Help users with login issues, posting problems, dashboard questions, and general app usage.';

const MODEL_NAME = 'gemini-1.5-flash-latest';

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
  });
};

const chat = async (messages) => {
  const model = getModel();

  if (messages.length === 0) {
    throw new Error('At least one message is required');
  }

  if (messages.length === 1) {
    const result = await model.generateContent(messages[0].content);
    return result.response.text();
  }

  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessage(lastMessage.content);
  return result.response.text();
};

export default { chat, SYSTEM_PROMPT };
