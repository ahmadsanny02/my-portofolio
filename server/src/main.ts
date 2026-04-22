import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import projectRoutes from './interfaces/routes/projectRoutes';
import { errorHandler } from './interfaces/middlewares/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[Server] Running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
