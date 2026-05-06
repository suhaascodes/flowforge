import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';
import { EMPTY_TASK_TEMPLATE, KANBAN_COLUMN_META, PRIORITY_META } from '../../constants/kanban';

export default function TaskCreateModal({ open, users, onClose, onSubmit, isSaving = false }) {
  const [form, setForm] = useState(EMPTY_TASK_TEMPLATE);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(EMPTY_TASK_TEMPLATE);
      setError('');
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || form.title.trim().length < 3) {
      setError('Task title must be at least 3 characters.');
      return;
    }

    try {
      await onSubmit(form);
      onClose();
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Unable to create task.');
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            aria-label="Close create task"
          />
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-[#0d1628] p-5 shadow-[0_40px_100px_rgba(2,6,23,0.8)] sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">Kanban</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Create Task</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/15 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                aria-label="Close"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="title" className="mb-1 block text-xs text-slate-300">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1 block text-xs text-slate-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add implementation details"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="status" className="mb-1 block text-xs text-slate-300">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none"
                  >
                    {Object.entries(KANBAN_COLUMN_META).map(([value, meta]) => (
                      <option key={value} value={value} className="bg-[#0d1628]">
                        {meta.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="mb-1 block text-xs text-slate-300">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none"
                  >
                    {Object.entries(PRIORITY_META).map(([value, meta]) => (
                      <option key={value} value={value} className="bg-[#0d1628]">
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="assignedTo" className="mb-1 block text-xs text-slate-300">
                    Assignee
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none"
                  >
                    <option value="" className="bg-[#0d1628]">
                      Unassigned
                    </option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id} className="bg-[#0d1628]">
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="mb-1 block text-xs text-slate-300">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="mb-1 block text-xs text-slate-300">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="frontend, auth, sprint-14"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
                />
              </div>

              {error ? (
                <div className="rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">{error}</div>
              ) : null}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FiPlus className="h-4 w-4" />
                  {isSaving ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
