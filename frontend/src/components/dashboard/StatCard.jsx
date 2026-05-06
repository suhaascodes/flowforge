import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

const toneStyles = {
  cyan: 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/20',
  amber: 'bg-amber-300/15 text-amber-100 ring-1 ring-amber-300/20',
  emerald: 'bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-300/20',
  violet: 'bg-violet-300/15 text-violet-100 ring-1 ring-violet-300/20',
};

function AnimatedCounter({ target = 0, duration = 700 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return <>{value}</>;
}

export default function StatCard({ item, loading = false }) {
  const Icon = item.icon;
  const toneClass = useMemo(() => toneStyles[item.tone] || toneStyles.cyan, [item.tone]);

  return (
    <DashboardCard>
      {loading ? (
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-9 w-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="max-w-[70%] text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <span className={`inline-flex rounded-2xl p-2.5 ${toneClass}`}>
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.15rem]">
            <AnimatedCounter target={item.value} />
            {item.suffix || ''}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-2 text-xs leading-5 text-slate-400"
          >
            {item.delta}
          </motion.p>
        </>
      )}
    </DashboardCard>
  );
}
