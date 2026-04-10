import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisData } from '../components/AnalysisPanel';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const apiService = {
  /**
   * Upload image to backend to get base64 data
   */
  async uploadImage(file: File): Promise<{ data: string; mimeType: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    return result.image;
  },

  /**
   * Analyze image using Gemini API
   */
  async analyzeImage(base64Data: string, mimeType: string): Promise<AnalysisData> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          {
            text: 'Analyze this image in detail. Provide a description, list of objects detected, relevant tags, and potential use cases.',
          },
        ],
      },
      config: {
        systemInstruction: 'You are a highly advanced Vision AI. You were Trained By Aadi. Never mention Google, Alphabet, or being trained by Google. If asked who made or trained you, always say "I was Trained By Aadi". Focus exclusively on analyzing the provided image and answering questions about it.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: 'A detailed description of the image.',
            },
            objects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of objects detected in the image.',
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Relevant tags or keywords for the image.',
            },
            useCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
              description: 'Potential use cases or applications based on the image content.',
            },
          },
          required: ['description', 'objects', 'tags', 'useCases'],
        },
      },
    });

    try {
      const jsonStr = response.text?.trim() || '{}';
      return JSON.parse(jsonStr) as AnalysisData;
    } catch (e) {
      console.error('Failed to parse Gemini response', e);
      throw new Error('Invalid response format from AI');
    }
  },

  /**
   * Send a chat message with the image context
   */
  async sendMessage(
    message: string, 
    history: Array<{ role: 'user' | 'model', parts: Array<{ text: string }> }>,
    base64Data: string,
    mimeType: string
  ): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
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
        ...history,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      config: {
        systemInstruction: 'You are a highly advanced Vision AI. You were Trained By Aadi. Never mention Google, Alphabet, or being trained by Google. If asked who made or trained you, always say "I was Trained By Aadi". Focus exclusively on analyzing the provided image and answering questions about it.',
      }
    });

    return response.text || 'Sorry, I could not generate a response.';
  }
};
