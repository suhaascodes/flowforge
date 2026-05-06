import Task from '../models/Task.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { buildPaginationMeta, buildSortObject, escapeRegex, normalizePagination, paginateArray } from '../services/queryService.js';
import { sendPaginatedSuccess } from '../utils/response.js';
import { canUserAccessTask } from '../services/taskAccessService.js';

export const getTaskHistory = asyncHandler(async (req, res) => {
  const currentUser = req.currentUser;
  const task = await Task.findById(req.params.taskId)
    .populate({ path: 'history.changedBy', select: 'name email role avatar' })
    .lean();

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (!canUserAccessTask(currentUser, task)) {
    throw new AppError('You do not have permission to access this task history.', 403);
  }

  const { page, limit } = normalizePagination(req.query);
  const sort = buildSortObject(req.query, '-timestamp');

  let history = Array.isArray(task.history) ? [...task.history] : [];

  if (req.query.action) {
    history = history.filter((entry) => entry.action === req.query.action);
  }

  if (req.query.changedBy) {
    history = history.filter((entry) => String(entry.changedBy?._id || entry.changedBy) === String(req.query.changedBy));
  }

  if (req.query.search) {
    const pattern = new RegExp(escapeRegex(req.query.search), 'i');
    history = history.filter((entry) => pattern.test(entry.action || '') || pattern.test(entry.field || '') || pattern.test(JSON.stringify(entry.oldValue ?? '')) || pattern.test(JSON.stringify(entry.newValue ?? '')));
  }

  history.sort((left, right) => {
    const leftTime = new Date(left.timestamp).getTime();
    const rightTime = new Date(right.timestamp).getTime();

    if (sort.timestamp === 1) {
      return leftTime - rightTime;
    }

    return rightTime - leftTime;
  });

  const total = history.length;
  const historyPage = paginateArray(history, page, limit);

  return sendPaginatedSuccess(
    res,
    {
      taskId: task._id,
      taskTitle: task.title,
      history: historyPage,
    },
    buildPaginationMeta({ page, limit, total }),
    'Task history fetched successfully',
  );
});

export default {
  getTaskHistory,
};