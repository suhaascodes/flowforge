import { motion } from 'framer-motion';

export default function AuthShell({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.12),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-center"
      >
        <section className="w-full lg:w-1/2">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
            FlowForge Auth
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">{subtitle}</p>
        </section>

        <section className="w-full lg:w-1/2">{children}</section>
      </motion.div>
    </div>
  );
}