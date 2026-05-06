import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

export function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new AppError('Validation failed', 400);
    error.details = result.array();
    return next(error);
  }

  return next();
}

export default validateRequest;