import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  buildPaginationMeta,
  buildSearchFilter,
  buildSortObject,
  normalizePagination,
} from '../services/queryService.js';
import { applyTaskChanges, createTaskHistoryForCreation, normalizeTaskInput } from '../services/taskService.js';
import { sendPaginatedSuccess, sendSuccess } from '../utils/response.js';
import {
  buildAccessibleTaskQuery,
  ensureTaskAccess,
  ensureUserExists,
  loadTaskById,
  withTaskRelations,
} from '../services/taskAccessService.js';

export const listTasks = asyncHandler(async (req, res) => {
  const currentUser = req.currentUser;
  const { page, limit, skip } = normalizePagination(req.query);
  const sort = buildSortObject(req.query, '-createdAt');
  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.priority) {
    filters.priority = req.query.priority;
  }

  if (req.query.assignedTo) {
    filters.assignedTo = req.query.assignedTo;
  }

  if (req.query.createdBy) {
    filters.createdBy = req.query.createdBy;
  }

  if (req.query.dueDate) {
    filters.dueDate = req.query.dueDate;
  }

  const searchFilter = buildSearchFilter(req.query.search, ['title', 'description', 'tags']);
  const query = buildAccessibleTaskQuery(currentUser, filters, searchFilter);

  const [total, tasks] = await Promise.all([
    Task.countDocuments(query),
    withTaskRelations(Task.find(query).sort(sort).skip(skip).limit(limit)).lean(),
  ]);

  return sendPaginatedSuccess(res, tasks, buildPaginationMeta({ page, limit, total }), 'Tasks fetched successfully');
});

export const getTaskById = asyncHandler(async (req, res) => {
  await ensureTaskAccess(req.currentUser, req.params.id);
  const task = await loadTaskById(req.params.id);

  return sendSuccess(res, { task }, 'Task fetched successfully');
});

export const createTask = asyncHandler(async (req, res) => {
  const normalizedInput = normalizeTaskInput(req.body);
  await ensureUserExists(normalizedInput.assignedTo, 'assignedTo');

  const task = await Task.create({
    ...normalizedInput,
    createdBy: req.userId,
  });

  task.history.push(createTaskHistoryForCreation(task, req.userId));
  await task.save();

  const populatedTask = await loadTaskById(task._id);

  return sendSuccess(res, { task: populatedTask }, 'Task created successfully', 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  await ensureTaskAccess(req.currentUser, req.params.id);
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const normalizedInput = normalizeTaskInput(req.body);

  if (Object.prototype.hasOwnProperty.call(normalizedInput, 'assignedTo')) {
    await ensureUserExists(normalizedInput.assignedTo, 'assignedTo');
  }

  const historyEntries = applyTaskChanges(task, normalizedInput, req.userId);

  if (historyEntries.length > 0) {
    task.history.push(...historyEntries);
  }

  await task.save();

  const updatedTask = await loadTaskById(task._id);

  return sendSuccess(res, { task: updatedTask }, 'Task updated successfully');
});

export const deleteTask = asyncHandler(async (req, res) => {
  await ensureTaskAccess(req.currentUser, req.params.id);
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return sendSuccess(res, { deletedId: task._id }, 'Task deleted successfully');
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  await ensureTaskAccess(req.currentUser, req.params.id);
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const previousStatus = task.status;
  const nextStatus = req.body.status;

  if (previousStatus !== nextStatus) {
    task.status = nextStatus;
    task.history.push({
      action: 'status_changed',
      field: 'status',
      oldValue: previousStatus,
      newValue: nextStatus,
      changedBy: req.userId,
      timestamp: new Date(),
    });
  }

  await task.save();

  const updatedTask = await loadTaskById(task._id);

  return sendSuccess(res, { task: updatedTask }, 'Task status updated successfully');
});

export const assignTask = asyncHandler(async (req, res) => {
  await ensureTaskAccess(req.currentUser, req.params.id);
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const assignedTo = req.body.assignedTo || null;

  if (assignedTo) {
    await ensureUserExists(assignedTo, 'assignedTo');
  }

  if (String(task.assignedTo ?? '') !== String(assignedTo ?? '')) {
    const previousAssignee = task.assignedTo ?? null;
    task.assignedTo = assignedTo;
    task.history.push({
      action: 'assigned',
      field: 'assignedTo',
      oldValue: previousAssignee,
      newValue: assignedTo,
      changedBy: req.userId,
      timestamp: new Date(),
    });
  }

  await task.save();

  const updatedTask = await loadTaskById(task._id);

  return sendSuccess(res, { task: updatedTask }, 'Task assignment updated successfully');
});

export default {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask,
};