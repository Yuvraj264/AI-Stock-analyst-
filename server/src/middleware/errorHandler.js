import { env } from '../config/env.js';

/**
 * Express error handling middleware.
 * Intercepts all operational and unhandled errors, formats the response,
 * and handles database-specific error formatting (like Mongoose validations).
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error stack for debugging
  console.error(`[Error Handler] Catastrophic Error: ${err.message}`);
  if (err.stack && !env.isProduction) {
    console.error(err.stack);
  }

  // 1. Mongoose CastError (e.g., invalid ObjectId format)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // 2. Mongoose Duplicate Key Error (e.g., unique index violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ') || 'field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = { message, statusCode: 400 };
  }

  // 3. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const responseMessage = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message: responseMessage,
      statusCode,
      // Provide stack trace only in non-production environments
      ...(env.isProduction ? {} : { stack: err.stack })
    }
  });
};

export default errorHandler;
