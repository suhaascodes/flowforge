// Status constants
export const TASK_STATUSES = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  TESTING: 'testing',
  DONE: 'done',
};

// Priority constants
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
};

// Activity action types
export const ACTIVITY_ACTIONS = {
  CREATED: 'created',
  STATUS_CHANGED: 'status_changed',
  ASSIGNED: 'assigned',
  COMMENTED: 'commented',
  PRIORITY_UPDATED: 'priority_updated',
  EDITED: 'edited',
};

// Status badge colors
export const STATUS_COLORS = {
  backlog: '#94a3b8',
  todo: '#f59e0b',
  in_progress: '#3b82f6',
  review: '#8b5cf6',
  testing: '#ec4899',
  done: '#10b981',
};

// Priority colors
export const PRIORITY_COLORS = {
  low: '#6ee7b7',
  medium: '#60a5fa',
  high: '#f97316',
  critical: '#ef4444',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  TASKS: '/api/tasks',
};
