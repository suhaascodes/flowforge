import { v4 as uuid } from 'uuid';

export function createHistoryEntry({ action, field, oldValue = null, newValue = null, changedBy }) {
  return {
    id: uuid(),
    action,
    field,
    oldValue,
    newValue,
    changedBy,
    timestamp: new Date(),
  };
}

export function buildHistoryEntriesFromChanges(changes, changedBy) {
  return changes.map((change) => createHistoryEntry({ ...change, changedBy }));
}

export default {
  createHistoryEntry,
  buildHistoryEntriesFromChanges,
};