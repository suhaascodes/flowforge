import { motion } from 'framer-motion';
import { FiLayers } from 'react-icons/fi';

export default function ModulePlaceholderPage({ title, description }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel-strong rounded-[1.5rem] border-dashed p-6 text-center sm:p-8"
    >
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/20">
        <FiLayers className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-300">{description}</p>
      <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-slate-500">Phase-ready placeholder</p>
    </motion.section>
  );
}
