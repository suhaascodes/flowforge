import DashboardCard from './DashboardCard';

function WorkloadBar({ value }) {
  return (
    <div className="h-2 w-full rounded-full bg-white/10">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function TeamOverviewSection({ members, loading = false }) {
  return (
    <DashboardCard className="h-full" hover={false}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Team Overview</h3>
        <span className="text-xs text-slate-400">{members.length} contributors</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-white/10 p-3">
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="h-2 w-full animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : members.length ? (
        <div className="space-y-2.5">
          {members.map((member) => (
            <article
              key={member.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.08]"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-300/20 text-xs font-semibold text-violet-100">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{member.name}</p>
                  <p className="truncate text-xs text-slate-400">{member.role}</p>
                </div>
                <span className="ml-auto text-xs text-slate-300">{member.workload}%</span>
              </div>
              <WorkloadBar value={member.workload} />
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-center">
          <p className="text-sm text-slate-300">No team members found.</p>
          <p className="mt-1 text-xs text-slate-400">Invite colleagues to unlock collaboration insights.</p>
        </div>
      )}
    </DashboardCard>
  );
}
