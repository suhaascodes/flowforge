import { motion } from 'framer-motion';
import { FiLayers } from 'react-icons/fi';

export default function ModulePlaceholderPage({ title, description }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center shadow-[0_16px_40px_rgba(2,6,23,0.35)] sm:p-8"
    >
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-100">
        <FiLayers className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{description}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">Phase-ready placeholder</p>
    </motion.section>
  );
}
