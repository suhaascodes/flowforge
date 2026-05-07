import { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiCalendar, FiTag, FiUser } from 'react-icons/fi';
import { PRIORITY_META } from '../../constants/kanban';
import { formatDate } from '../../utils/formatters';

function initialsFromName(name) {
  if (!name) {
    return '?';
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function KanbanTaskCard({ task, pending = false, onOpenDetail, canManageTasks = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !canManageTasks,
    data: {
      type: 'task',
      task,
      status: task.status,
    },
  });

  const priorityStyle = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const hasDueDate = Boolean(task.dueDate);
  const hasTags = Array.isArray(task.tags) && task.tags.length > 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  const assigneeInitials = useMemo(() => initialsFromName(task.assignedTo?.name), [task.assignedTo?.name]);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="group rounded-2xl border border-white/10 bg-[#111a2b]/90 p-3.5 shadow-[0_12px_28px_rgba(2,6,23,0.32)] transition hover:-translate-y-[1px] hover:border-cyan-300/25 hover:bg-[#122036]"
    >
      <button
        type="button"
        onClick={() => onOpenDetail(task.id)}
        className="mb-2 block w-full text-left"
      >
        <h4 className="line-clamp-2 text-sm font-medium leading-6 tracking-[-0.01em] text-slate-100">{task.title}</h4>
      </button>

      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${priorityStyle.className}`}>
          {priorityStyle.label}
        </span>
        {pending ? (
          <span className="rounded-full bg-cyan-300/15 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cyan-100">
            Syncing
          </span>
        ) : null}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5">
          <FiUser className="h-3 w-3" />
          {task.assignedTo?.name || 'Unassigned'}
        </span>
        {hasDueDate ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5">
            <FiCalendar className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        ) : null}
      </div>

      {hasTags ? (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
            >
              <FiTag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="mb-2 text-[11px] text-slate-500">No tags</p>
      )}

      <div className="flex items-center justify-between">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-300/15 text-[10px] font-semibold text-cyan-100 ring-1 ring-cyan-300/20">
          {assigneeInitials}
        </span>
        {canManageTasks ? (
          <button
            type="button"
            className="cursor-grab rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-400 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            Drag
          </button>
        ) : null}
      </div>
    </article>
  );
}
