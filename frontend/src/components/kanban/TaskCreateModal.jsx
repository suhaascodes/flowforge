import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

  if (typeof document === 'undefined') {
    return null;
  }

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

  return createPortal(
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.section
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-[min(94vw,32rem)] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[1.5rem] border border-white/10 bg-[#0d1628]/98 p-5 shadow-[0_40px_100px_rgba(2,6,23,0.82)] sm:p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Kanban</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-white">Create Task</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 hover:bg-white/10"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/15"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/15"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/15"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/15"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/15"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-100 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/15"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/15"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-3.5 py-3 text-sm text-rose-100">{error}</div>
                ) : null}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_12px_28px_rgba(8,145,178,0.18)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FiPlus className="h-4 w-4" />
                    {isSaving ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.section>
          </div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
