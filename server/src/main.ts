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
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

app.use(cors({
  origin: frontendUrl,
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

app.listen(port, () => {
  console.log(`[Server] Running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
