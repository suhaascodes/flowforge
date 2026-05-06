import { motion } from 'framer-motion';

export default function DashboardCard({ children, className = '', hover = true }) {
  return (
    <motion.section
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(2,6,23,0.35)] backdrop-blur-sm sm:p-5 ${className}`}
    >
      {children}
    </motion.section>
  );
}
