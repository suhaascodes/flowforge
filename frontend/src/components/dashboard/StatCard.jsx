import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

const toneStyles = {
  cyan: 'bg-cyan-300/15 text-cyan-100',
  amber: 'bg-amber-300/15 text-amber-100',
  emerald: 'bg-emerald-300/15 text-emerald-100',
  violet: 'bg-violet-300/15 text-violet-100',
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
          <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
          <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-300">{item.label}</p>
            <span className={`inline-flex rounded-lg p-2 ${toneClass}`}>
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-semibold text-white sm:text-3xl">
            <AnimatedCounter target={item.value} />
            {item.suffix || ''}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-2 text-xs text-slate-400"
          >
            {item.delta}
          </motion.p>
        </>
      )}
    </DashboardCard>
  );
}
