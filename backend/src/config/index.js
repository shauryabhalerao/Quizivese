import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  cors: {
    allowedOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map(origin => origin.trim())
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '300', 10) // 300 requests per IP per window
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_quiziverse',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'quiziverse_db'
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'gemini',
    apiKey: process.env.AI_API_KEY || ''
  }
};
