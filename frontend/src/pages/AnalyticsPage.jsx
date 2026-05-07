import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FiRefreshCw } from 'react-icons/fi';
import { taskAPI } from '../api';
import { TASK_STATUSES } from '../constants';
import { KANBAN_COLUMN_META, PRIORITY_META } from '../constants/kanban';
import { useAuth } from '../context/AuthContext';
import { mapApiTask } from '../services/kanbanService';

const AUTO_REFRESH_MS = 15000;

const STATUS_COLOR_MAP = {
  backlog: '#64748b',
  todo: '#f59e0b',
  in_progress: '#60a5fa',
  review: '#a78bfa',
  testing: '#f472b6',
  done: '#34d399',
};

const PRIORITY_COLOR_MAP = {
  low: '#34d399',
  medium: '#60a5fa',
  high: '#fb923c',
  critical: '#fb7185',
};

function dayKey(dateString) {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
}

function shortDayLabel(key) {
  return new Date(`${key}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError('');
      const response = await taskAPI.getAll({ limit: 100, sortOrder: 'desc' });
      setTasks((response?.data?.data || []).map(mapApiTask));
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load analytics data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadAnalytics();
  }, [loadAnalytics, user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      loadAnalytics(true);
    }, AUTO_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [loadAnalytics, user]);

  const statusData = useMemo(() => {
    const counts = Object.keys(KANBAN_COLUMN_META).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    tasks.forEach((task) => {
      if (counts[task.status] !== undefined) {
        counts[task.status] += 1;
      }
    });

    return Object.entries(KANBAN_COLUMN_META).map(([status, meta]) => ({
      key: status,
      name: meta.title,
      value: counts[status],
      color: STATUS_COLOR_MAP[status],
    }));
  }, [tasks]);

  const priorityData = useMemo(() => {
    const counts = Object.keys(PRIORITY_META).reduce((acc, priority) => {
      acc[priority] = 0;
      return acc;
    }, {});

    tasks.forEach((task) => {
      if (counts[task.priority] !== undefined) {
        counts[task.priority] += 1;
      }
    });

    return Object.entries(PRIORITY_META).map(([priority, meta]) => ({
      key: priority,
      name: meta.label,
      value: counts[priority],
      color: PRIORITY_COLOR_MAP[priority],
    }));
  }, [tasks]);

  const weeklyTrend = useMemo(() => {
    const today = new Date();
    const keys = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      keys.push(date.toISOString().slice(0, 10));
    }

    const buckets = keys.reduce((acc, key) => {
      acc[key] = { key, label: shortDayLabel(key), created: 0, completed: 0 };
      return acc;
    }, {});

    tasks.forEach((task) => {
      const createdKey = dayKey(task.createdAt || task.updatedAt);
      if (buckets[createdKey]) {
        buckets[createdKey].created += 1;
      }

      const completedKey = dayKey(task.updatedAt || task.createdAt);
      if (task.status === TASK_STATUSES.DONE && buckets[completedKey]) {
        buckets[completedKey].completed += 1;
      }
    });

    return keys.map((key) => buckets[key]);
  }, [tasks]);

  const summary = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === TASK_STATUSES.DONE).length;
    const inProgress = tasks.filter((task) => task.status === TASK_STATUSES.IN_PROGRESS).length;
    const overdue = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TASK_STATUSES.DONE).length;

    return {
      total,
      done,
      inProgress,
      overdue,
      completionRate: total ? Math.round((done / total) * 100) : 0,
    };
  }, [tasks]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-300/10 via-blue-400/10 to-violet-300/10 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Analytics</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Live delivery signals from task activity.</h2>
          <p className="mt-2 text-sm text-slate-300">
            {isAdmin ? 'Organization-wide analytics view.' : 'Analytics for your assigned tasks.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadAnalytics(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
        >
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.section>

      {error ? (
        <div className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Visible Tasks" value={summary.total} />
        <MetricCard label="Completed" value={summary.done} />
        <MetricCard label="In Progress" value={summary.inProgress} />
        <MetricCard label="Overdue" value={summary.overdue} tone="rose" />
        <MetricCard label="Completion" value={`${summary.completionRate}%`} tone="emerald" />
      </section>

      <section className="grid gap-3 xl:grid-cols-3">
        <ChartCard title="Tasks by Status" subtitle="Current workflow distribution">
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Priority Mix" subtitle="Risk and urgency profile">
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={82} innerRadius={44} paddingAngle={2}>
                  {priorityData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="7-Day Activity" subtitle="Created vs completed trend">
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12 }} />
                <Line type="monotone" dataKey="created" stroke="#60a5fa" strokeWidth={2.2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="completed" stroke="#34d399" strokeWidth={2.2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </section>
    </div>
  );
}

function MetricCard({ label, value, tone = 'slate' }) {
  const toneMap = {
    slate: 'from-slate-300/10 to-slate-500/10 border-white/10',
    rose: 'from-rose-300/14 to-rose-500/10 border-rose-300/25',
    emerald: 'from-emerald-300/14 to-emerald-500/10 border-emerald-300/25',
  };

  return (
    <article className={`rounded-2xl border bg-gradient-to-r p-3.5 ${toneMap[tone] || toneMap.slate}`}>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">{value}</p>
    </article>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0d1628]/90 p-4">
      <h3 className="text-sm font-semibold tracking-[-0.02em] text-white">{title}</h3>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      <div className="mt-3">{children}</div>
    </article>
  );
}

function SkeletonChart() {
  return (
    <div className="h-[260px] animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
  );
}