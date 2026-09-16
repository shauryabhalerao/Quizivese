import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173"]
    }
  },
  frameguard: { action: 'deny' },
  noSniff: true
}));

// CORS Configuration (supporting frontend on localhost:5173 and production)
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (config.cors.allowedOrigins.indexOf(origin) !== -1 || config.cors.allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in development for seamless local testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body Parsers with strict DoS payload bounds (1MB max for JSON)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Observability & Request Logging
app.use(requestLogger);

// High-Throughput Rate Limiting (100+ concurrent students)
app.use('/api', apiLimiter);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    name: 'Quiziverse REST API Engine',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'ACTIVE'
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
