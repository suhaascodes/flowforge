import { taskAPI, userAPI } from '../api/index';
import { KANBAN_COLUMN_ORDER } from '../constants/kanban';
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/index';

function normalizeTags(tags) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.filter(Boolean).map((tag) => String(tag).trim());
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }

  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    role: user.role,
  };
}

export function mapApiTask(task) {
  return {
    id: task._id || task.id,
    title: task.title,
    description: task.description || '',
    status: task.status || TASK_STATUSES.BACKLOG,
    priority: task.priority || TASK_PRIORITIES.MEDIUM,
    assignedTo: normalizeUser(task.assignedTo),
    createdBy: normalizeUser(task.createdBy),
    dueDate: task.dueDate || null,
    tags: normalizeTags(task.tags),
    history: Array.isArray(task.history) ? task.history : [],
    updatedAt: task.updatedAt,
    createdAt: task.createdAt,
  };
}

export function buildBoardState(tasks) {
  const tasksById = {};
  const columnTaskIds = KANBAN_COLUMN_ORDER.reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {});

  tasks.forEach((task) => {
    tasksById[task.id] = task;
    const targetStatus = KANBAN_COLUMN_ORDER.includes(task.status) ? task.status : TASK_STATUSES.BACKLOG;
    columnTaskIds[targetStatus].push(task.id);
  });

  return { tasksById, columnTaskIds };
}

export function buildTaskCreatePayload(formData) {
  return {
    title: formData.title.trim(),
    description: formData.description.trim(),
    status: formData.status,
    priority: formData.priority,
    assignedTo: formData.assignedTo || null,
    dueDate: formData.dueDate || null,
    tags: normalizeTags(formData.tags),
  };
}

export async function fetchKanbanBootstrap(currentUser) {
  const tasksPromise = taskAPI.getAll({ limit: 100, sortOrder: 'desc' });
  const profilePromise = userAPI.getProfile();
  const usersPromise = currentUser?.role === 'admin'
    ? userAPI.getAll({ limit: 100, isActive: true })
    : profilePromise;

  const [tasksResponse, profileResponse, usersResponse] = await Promise.all([
    tasksPromise,
    profilePromise,
    usersPromise,
  ]);

  const tasks = (tasksResponse?.data?.data || []).map(mapApiTask);
  const profileUser = normalizeUser(profileResponse?.data?.data?.user);
  const usersData = currentUser?.role === 'admin' ? usersResponse?.data?.data : [profileResponse?.data?.data?.user];
  const users = (Array.isArray(usersData) ? usersData : [usersData]).map(normalizeUser).filter(Boolean);

  if (profileUser && !users.some((user) => user.id === profileUser.id)) {
    users.unshift(profileUser);
  }

  return { tasks, users };
}

export async function createKanbanTask(payload) {
  const response = await taskAPI.create(payload);
  return mapApiTask(response?.data?.data?.task);
}

export async function moveTaskStatus(taskId, status) {
  const response = await taskAPI.updateStatus(taskId, status);
  return mapApiTask(response?.data?.data?.task);
}

export async function deleteKanbanTask(taskId) {
  await taskAPI.delete(taskId);
}
