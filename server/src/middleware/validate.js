import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

/**
 * Validates the company name request payload.
 * Ensuring companyName is a non-empty string.
 */
export const validateCompanyQuery = (req, res, next) => {
  const { companyName } = req.body;

  if (companyName === undefined || companyName === null) {
    return next(new AppError('companyName field is required in request body', 400));
  }

  if (typeof companyName !== 'string' || companyName.trim() === '') {
    return next(new AppError('companyName must be a valid, non-empty string', 400));
  }

  // Sanitize the input by trimming it
  req.body.companyName = companyName.trim();
  next();
};

/**
 * Validates that the request parameter ":id" is a valid MongoDB Object ID.
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('ID parameter is required', 400));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(`Invalid analysis ID format: "${id}". Must be a 24-character hexadecimal string.`, 400));
  }

  next();
};

export default {
  validateCompanyQuery,
  validateObjectId
};
