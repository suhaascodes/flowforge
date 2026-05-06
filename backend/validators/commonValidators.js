import { param, query } from 'express-validator';

export function uuidParam(fieldName, message) {
  return param(fieldName).isUUID(4).withMessage(message || `${fieldName} must be a valid UUID`);
}

export function optionalUuidQuery(fieldName, message) {
  return query(fieldName).optional({ nullable: true }).isUUID(4).withMessage(message || `${fieldName} must be a valid UUID`);
}

export function paginationValidators() {
  return [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  ];
}

export function sortOrderValidator() {
  return query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc');
}

export function searchValidator() {
  return query('search').optional().isString().withMessage('search must be a string');
}

export function booleanQueryValidator(fieldName) {
  return query(fieldName).optional().isBoolean().withMessage(`${fieldName} must be a boolean`);
}

export default {
  uuidParam,
  optionalUuidQuery,
  paginationValidators,
  sortOrderValidator,
  searchValidator,
  booleanQueryValidator,
};