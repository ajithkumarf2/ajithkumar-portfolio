import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*', // Can be restricted in production via env
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiting
app.use('/api', generalLimiter);

// API routes
app.use('/api', routes);

// Top-level health route
app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Centralized error handling
app.use(errorHandler);

export default app;
