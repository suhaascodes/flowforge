import { TASK_PRIORITIES, TASK_STATUSES } from './index';

export const KANBAN_COLUMN_ORDER = [
  TASK_STATUSES.BACKLOG,
  TASK_STATUSES.TODO,
  TASK_STATUSES.IN_PROGRESS,
  TASK_STATUSES.REVIEW,
  TASK_STATUSES.TESTING,
  TASK_STATUSES.DONE,
];

export const KANBAN_COLUMN_META = {
  [TASK_STATUSES.BACKLOG]: {
    title: 'Backlog',
    tone: 'from-slate-500/30 to-slate-700/20',
  },
  [TASK_STATUSES.TODO]: {
    title: 'Todo',
    tone: 'from-amber-400/30 to-amber-700/20',
  },
  [TASK_STATUSES.IN_PROGRESS]: {
    title: 'In Progress',
    tone: 'from-blue-400/30 to-blue-700/20',
  },
  [TASK_STATUSES.REVIEW]: {
    title: 'Review',
    tone: 'from-violet-400/30 to-violet-700/20',
  },
  [TASK_STATUSES.TESTING]: {
    title: 'Testing',
    tone: 'from-fuchsia-400/30 to-fuchsia-700/20',
  },
  [TASK_STATUSES.DONE]: {
    title: 'Done',
    tone: 'from-emerald-400/30 to-emerald-700/20',
  },
};

export const PRIORITY_META = {
  [TASK_PRIORITIES.LOW]: {
    label: 'Low',
    className: 'border-emerald-300/35 bg-emerald-300/15 text-emerald-100',
  },
  [TASK_PRIORITIES.MEDIUM]: {
    label: 'Medium',
    className: 'border-sky-300/35 bg-sky-300/15 text-sky-100',
  },
  [TASK_PRIORITIES.HIGH]: {
    label: 'High',
    className: 'border-orange-300/35 bg-orange-300/15 text-orange-100',
  },
  [TASK_PRIORITIES.CRITICAL]: {
    label: 'Critical',
    className: 'border-rose-300/35 bg-rose-300/15 text-rose-100',
  },
};

export const EMPTY_TASK_TEMPLATE = {
  title: '',
  description: '',
  status: TASK_STATUSES.BACKLOG,
  priority: TASK_PRIORITIES.MEDIUM,
  assignedTo: '',
  dueDate: '',
  tags: '',
};
