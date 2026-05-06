import { FiActivity } from 'react-icons/fi';
import DashboardCard from './DashboardCard';

export default function RecentActivitySection({ activities, loading = false }) {
  return (
    <DashboardCard className="h-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-[-0.02em] text-white">Recent Activity</h3>
          <p className="mt-1 text-xs text-slate-400">Recent workspace updates and system signals.</p>
        </div>
        <FiActivity className="h-4 w-4 text-slate-400" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5">
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      ) : activities.length ? (
        <div className="space-y-2.5">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              <p className="text-sm leading-6 text-slate-200">
                <span className="font-medium text-white">{activity.actor}</span> {activity.action}
              </p>
              <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center">
          <p className="text-sm font-medium text-slate-200">No activity yet.</p>
          <p className="mt-1 text-xs text-slate-400">Actions taken by your team will appear here.</p>
        </div>
      )}
    </DashboardCard>
  );
}
