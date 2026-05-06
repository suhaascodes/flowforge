import { FiActivity, FiCheckCircle, FiClock, FiUsers, FiZap, FiList, FiBarChart2, FiSettings } from 'react-icons/fi';

export const sidebarItems = [
  {
    id: 'overview',
    label: 'Overview',
    to: '/app',
    icon: FiActivity,
  },
  {
    id: 'kanban',
    label: 'Kanban',
    to: '/app/kanban',
    icon: FiList,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    to: '/app/tasks',
    icon: FiCheckCircle,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    to: '/app/analytics',
    icon: FiBarChart2,
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/app/settings',
    icon: FiSettings,
  },
];

export const dashboardStats = [
  {
    id: 'delivery',
    label: 'Delivery Velocity',
    value: 86,
    suffix: '%',
    delta: '+8.2% vs last week',
    icon: FiZap,
    tone: 'cyan',
  },
  {
    id: 'openTasks',
    label: 'Open Tasks',
    value: 42,
    delta: '12 due this sprint',
    icon: FiClock,
    tone: 'amber',
  },
  {
    id: 'completed',
    label: 'Completed Today',
    value: 19,
    delta: '+4 from yesterday',
    icon: FiCheckCircle,
    tone: 'emerald',
  },
  {
    id: 'contributors',
    label: 'Active Teammates',
    value: 14,
    delta: '3 cross-functional squads',
    icon: FiUsers,
    tone: 'violet',
  },
];

export const recentActivities = [
  {
    id: 'a1',
    actor: 'Anaya Patel',
    action: 'moved Authentication Flow to review',
    time: '8m ago',
    category: 'status',
  },
  {
    id: 'a2',
    actor: 'Kai Morgan',
    action: 'assigned API contract validation to you',
    time: '24m ago',
    category: 'assignment',
  },
  {
    id: 'a3',
    actor: 'Diego Silva',
    action: 'commented on Dashboard polish checklist',
    time: '1h ago',
    category: 'comment',
  },
  {
    id: 'a4',
    actor: 'Platform Bot',
    action: 'confirmed deployment smoke checks passed',
    time: '2h ago',
    category: 'system',
  },
];

export const assignedTasks = [
  {
    id: 't1',
    title: 'Finalize responsive shell accessibility pass',
    priority: 'High',
    due: 'Today',
    status: 'In Progress',
  },
  {
    id: 't2',
    title: 'Wire dashboard analytics query adapters',
    priority: 'Medium',
    due: 'Tomorrow',
    status: 'Planned',
  },
  {
    id: 't3',
    title: 'Prepare kanban data contracts and fixtures',
    priority: 'Medium',
    due: 'May 10',
    status: 'Backlog',
  },
];

export const teamOverview = [
  {
    id: 'u1',
    name: 'Anaya Patel',
    role: 'Product Lead',
    initials: 'AP',
    workload: 72,
  },
  {
    id: 'u2',
    name: 'Kai Morgan',
    role: 'Backend Engineer',
    initials: 'KM',
    workload: 58,
  },
  {
    id: 'u3',
    name: 'Diego Silva',
    role: 'Frontend Engineer',
    initials: 'DS',
    workload: 64,
  },
  {
    id: 'u4',
    name: 'Rina Gomez',
    role: 'QA Specialist',
    initials: 'RG',
    workload: 46,
  },
];

export const quickActions = [
  {
    id: 'q1',
    label: 'Create Draft Spec',
    detail: 'Start a new planning brief for upcoming sprint goals.',
  },
  {
    id: 'q2',
    label: 'Run Team Check-in',
    detail: 'Open standup prompt with unresolved blockers.',
  },
  {
    id: 'q3',
    label: 'Generate Sprint Snapshot',
    detail: 'Export delivery and cycle-time summary cards.',
  },
];
