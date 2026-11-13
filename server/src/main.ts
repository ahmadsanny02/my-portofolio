import express from 'express';

import helmet from 'helmet';
import cors from 'cors';
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
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) =>
      url.trim().replace(/\/$/, ''),
    )
  : ['https://ahmadsanny.vercel.app', 'https://ahmadsanny2.vercel.app'];

export function isOriginAllowed(origin: string, production = isProduction) {
  if (allowedOrigins.includes(origin)) return true;
  // Any localhost port is accepted only outside production
  return !production && /^http:\/\/localhost:\d+$/.test(origin);
}

// Behind Vercel's proxy: needed so req.ip is the real client IP (rate limiting)
app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser clients (curl, server-side fetch) send no Origin header
      if (!origin) return callback(null, true);
      callback(null, isOriginAllowed(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }),
);
app.use(express.json({ limit: '100kb' }));

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

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
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
