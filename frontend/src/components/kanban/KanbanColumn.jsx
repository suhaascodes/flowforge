import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { KANBAN_COLUMN_META } from '../../constants/kanban';
import KanbanTaskCard from './KanbanTaskCard';

export default function KanbanColumn({
  status,
  tasks,
  pendingStatusUpdates,
  loading,
  onOpenDetail,
  canManageTasks = false,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { type: 'column', status },
  });

  const meta = KANBAN_COLUMN_META[status];

  return (
    <section className="flex h-full min-h-[520px] w-[312px] shrink-0 flex-col rounded-[1.5rem] border border-white/10 bg-[#0d1628]/90 shadow-[0_18px_44px_rgba(2,6,23,0.38)]">
      <header className={`rounded-t-[1.5rem] border-b border-white/10 bg-gradient-to-r ${meta.tone} px-3.5 py-3`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-[-0.01em] text-slate-100">{meta.title}</h3>
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300">
            {tasks.length}
          </span>
        </div>
      </header>

      <div
        ref={setNodeRef}
        className={`kanban-scrollbar flex-1 space-y-2 overflow-y-auto px-2.5 py-3 transition ${
          isOver ? 'bg-cyan-300/[0.06]' : ''
        }`}
      >
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((task) => (
                <KanbanTaskCard
                  key={task.id}
                  task={task}
                  pending={Boolean(pendingStatusUpdates[task.id])}
                  onOpenDetail={onOpenDetail}
                  canManageTasks={canManageTasks}
                />
              ))}
            </div>
          </SortableContext>
        )}

        {!loading && tasks.length === 0 ? (
          <div className="mt-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center">
            <p className="text-sm font-medium text-slate-200">No tasks yet</p>
            <p className="mt-1 text-xs text-slate-500">Drag tasks here or create a new task.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
