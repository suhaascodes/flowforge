import { motion } from 'framer-motion';

export default function DashboardCard({ children, className = '', hover = true }) {
  return (
    <motion.section
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className={`glass-panel rounded-[1.35rem] p-4 sm:p-5 ${className}`}
    >
      {children}
    </motion.section>
  );
}
