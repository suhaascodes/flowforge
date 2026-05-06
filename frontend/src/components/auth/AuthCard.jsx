import { motion } from 'framer-motion';

export default function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_20px_65px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8"
    >
      {children}
    </motion.div>
  );
}