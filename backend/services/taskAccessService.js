import User from '../models/User.js';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

export function withTaskRelations(taskQuery) {
  return taskQuery.populate([
    { path: 'createdBy', select: 'name email role avatar' },
    { path: 'assignedTo', select: 'name email role avatar' },
  ]);
}

export async function loadTaskById(taskId) {
  return withTaskRelations(Task.findById(taskId)).lean();
}

export async function loadTaskForAuthorization(taskId) {
  return Task.findById(taskId).select('_id title createdBy assignedTo status priority').lean();
}

export function canUserAccessTask(currentUser, task) {
  if (!currentUser || !task) {
    return false;
  }

  if (currentUser.role === 'admin') {
    return true;
  }

  return String(task.createdBy) === String(currentUser._id) || String(task.assignedTo || '') === String(currentUser._id);
}

export async function ensureTaskAccess(currentUser, taskId) {
  const task = await loadTaskForAuthorization(taskId);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (!canUserAccessTask(currentUser, task)) {
    throw new AppError('You do not have permission to access this task.', 403);
  }

  return task;
}

export async function ensureUserExists(userId, fieldName = 'assignedTo') {
  if (!userId) {
    return null;
  }

  const user = await User.findById(userId).select('_id').lean();

  if (!user) {
    throw new AppError(`The ${fieldName} user was not found.`, 400);
  }

  return user;
}

export function buildAccessibleTaskQuery(currentUser, filters = {}, searchFilter = {}) {
  const conditions = [];

  if (Object.keys(filters).length > 0) {
    conditions.push(filters);
  }

  if (Object.keys(searchFilter).length > 0) {
    conditions.push(searchFilter);
  }

  if (currentUser.role !== 'admin') {
    conditions.push({
      $or: [{ createdBy: currentUser._id }, { assignedTo: currentUser._id }],
    });
  }

  return conditions.length > 0 ? { $and: conditions } : {};
}

export default {
  withTaskRelations,
  loadTaskById,
  loadTaskForAuthorization,
  canUserAccessTask,
  ensureTaskAccess,
  ensureUserExists,
  buildAccessibleTaskQuery,
};