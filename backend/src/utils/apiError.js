/**
 * Custom Operational API Error Class
 * Enables throwing standardized error payloads with HTTP status codes.
 */

export class ApiError extends Error {
  constructor(statusCode, message, errorCode = 'ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Access denied: insufficient permissions') {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message, 'CONFLICT');
  }

  static unprocessable(message = 'Validation failed', details = null) {
    return new ApiError(422, message, 'VALIDATION_ERROR', details);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR');
  }
}
