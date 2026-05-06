import { buildHistoryEntriesFromChanges, createHistoryEntry } from './historyService.js';

export function normalizeTags(tags) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export function normalizeTaskInput(input = {}) {
  const payload = {};

  if (Object.prototype.hasOwnProperty.call(input, 'title')) {
    payload.title = typeof input.title === 'string' ? input.title.trim() : input.title;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'description')) {
    payload.description = typeof input.description === 'string' ? input.description.trim() : input.description;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'status')) {
    payload.status = input.status;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'priority')) {
    payload.priority = input.priority;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'assignedTo')) {
    payload.assignedTo = input.assignedTo || null;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'dueDate')) {
    payload.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  }

  if (Object.prototype.hasOwnProperty.call(input, 'tags')) {
    payload.tags = normalizeTags(input.tags);
  }

  return payload;
}

function valuesAreEqual(left, right) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

export function applyTaskChanges(task, input = {}, changedBy) {
  const normalizedInput = normalizeTaskInput(input);
  const historyChanges = [];

  const fieldActionMap = {
    status: 'status_changed',
    priority: 'priority_updated',
    assignedTo: 'assigned',
  };

  for (const [field, nextValue] of Object.entries(normalizedInput)) {
    const currentValue = task[field];

    if (valuesAreEqual(currentValue, nextValue)) {
      continue;
    }

    task[field] = nextValue;

    historyChanges.push({
      action: fieldActionMap[field] || 'edited',
      field,
      oldValue: currentValue ?? null,
      newValue: nextValue ?? null,
    });
  }

  return buildHistoryEntriesFromChanges(historyChanges, changedBy);
}

export function createTaskHistoryForCreation(task, changedBy) {
  return createHistoryEntry({
    action: 'created',
    field: 'task',
    oldValue: null,
    newValue: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      tags: task.tags,
    },
    changedBy,
  });
}

export default {
  normalizeTags,
  normalizeTaskInput,
  applyTaskChanges,
  createTaskHistoryForCreation,
};