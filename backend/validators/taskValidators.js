import { body, query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import { paginationValidators, searchValidator, sortOrderValidator, uuidParam } from './commonValidators.js';

export const taskIdValidator = [uuidParam('id', 'Task id must be a valid UUID'), validateRequest];

export const createTaskValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional({ nullable: true }).isString().withMessage('Description must be a string'),
  body('status').optional().isIn(['backlog', 'todo', 'in_progress', 'review', 'testing', 'done']).withMessage('Invalid task status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid task priority'),
  body('assignedTo').optional({ nullable: true }).isUUID(4).withMessage('assignedTo must be a valid UUID'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be a valid date'),
  body('tags').optional().custom((value) => Array.isArray(value) || typeof value === 'string').withMessage('tags must be an array or comma-separated string'),
  validateRequest,
];

export const updateTaskValidators = [
  uuidParam('id', 'Task id must be a valid UUID'),
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional({ nullable: true }).isString().withMessage('Description must be a string'),
  body('status').optional().isIn(['backlog', 'todo', 'in_progress', 'review', 'testing', 'done']).withMessage('Invalid task status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid task priority'),
  body('assignedTo').optional({ nullable: true }).isUUID(4).withMessage('assignedTo must be a valid UUID'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be a valid date'),
  body('tags').optional().custom((value) => Array.isArray(value) || typeof value === 'string').withMessage('tags must be an array or comma-separated string'),
  validateRequest,
];

export const updateStatusValidators = [
  uuidParam('id', 'Task id must be a valid UUID'),
  body('status').notEmpty().withMessage('Status is required').isIn(['backlog', 'todo', 'in_progress', 'review', 'testing', 'done']).withMessage('Invalid task status'),
  validateRequest,
];

export const assignTaskValidators = [
  uuidParam('id', 'Task id must be a valid UUID'),
  body('assignedTo').optional({ nullable: true }).isUUID(4).withMessage('assignedTo must be a valid UUID'),
  validateRequest,
];

export const listTasksValidators = [
  ...paginationValidators(),
  query('status').optional().isIn(['backlog', 'todo', 'in_progress', 'review', 'testing', 'done']).withMessage('Invalid task status'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid task priority'),
  searchValidator(),
  sortOrderValidator(),
  validateRequest,
];

export default {
  taskIdValidator,
  createTaskValidators,
  updateTaskValidators,
  updateStatusValidators,
  assignTaskValidators,
  listTasksValidators,
};