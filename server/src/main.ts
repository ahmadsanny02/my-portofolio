import express from 'express';

import helmet from 'helmet';
import dotenv from 'dotenv';
import projectRoutes from './interfaces/routes/projectRoutes';
import certificateRoutes from './interfaces/routes/certificateRoutes';
import skillRoutes from './interfaces/routes/skillRoutes';
import contactRoutes from './interfaces/routes/contactRoutes';
import uploadRoutes from './interfaces/routes/uploadRoutes';
import categoryRoutes from './interfaces/routes/categoryRoutes';
import issuerRoutes from './interfaces/routes/issuerRoutes';
import { errorHandler } from './interfaces/middlewares/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) =>
      url.trim().replace(/\/$/, ''),
    )
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://ahmadsanny.vercel.app',
      'https://ahmadsanny2.vercel.app',
    ];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^https:\/\/ahmadsanny[a-zA-Z0-9-]*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/issuers', issuerRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling (must be last)
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(
      `[Server] Running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`,
    );
  });
}

export default app;
