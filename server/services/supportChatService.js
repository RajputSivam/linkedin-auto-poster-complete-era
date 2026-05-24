import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT =
  'You are a helpful support assistant for LinkedIn Auto Poster app. Help users with login issues, posting problems, dashboard questions, and general app usage.';

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured on the server');
  }
  return new Anthropic({ apiKey });
};

const chat = async (messages) => {
  const client = getClient();

  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock?.text || 'Sorry, I could not generate a response.';
};

export default { chat, SYSTEM_PROMPT };
