import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { taskAPI, userAPI } from '../api';
import TaskCreateModal from '../components/kanban/TaskCreateModal';
import { TASK_STATUSES } from '../constants';
import { KANBAN_COLUMN_META, PRIORITY_META } from '../constants/kanban';
import { useAuth } from '../context/AuthContext';
import { createKanbanTask, mapApiTask } from '../services/kanbanService';
import { formatDate, formatRelativeTime, truncateText } from '../utils/formatters';

const AUTO_REFRESH_MS = 15000;

export default function TaskWorkspacePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
  });

  const fetchUsersForWorkspace = useCallback(async () => {
    if (!user) {
      return [];
    }

    if (!isAdmin) {
      return [user];
    }

    const response = await userAPI.getAll({ limit: 100, isActive: true });
    return response?.data?.data || [];
  }, [isAdmin, user]);

  const fetchTasksForWorkspace = useCallback(async () => {
    const params = {
      limit: 100,
      sortOrder: 'desc',
    };

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.priority) {
      params.priority = filters.priority;
    }

    const response = await taskAPI.getAll(params);
    return (response?.data?.data || []).map(mapApiTask);
  }, [filters.priority, filters.search, filters.status]);

  const loadWorkspace = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError('');
      const [nextTasks, nextUsers] = await Promise.all([fetchTasksForWorkspace(), fetchUsersForWorkspace()]);
      setTasks(nextTasks);
      setUsers(nextUsers);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load task workspace.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchTasksForWorkspace, fetchUsersForWorkspace]);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadWorkspace();
  }, [loadWorkspace, user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      loadWorkspace(true);
    }, AUTO_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [loadWorkspace, user]);

  const statusOptions = useMemo(
    () =>
      Object.entries(KANBAN_COLUMN_META).map(([value, meta]) => ({
        value,
        label: meta.title,
      })),
    [],
  );

  const handleCreateTask = async (formData) => {
    if (!isAdmin) {
      return;
    }

    try {
      setSavingTask(true);
      await createKanbanTask(formData);
      await loadWorkspace(true);
    } finally {
      setSavingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!isAdmin) {
      return;
    }

    try {
      setError('');
      await taskAPI.delete(taskId);
      await loadWorkspace(true);
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || 'Unable to delete task.');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    if (!isAdmin) {
      return;
    }

    try {
      setError('');
      await taskAPI.updateStatus(taskId, status);
      await loadWorkspace(true);
    } catch (statusError) {
      setError(statusError?.response?.data?.message || 'Unable to update task status.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-300/10 via-blue-400/10 to-violet-300/10 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Task Workspace</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Focused list view for task execution.</h2>
          <p className="mt-2 text-sm text-slate-300">
            {tasks.length} visible tasks. Auto-refresh every {AUTO_REFRESH_MS / 1000}s.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadWorkspace(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {isAdmin ? (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:brightness-110"
            >
              <FiPlus className="h-4 w-4" />
              New Task
            </button>
          ) : null}
        </div>
      </motion.section>

      <section className="grid gap-3 rounded-2xl border border-white/10 bg-[#0d1628]/90 p-3.5 sm:grid-cols-3">
        <input
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
          placeholder="Search by title, description, or tag"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none"
        >
          <option value="" className="bg-[#0d1628]">All Statuses</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#0d1628]">
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none"
        >
          <option value="" className="bg-[#0d1628]">All Priorities</option>
          {Object.entries(PRIORITY_META).map(([value, meta]) => (
            <option key={value} value={value} className="bg-[#0d1628]">
              {meta.label}
            </option>
          ))}
        </select>
      </section>

      {error ? (
        <div className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}

      <section className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
            <p className="text-sm font-medium text-slate-200">No tasks found</p>
            <p className="mt-1 text-xs text-slate-500">
              {isAdmin ? 'Create a task to get started.' : 'Assigned tasks will appear here.'}
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;
            const statusLabel = KANBAN_COLUMN_META[task.status]?.title || task.status;

            return (
              <article
                key={task.id}
                className="rounded-2xl border border-white/10 bg-[#0d1628]/90 p-4 shadow-[0_10px_26px_rgba(2,6,23,0.28)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-white">{task.title}</h3>
                    <p className="mt-1 text-sm text-slate-300">{truncateText(task.description || 'No description', 120)}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Assignee: {task.assignedTo?.name || 'Unassigned'} | Due: {task.dueDate ? formatDate(task.dueDate) : 'None'} | Updated {formatRelativeTime(task.updatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs ${priority.className}`}>
                      {priority.label}
                    </span>

                    {isAdmin ? (
                      <select
                        value={task.status}
                        onChange={(event) => handleStatusChange(task.id, event.target.value)}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-300/40 focus:outline-none"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value} className="bg-[#0d1628]">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-300">{statusLabel}</span>
                    )}

                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-300/35 bg-rose-300/10 px-2.5 py-1 text-xs text-rose-100 hover:bg-rose-300/15"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {isAdmin ? (
        <TaskCreateModal
          open={createOpen}
          users={users}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreateTask}
          isSaving={savingTask}
        />
      ) : null}
    </div>
  );
}