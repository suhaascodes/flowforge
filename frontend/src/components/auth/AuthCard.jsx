import { motion } from 'framer-motion';

export default function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-panel-strong rounded-[1.75rem] p-5 sm:p-7"
    >
      {children}
    </motion.div>
  );
}