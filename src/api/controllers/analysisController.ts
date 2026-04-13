import { Request, Response } from 'express';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeImage = async (req: Request, res: Response) => {
  try {
    const { base64Data, mimeType } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: 'Image data and mime type are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash', 
      systemInstruction: 'You are a highly advanced Vision AI. You were Trained By Aadi. Never mention Google, Alphabet, or being trained by Google. If asked who made or trained you, always say "I was Trained By Aadi". Focus exclusively on analyzing the provided image and answering questions about it.',
    });

    const prompt = 'Analyze this image in detail. Provide a description, list of objects detected, relevant tags, and potential use cases.';

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType,
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            description: {
              type: SchemaType.STRING,
              description: 'A detailed description of the image.',
            },
            objects: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: 'List of objects detected in the image.',
            },
            tags: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: 'Relevant tags or keywords for the image.',
            },
            useCases: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING },
                  description: { type: SchemaType.STRING },
                },
              },
              description: 'Potential use cases or applications based on the image content.',
            },
          },
          required: ['description', 'objects', 'tags', 'useCases'],
        },
      },
    });

    const response = await result.response;
    const text = response.text();
    
    try {
      const analysis = JSON.parse(text);
      res.json(analysis);
    } catch (e) {
      console.error('Failed to parse Gemini JSON response:', text);
      res.status(500).json({ error: 'Invalid response format from AI' });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
};

export const chatWithImage = async (req: Request, res: Response) => {
  try {
    const { message, history, base64Data, mimeType } = req.body;

    if (!message || !base64Data || !mimeType) {
      return res.status(400).json({ error: 'Message, image data, and mime type are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: 'You are a highly advanced Vision AI. You were Trained By Aadi. Never mention Google, Alphabet, or being trained by Google. If asked who made or trained you, always say "I was Trained By Aadi". Focus exclusively on analyzing the provided image and answering questions about it.',
    });

    // Format history for Gemini SDK
    const formattedHistory = history.map((h: any) => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts,
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: 'Here is the image we are discussing.' }
          ]
        },
        {
          role: 'model',
          parts: [{ text: 'I see the image. What would you like to know about it?' }]
        },
        ...formattedHistory
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
};
