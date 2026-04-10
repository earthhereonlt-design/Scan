import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import apiRoutes from './src/api/routes';

async function startServer() {
  try {
    console.log('Starting Vision AI Server...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Port:', process.env.PORT || 3000);
    
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Mount API routes FIRST
  app.use('/api', apiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('CRITICAL: Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(err => {
  console.error('Unhandled error in startServer:', err);
  process.exit(1);
});
