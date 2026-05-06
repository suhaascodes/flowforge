import { motion } from 'framer-motion';

export default function ProtectedHomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-panel-strong rounded-[1.5rem] p-6 sm:p-8"
      >
        <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Authenticated</p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
          You are signed in successfully.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Route protection, persistent authentication, and session management are now active. Dashboard and task modules
          will be introduced in the next phase.
        </p>
      </motion.section>
    </main>
  );
}