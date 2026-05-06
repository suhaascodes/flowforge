import { body } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';

export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateRequest,
];

export const loginValidators = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required'),
  validateRequest,
];

export default {
  registerValidators,
  loginValidators,
};