import { Router } from 'express';
import { uploadImage } from './controllers/uploadController';
import { handleChat } from './controllers/chatController';
import { analyzeImage, chatWithImage } from './controllers/analysisController';
import multer from 'multer';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Image upload endpoint
router.post('/upload', upload.single('image'), uploadImage);

// Analysis endpoint (Server-side Gemini)
router.post('/analyze', analyzeImage);

// Chat with image context (Server-side Gemini)
router.post('/chat-with-image', chatWithImage);

// Chat endpoint (Legacy/General)
router.post('/chat', handleChat);

export default router;
