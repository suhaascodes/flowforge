import { query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import { optionalUuidQuery, paginationValidators, searchValidator, sortOrderValidator, uuidParam } from './commonValidators.js';

export const listHistoryValidators = [
  uuidParam('taskId', 'Task id must be a valid UUID'),
  ...paginationValidators(),
  query('action').optional().isString().withMessage('action must be a string'),
  optionalUuidQuery('changedBy', 'changedBy must be a valid UUID'),
  searchValidator(),
  sortOrderValidator(),
  validateRequest,
];

export default {
  listHistoryValidators,
};