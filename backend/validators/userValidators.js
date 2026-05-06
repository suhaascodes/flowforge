import { body, query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import { booleanQueryValidator, paginationValidators, searchValidator, sortOrderValidator, uuidParam } from './commonValidators.js';

export const userIdValidator = [uuidParam('id', 'User id must be a valid UUID'), validateRequest];

export const createUserValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Role must be admin or member'),
  body('avatar').optional({ nullable: true }).isString().withMessage('Avatar must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  validateRequest,
];

export const updateUserValidators = [
  uuidParam('id', 'User id must be a valid UUID'),
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().trim().isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').optional().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Role must be admin or member'),
  body('avatar').optional({ nullable: true }).isString().withMessage('Avatar must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  validateRequest,
];

export const listUsersValidators = [
  ...paginationValidators(),
  query('role').optional().isIn(['admin', 'member']).withMessage('role must be admin or member'),
  booleanQueryValidator('isActive'),
  searchValidator(),
  sortOrderValidator(),
  validateRequest,
];

export default {
  userIdValidator,
  createUserValidators,
  updateUserValidators,
  listUsersValidators,
};