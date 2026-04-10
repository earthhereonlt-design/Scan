import { Router } from 'express';
import { uploadImage } from './controllers/uploadController.js';
import { handleChat } from './controllers/chatController.js';
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

// Chat endpoint (for history/processing)
router.post('/chat', handleChat);

export default router;
