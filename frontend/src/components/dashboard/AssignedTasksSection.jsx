import { FiArrowRight } from 'react-icons/fi';
import DashboardCard from './DashboardCard';

function PriorityBadge({ priority }) {
  const tones = {
    High: 'border-rose-300/30 bg-rose-300/10 text-rose-100',
    Medium: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
    Low: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
  };

  return (
    <span className={`rounded-lg border px-2 py-0.5 text-xs ${tones[priority] || tones.Low}`}>
      {priority}
    </span>
  );
}

export default function AssignedTasksSection({ tasks, loading = false }) {
  return (
    <DashboardCard className="h-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-[-0.02em] text-white">Assigned Tasks</h3>
          <p className="mt-1 text-xs text-slate-400">Work queued for your current focus window.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-cyan-200 transition hover:text-cyan-100">
          View all
          <FiArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5">
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      ) : tasks.length ? (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-cyan-300/25 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-6 tracking-[-0.01em] text-slate-100">{task.title}</h4>
                <PriorityBadge priority={task.priority} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-white/5 px-2.5 py-0.5">{task.status}</span>
                <span>Due {task.due}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center">
          <p className="text-sm font-medium text-slate-200">You are all caught up.</p>
          <p className="mt-1 text-xs text-slate-400">New assignments will appear when your team shares tasks.</p>
        </div>
      )}
    </DashboardCard>
  );
}
