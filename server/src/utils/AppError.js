/**
 * Custom application operational error class.
 * Extends the native Error class to include HTTP status codes
 * and flag the error as operational for routing in middleware.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Descriptive error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.isOperational = true;

    // Capture the stack trace, keeping constructor out of it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
