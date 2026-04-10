import { Request, Response } from 'express';

export const handleChat = (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Note: According to AI Studio guidelines, Gemini API calls MUST be made 
    // from the frontend. This backend endpoint can be used to store chat history
    // in a database, perform moderation, or handle business logic before/after
    // the frontend communicates with Gemini.
    
    res.json({
      success: true,
      receivedMessage: message,
      status: 'Ready for frontend Gemini integration'
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
};
