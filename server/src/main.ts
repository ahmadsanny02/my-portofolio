import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import projectRoutes from './interfaces/routes/projectRoutes';
import certificateRoutes from './interfaces/routes/certificateRoutes';
import skillRoutes from './interfaces/routes/skillRoutes';
import contactRoutes from './interfaces/routes/contactRoutes';
import uploadRoutes from './interfaces/routes/uploadRoutes';
import { errorHandler } from './interfaces/middlewares/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling (must be last)
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`[Server] Running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
