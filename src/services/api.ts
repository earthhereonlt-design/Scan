import { AnalysisData } from '../components/AnalysisPanel';

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
   * Analyze image using backend API
   */
  async analyzeImage(base64Data: string, mimeType: string): Promise<AnalysisData> {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Data, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }

    return await response.json();
  },

  /**
   * Send a chat message with the image context via backend
   */
  async sendMessage(
    message: string, 
    history: Array<{ role: 'user' | 'model', parts: Array<{ text: string }> }>,
    base64Data: string,
    mimeType: string
  ): Promise<string> {
    const response = await fetch('/api/chat-with-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history, base64Data, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process chat request');
    }

    const result = await response.json();
    return result.text;
  }
};
