import supportChatService from '../services/supportChatService.js';

export const postSupportChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    const valid = messages.every(
      (msg) =>
        msg &&
        typeof msg.content === 'string' &&
        msg.content.trim().length > 0 &&
        (msg.role === 'user' || msg.role === 'assistant')
    );

    if (!valid) {
      return res.status(400).json({ message: 'Each message must have role (user|assistant) and non-empty content' });
    }

    const reply = await supportChatService.chat(messages);
    res.json({ reply });
  } catch (error) {
    console.error('Support chat error:', error);
    res.status(500).json({
      message: error.message || 'Failed to get support response',
    });
  }
};
