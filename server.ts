import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './src/api/routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    console.log('Starting Vision AI Server...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    // Middleware to parse JSON bodies
    app.use(express.json());

    // Root health check for Railway/Hosting
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Mount API routes
    app.use('/api', apiRoutes);

    // Vite middleware for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Initializing Vite middleware...');
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      console.log('Serving static files from dist...');
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`>>> Server is running on port ${PORT}`);
      console.log(`>>> Health check: http://0.0.0.0:${PORT}/health`);
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
