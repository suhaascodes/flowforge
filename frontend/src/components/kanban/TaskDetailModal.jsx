import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { FiCalendar, FiTrash2, FiUser, FiX } from 'react-icons/fi';
import { KANBAN_COLUMN_META, PRIORITY_META } from '../../constants/kanban';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export default function TaskDetailModal({
  open,
  task,
  onClose,
  onMoveStatus,
  onDeleteTask,
  isSaving = false,
  isDeleting = false,
  canManageTasks = false,
}) {
  if (!task) {
    return null;
  }

  const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;

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
            aria-label="Close task detail"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.section
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="pointer-events-auto w-[min(94vw,42rem)] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[1.5rem] border border-white/10 bg-[#0d1628]/98 p-5 shadow-[0_40px_100px_rgba(2,6,23,0.82)] sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Task Detail</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">{task.title}</h3>
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

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                  <p className="text-xs text-slate-400">Priority</p>
                  <span className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs ${priority.className}`}>
                    {priority.label}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                  <p className="text-xs text-slate-400">Current Status</p>
                  <p className="mt-2 text-sm font-medium tracking-[-0.01em] text-slate-100">
                    {KANBAN_COLUMN_META[task.status]?.title || task.status}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                  <p className="text-xs text-slate-400">Assignee</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-100">
                    <FiUser className="h-4 w-4 text-slate-400" />
                    {task.assignedTo?.name || 'Unassigned'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                  <p className="text-xs text-slate-400">Due Date</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-100">
                    <FiCalendar className="h-4 w-4 text-slate-400" />
                    {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="text-xs text-slate-400">Description</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {task.description || 'No description provided for this task yet.'}
                </p>
              </div>

              {canManageTasks ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-slate-400">Move to</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(KANBAN_COLUMN_META).map(([status, meta]) => (
                      <button
                        key={status}
                        type="button"
                        disabled={status === task.status || isSaving}
                        onClick={() => onMoveStatus(task.id, status)}
                        className={`rounded-full border px-2.5 py-1.5 text-xs transition ${
                          status === task.status
                            ? 'border-cyan-300/30 bg-cyan-300/15 text-cyan-100'
                            : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {meta.title}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {canManageTasks ? (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => onDeleteTask(task.id)}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-300/35 bg-rose-300/10 px-3 py-2 text-xs font-medium text-rose-100 hover:bg-rose-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                    {isDeleting ? 'Deleting...' : 'Delete Task'}
                  </button>
                </div>
              ) : null}

              <p className="mt-4 text-xs text-slate-500">Updated {formatRelativeTime(task.updatedAt)}</p>
            </motion.section>
          </div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
