import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import taskHistoryRoutes from './routes/historyRoutes.js';
import { notFound } from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { ensureDefaultAdmin } from './services/adminBootstrapService.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

app.disable('x-powered-by');

// Connect to database
connectDB()
  .then(() => ensureDefaultAdmin())
  .catch((error) => {
    console.error(`Failed to ensure default admin account: ${error.message}`);
  });

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/:taskId/history', taskHistoryRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

export default app;
