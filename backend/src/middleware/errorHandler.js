import { ApiError } from '../utils/apiError.js';
import { config } from '../config/index.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Endpoint '${req.method} ${req.originalUrl}' not found on Quiziverse API`));
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // Log non-operational errors (unexpected crashes/exceptions)
  if (!err.isOperational) {
    console.error(`[UNHANDLED ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details && { details }),
      ...(!config.isProduction && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
};
