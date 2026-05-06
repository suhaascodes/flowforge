import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import DashboardCard from './DashboardCard';

export default function QuickActionsSection({ actions, loading = false }) {
  return (
    <DashboardCard hover={false}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-[-0.02em] text-white">Quick Actions</h3>
          <p className="mt-1 text-xs text-slate-400">Shortcuts for common workspace moves.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">Fast shortcuts</span>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      ) : actions.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.06]"
            >
              <div className="mb-2 flex items-center justify-between text-slate-100">
                <p className="text-sm font-medium tracking-[-0.01em]">{action.label}</p>
                <FiArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-cyan-200" />
              </div>
              <p className="text-xs leading-6 text-slate-400">{action.detail}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center">
          <p className="text-sm font-medium text-slate-200">No quick actions configured.</p>
          <p className="mt-1 text-xs text-slate-400">Shortcut automations will appear once modules are connected.</p>
        </div>
      )}
    </DashboardCard>
  );
}
