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
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-[-0.02em] text-white">Team Overview</h3>
          <p className="mt-1 text-xs text-slate-400">Team load distribution and active contributors.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
          {members.length} contributors
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5">
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/10" />
              <div className="h-2 w-full animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      ) : members.length ? (
        <div className="space-y-2.5">
          {members.map((member) => (
            <article
              key={member.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-violet-300/15 text-xs font-semibold text-violet-100 ring-1 ring-violet-300/20">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium tracking-[-0.01em] text-white">{member.name}</p>
                  <p className="truncate text-xs text-slate-400">{member.role}</p>
                </div>
                <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300">{member.workload}%</span>
              </div>
              <WorkloadBar value={member.workload} />
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center">
          <p className="text-sm font-medium text-slate-200">No team members found.</p>
          <p className="mt-1 text-xs text-slate-400">Invite colleagues to unlock collaboration insights.</p>
        </div>
      )}
    </DashboardCard>
  );
}
